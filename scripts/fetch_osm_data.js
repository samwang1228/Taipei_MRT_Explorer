import fs from 'fs';
import https from 'https';
import http from 'http';

// Helper to fetch data
const fetchUrl = (url) => {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        client.get(url, { headers: { 'User-Agent': 'TaipeiMRTExplorer/1.0' } }, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    console.error(`Error parsing JSON:`, e.message);
                    resolve(null);
                }
            });
        }).on('error', reject);
    });
};

// Sleep helper to respect rate limits
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const main = async () => {
    console.log('Reading stations data...');
    const stations = JSON.parse(fs.readFileSync('src/data/raw_stations.json', 'utf-8'));

    let allPlaces = [];

    // We will process a subset of stations to avoid hitting rate limits too hard during dev
    // Or process all with delays. Let's try the first 10 stations for now to verify.
    // User wants "more data", so let's try to get a good amount.
    // Overpass allows ~10k nodes easily.

    console.log(`Found ${stations.length} stations. Starting fetch...`);

    for (const [index, station] of stations.entries()) {
        console.log(`[${index + 1}/${stations.length}] Fetching around ${station.StationName}...`);

        // Query: 500m radius around station
        // Categories: restaurant, cafe, fast_food, food_court, museum, attraction, department_store, mall
        const query = `
      [out:json][timeout:25];
      (
        node["amenity"~"restaurant|cafe|fast_food|food_court"](around:500,${station.Lat},${station.Lon});
        node["tourism"~"museum|attraction|gallery|artwork"](around:500,${station.Lat},${station.Lon});
        node["shop"~"department_store|mall"](around:500,${station.Lat},${station.Lon});
      );
      out body;
    `;

        const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

        try {
            const result = await fetchUrl(url);
            if (result && result.elements) {
                console.log(`  -> Found ${result.elements.length} places.`);

                // Add station info to each place for easier processing later
                const placesWithStation = result.elements.map(place => ({
                    ...place,
                    _nearest_station: station.StationCode,
                    _distance_center: { lat: station.Lat, lon: station.Lon }
                }));

                allPlaces = allPlaces.concat(placesWithStation);
            }
        } catch (err) {
            console.error(`  -> Failed to fetch: ${err.message}`);
        }

        // Be nice to the API
        await sleep(2000);
    }

    console.log(`Total places fetched: ${allPlaces.length}`);

    // Deduplicate by OSM ID
    const uniquePlaces = Array.from(new Map(allPlaces.map(item => [item.id, item])).values());
    console.log(`Unique places: ${uniquePlaces.length}`);

    fs.writeFileSync('src/data/raw_osm_places.json', JSON.stringify(uniquePlaces, null, 2));
    console.log('Saved to src/data/raw_osm_places.json');
};

main();
