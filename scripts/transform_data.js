import fs from 'fs';

// Helper to calculate distance between two coordinates in km
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

const main = () => {
    console.log('Transforming OSM data...');

    let rawPlaces = [];
    try {
        rawPlaces = JSON.parse(fs.readFileSync('src/data/raw_osm_places.json', 'utf-8'));
    } catch (e) {
        console.error('Could not read OSM data, falling back to simulated data.');
        rawPlaces = JSON.parse(fs.readFileSync('src/data/raw_attractions.json', 'utf-8'));
    }

    const rawStations = JSON.parse(fs.readFileSync('src/data/raw_stations.json', 'utf-8'));

    const places = rawPlaces.map(item => {
        // OSM data structure: { id, lat, lon, tags: { name, amenity, tourism, shop, ... }, _nearest_station }
        // Simulated data structure: { id, name, lat, long, category, ... }

        const isOsm = !!item.tags;
        const name = isOsm ? (item.tags.name || item.tags['name:en'] || item.tags['name:zh']) : item.name;

        if (!name) return null; // Skip unnamed places

        const lat = isOsm ? item.lat : item.lat;
        const lon = isOsm ? item.lon : item.long;

        // Find nearest station (re-calculate to be safe, or use cached)
        let nearestStation = null;
        let minDist = Infinity;

        // Optimization: if _nearest_station exists, verify it first
        if (item._nearest_station) {
            // We could trust it, but let's re-verify distance for display string
            const station = rawStations.find(s => s.StationCode === item._nearest_station);
            if (station) {
                minDist = getDistanceFromLatLonInKm(lat, lon, station.Lat, station.Lon);
                nearestStation = station;
            }
        } else {
            for (const station of rawStations) {
                const dist = getDistanceFromLatLonInKm(lat, lon, station.Lat, station.Lon);
                if (dist < minDist) {
                    minDist = dist;
                    nearestStation = station;
                }
            }
        }

        // Map Category
        let mainCategory = 'Leisure';
        let subCategory = null;
        let tags = [];

        if (isOsm) {
            const t = item.tags;
            if (t.amenity === 'restaurant' || t.amenity === 'food_court' || t.amenity === 'fast_food') {
                mainCategory = 'Food';
                // Guess sub-category from cuisine or name
                if (t.cuisine) {
                    if (t.cuisine.includes('japanese') || t.cuisine.includes('sushi')) subCategory = 'Japanese';
                    else if (t.cuisine.includes('korean')) subCategory = 'Korean';
                    else if (t.cuisine.includes('chinese') || t.cuisine.includes('taiwanese')) subCategory = 'Chinese';
                    else if (t.cuisine.includes('italian') || t.cuisine.includes('pizza')) subCategory = 'Italian'; // We don't have Italian filter but good to know
                    else if (t.cuisine.includes('thai')) subCategory = 'Thai';
                    else if (t.cuisine.includes('vietnamese')) subCategory = 'Vietnamese';
                }
                // Fallback guess by name
                if (!subCategory) {
                    if (name.includes('壽司') || name.includes('拉麵') || name.includes('日式')) subCategory = 'Japanese';
                    else if (name.includes('韓') || name.includes('泡菜')) subCategory = 'Korean';
                    else if (name.includes('鍋')) subCategory = 'HotPot';
                    else if (name.includes('牛排')) subCategory = 'Steak'; // Not in filter but okay
                }
            } else if (t.amenity === 'cafe') {
                mainCategory = 'Leisure';
                subCategory = 'Cafe';
            } else if (t.tourism === 'museum' || t.tourism === 'artwork' || t.tourism === 'gallery') {
                mainCategory = 'Culture';
            } else if (t.tourism === 'attraction' || t.tourism === 'viewpoint') {
                mainCategory = 'Leisure'; // or Culture
            } else if (t.shop === 'mall' || t.shop === 'department_store') {
                mainCategory = 'Shopping';
            } else if (t.amenity === 'night_market') { // OSM tag for night market might vary
                mainCategory = 'Shopping';
                subCategory = 'NightMarket';
            }

            // Add OSM tags to display tags
            if (t.cuisine) tags.push(t.cuisine);
            if (t.amenity) tags.push(t.amenity);
        } else {
            // Legacy logic for simulated data
            if (item.category === '美食' || item.category === '夜市') {
                mainCategory = 'Food';
                if (item.category === '夜市') subCategory = 'NightMarket';
            } else if (item.category === '文化' || item.category === '古蹟' || item.category === '廟宇' || item.category === '文創') {
                mainCategory = 'Culture';
            } else if (item.category === '購物' || item.category === '商圈') {
                mainCategory = 'Shopping';
            }
            tags.push(item.category);
        }

        // Generate random rating between 3.5 and 5.0 (Real world is harsher than mock)
        const rating = (Math.random() * (5.0 - 3.5) + 3.5).toFixed(1);

        // Image Handling
        let imageUrl = `https://placehold.co/600x400?text=${encodeURIComponent(name.substring(0, 10))}`;

        if (isOsm) {
            // 1. Try direct image tag
            if (item.tags.image) {
                imageUrl = item.tags.image;
            }
            // 2. Try wikimedia commons (would need extra processing to resolve URL, skipping for now but logic is here)
            // else if (item.tags.wikimedia_commons) { ... }
        }

        return {
            id: `osm${item.id}`,
            name: name,
            mrt_station: nearestStation ? nearestStation.StationCode : 'Unknown',
            main_category: mainCategory,
            sub_category: subCategory,
            rating: parseFloat(rating),
            accessibility: Math.random() > 0.5, // 50% chance
            image: imageUrl,
            distance: nearestStation ? `步行 ${Math.ceil(minDist * 15)} 分鐘` : '未知',
            tags: tags.slice(0, 3) // Limit tags
        };
    }).filter(p => p !== null);

    console.log(`Transformed ${places.length} places.`);
    fs.writeFileSync('src/data/places.json', JSON.stringify(places, null, 2));
};

main();
