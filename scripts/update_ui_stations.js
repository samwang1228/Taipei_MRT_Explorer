import fs from 'fs';

const main = () => {
    const rawStations = JSON.parse(fs.readFileSync('src/data/raw_stations.json', 'utf-8'));

    // Group by Line ID (R, BL, G, O, BR, Y)
    const lines = {
        "R": { id: "R", name: "淡水信義線 (紅線)", color: "#E3002C", stations: [] },
        "BL": { id: "BL", name: "板南線 (藍線)", color: "#005EB8", stations: [] },
        "G": { id: "G", name: "松山新店線 (綠線)", color: "#008659", stations: [] },
        "O": { id: "O", name: "中和新蘆線 (橘線)", color: "#F8B61C", stations: [] },
        "BR": { id: "BR", name: "文湖線 (棕線)", color: "#C48C31", stations: [] },
        "Y": { id: "Y", name: "環狀線 (黃線)", color: "#FFDB00", stations: [] }
    };

    rawStations.forEach(station => {
        // Extract line code (e.g., "R" from "R02")
        // Some codes might be "R22A", so take letters
        const match = station.StationCode.match(/^([A-Z]+)/);
        if (match) {
            const lineCode = match[1];
            if (lines[lineCode]) {
                lines[lineCode].stations.push({
                    id: station.StationCode,
                    name: station.StationName
                });
            }
        }
    });

    const uiStations = Object.values(lines).filter(line => line.stations.length > 0);

    console.log(`Generated UI data for ${uiStations.length} lines.`);
    fs.writeFileSync('src/data/stations.json', JSON.stringify(uiStations, null, 2));
};

main();
