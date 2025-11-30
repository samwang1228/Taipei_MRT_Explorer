import fs from 'fs';
import https from 'https';
import http from 'http';

const fetchUrl = (url) => {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        client.get(url, { headers: { 'Accept': 'application/json' } }, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    console.error(`Error parsing JSON from ${url}:`, e.message);
                    // console.log('Raw data preview:', data.substring(0, 200));
                    resolve(null);
                }
            });
        }).on('error', reject);
    });
};

const main = async () => {
    console.log('Fetching Attractions from Open Data Source...');

    // Simulated response from Taipei Travel Net Open API (https://www.travel.taipei/open-api)
    // Structure mimics the official API: { data: [ { id, name, address, dist, lat, long, ... } ] }
    const rawAttractions = [
        { id: 1, name: "台北101觀景台", address: "台北市信義區信義路五段7號89樓", dist: "信義區", lat: 25.0339, long: 121.5644, category: "景點" },
        { id: 2, name: "國立故宮博物院", address: "台北市士林區至善路二段221號", dist: "士林區", lat: 25.1020, long: 121.5486, category: "文化" },
        { id: 3, name: "士林夜市", address: "台北市士林區基河路101號", dist: "士林區", lat: 25.0889, long: 121.5245, category: "夜市" },
        { id: 4, name: "中正紀念堂", address: "台北市中正區中山南路21號", dist: "中正區", lat: 25.0346, long: 121.5216, category: "文化" },
        { id: 5, name: "龍山寺", address: "台北市萬華區廣州街211號", dist: "萬華區", lat: 25.0368, long: 121.4999, category: "廟宇" },
        { id: 6, name: "松山文創園區", address: "台北市信義區光復南路133號", dist: "信義區", lat: 25.0436, long: 121.5606, category: "文創" },
        { id: 7, name: "西門紅樓", address: "台北市萬華區成都路10號", dist: "萬華區", lat: 25.0421, long: 121.5056, category: "古蹟" },
        { id: 8, name: "大安森林公園", address: "台北市大安區新生南路二段1號", dist: "大安區", lat: 25.0296, long: 121.5362, category: "公園" },
        { id: 9, name: "華山1914文化創意產業園區", address: "台北市中正區八德路一段1號", dist: "中正區", lat: 25.0441, long: 121.5293, category: "文創" },
        { id: 10, name: "饒河街觀光夜市", address: "台北市松山區饒河街", dist: "松山區", lat: 25.0509, long: 121.5775, category: "夜市" },
        { id: 11, name: "寧夏夜市", address: "台北市大同區寧夏路", dist: "大同區", lat: 25.0568, long: 121.5155, category: "夜市" },
        { id: 12, name: "台北市立動物園", address: "台北市文山區新光路二段30號", dist: "文山區", lat: 24.9983, long: 121.5810, category: "景點" },
        { id: 13, name: "貓空纜車", address: "台北市文山區新光路二段8號", dist: "文山區", lat: 24.9961, long: 121.5763, category: "景點" },
        { id: 14, name: "北投溫泉博物館", address: "台北市北投區中山路2號", dist: "北投區", lat: 25.1366, long: 121.5073, category: "文化" },
        { id: 15, name: "陽明山國家公園", address: "台北市北投區竹子湖路1-20號", dist: "北投區", lat: 25.1558, long: 121.5469, category: "景點" },
        { id: 16, name: "行天宮", address: "台北市中山區民權東路二段109號", dist: "中山區", lat: 25.0630, long: 121.5338, category: "廟宇" },
        { id: 17, name: "迪化街", address: "台北市大同區迪化街一段", dist: "大同區", lat: 25.0558, long: 121.5103, category: "老街" },
        { id: 18, name: "公館商圈", address: "台北市中正區羅斯福路四段", dist: "中正區", lat: 25.0158, long: 121.5342, category: "商圈" },
        { id: 19, name: "師大夜市", address: "台北市大安區師大路", dist: "大安區", lat: 25.0245, long: 121.5294, category: "夜市" },
        { id: 20, name: "美麗華百樂園", address: "台北市中山區敬業三路20號", dist: "中山區", lat: 25.0836, long: 121.5574, category: "購物" }
    ];

    console.log(`Fetched ${rawAttractions.length} attractions from simulated Open Data.`);
    fs.writeFileSync('src/data/raw_attractions.json', JSON.stringify(rawAttractions, null, 2));

    console.log('Fetching MRT Stations from Open Data Source...');
    // Simulated response from Taipei MRT Open Data (Expanded to ALL Lines)
    const rawStations = [
        // Red Line (Tamsui-Xinyi)
        { StationCode: "R02", StationName: "象山", Lat: 25.0328, Lon: 121.5707 },
        { StationCode: "R03", StationName: "台北101/世貿", Lat: 25.0332, Lon: 121.5637 },
        { StationCode: "R04", StationName: "信義安和", Lat: 25.0333, Lon: 121.5529 },
        { StationCode: "R05", StationName: "大安", Lat: 25.0329, Lon: 121.5435 },
        { StationCode: "R06", StationName: "大安森林公園", Lat: 25.0333, Lon: 121.5348 },
        { StationCode: "R07", StationName: "東門", Lat: 25.0338, Lon: 121.5287 },
        { StationCode: "R08", StationName: "中正紀念堂", Lat: 25.0352, Lon: 121.5183 },
        { StationCode: "R09", StationName: "台大醫院", Lat: 25.0413, Lon: 121.5160 },
        { StationCode: "R10", StationName: "台北車站", Lat: 25.0461, Lon: 121.5174 },
        { StationCode: "R11", StationName: "中山", Lat: 25.0527, Lon: 121.5204 },
        { StationCode: "R12", StationName: "雙連", Lat: 25.0578, Lon: 121.5205 },
        { StationCode: "R13", StationName: "民權西路", Lat: 25.0620, Lon: 121.5193 },
        { StationCode: "R14", StationName: "圓山", Lat: 25.0713, Lon: 121.5201 },
        { StationCode: "R15", StationName: "劍潭", Lat: 25.0848, Lon: 121.5249 },
        { StationCode: "R16", StationName: "士林", Lat: 25.0934, Lon: 121.5262 },
        { StationCode: "R17", StationName: "芝山", Lat: 25.1057, Lon: 121.5226 },
        { StationCode: "R18", StationName: "明德", Lat: 25.1099, Lon: 121.5194 },
        { StationCode: "R19", StationName: "石牌", Lat: 25.1151, Lon: 121.5156 },
        { StationCode: "R20", StationName: "唭哩岸", Lat: 25.1207, Lon: 121.5063 },
        { StationCode: "R21", StationName: "奇岩", Lat: 25.1254, Lon: 121.5009 },
        { StationCode: "R22", StationName: "北投", Lat: 25.1318, Lon: 121.4986 },
        { StationCode: "R22A", StationName: "新北投", Lat: 25.1369, Lon: 121.5026 },
        { StationCode: "R23", StationName: "復興崗", Lat: 25.1375, Lon: 121.4855 },
        { StationCode: "R24", StationName: "忠義", Lat: 25.1309, Lon: 121.4732 },
        { StationCode: "R25", StationName: "關渡", Lat: 25.1256, Lon: 121.4671 },
        { StationCode: "R26", StationName: "竹圍", Lat: 25.1369, Lon: 121.4595 },
        { StationCode: "R27", StationName: "紅樹林", Lat: 25.1540, Lon: 121.4589 },
        { StationCode: "R28", StationName: "淡水", Lat: 25.1678, Lon: 121.4456 },

        // Blue Line (Bannan)
        { StationCode: "BL11", StationName: "南港展覽館", Lat: 25.0553, Lon: 121.6171 },
        { StationCode: "BL12", StationName: "南港", Lat: 25.0521, Lon: 121.6067 },
        { StationCode: "BL13", StationName: "昆陽", Lat: 25.0504, Lon: 121.5933 },
        { StationCode: "BL14", StationName: "後山埤", Lat: 25.0445, Lon: 121.5828 },
        { StationCode: "BL15", StationName: "永春", Lat: 25.0409, Lon: 121.5763 },
        { StationCode: "BL16", StationName: "市政府", Lat: 25.0411, Lon: 121.5652 },
        { StationCode: "BL17", StationName: "國父紀念館", Lat: 25.0413, Lon: 121.5578 },
        { StationCode: "BL18", StationName: "忠孝敦化", Lat: 25.0415, Lon: 121.5504 },
        { StationCode: "BL19", StationName: "忠孝復興", Lat: 25.0416, Lon: 121.5438 },
        { StationCode: "BL20", StationName: "忠孝新生", Lat: 25.0423, Lon: 121.5329 },
        { StationCode: "BL21", StationName: "善導寺", Lat: 25.0447, Lon: 121.5228 },
        { StationCode: "BL22", StationName: "台北車站", Lat: 25.0461, Lon: 121.5174 },
        { StationCode: "BL23", StationName: "西門", Lat: 25.0422, Lon: 121.5082 },
        { StationCode: "BL24", StationName: "龍山寺", Lat: 25.0368, Lon: 121.4999 },
        { StationCode: "BL25", StationName: "江子翠", Lat: 25.0300, Lon: 121.4724 },
        { StationCode: "BL26", StationName: "新埔", Lat: 25.0237, Lon: 121.4676 },
        { StationCode: "BL27", StationName: "板橋", Lat: 25.0139, Lon: 121.4623 },
        { StationCode: "BL28", StationName: "府中", Lat: 25.0086, Lon: 121.4594 },
        { StationCode: "BL29", StationName: "亞東醫院", Lat: 24.9984, Lon: 121.4523 },
        { StationCode: "BL30", StationName: "海山", Lat: 24.9853, Lon: 121.4488 },
        { StationCode: "BL31", StationName: "土城", Lat: 24.9731, Lon: 121.4444 },
        { StationCode: "BL32", StationName: "永寧", Lat: 24.9667, Lon: 121.4361 },
        { StationCode: "BL33", StationName: "頂埔", Lat: 24.9593, Lon: 121.4190 },

        // Green Line (Songshan-Xindian)
        { StationCode: "G01", StationName: "新店", Lat: 24.9549, Lon: 121.5378 },
        { StationCode: "G02", StationName: "新店區公所", Lat: 24.9673, Lon: 121.5415 },
        { StationCode: "G03", StationName: "七張", Lat: 24.9752, Lon: 121.5432 },
        { StationCode: "G04", StationName: "大坪林", Lat: 24.9830, Lon: 121.5416 },
        { StationCode: "G05", StationName: "景美", Lat: 24.9932, Lon: 121.5407 },
        { StationCode: "G06", StationName: "萬隆", Lat: 25.0019, Lon: 121.5395 },
        { StationCode: "G07", StationName: "公館", Lat: 25.0135, Lon: 121.5342 },
        { StationCode: "G08", StationName: "台電大樓", Lat: 25.0207, Lon: 121.5283 },
        { StationCode: "G09", StationName: "古亭", Lat: 25.0264, Lon: 121.5229 },
        { StationCode: "G10", StationName: "中正紀念堂", Lat: 25.0352, Lon: 121.5183 },
        { StationCode: "G11", StationName: "小南門", Lat: 25.0354, Lon: 121.5106 },
        { StationCode: "G12", StationName: "西門", Lat: 25.0422, Lon: 121.5082 },
        { StationCode: "G13", StationName: "北門", Lat: 25.0494, Lon: 121.5113 },
        { StationCode: "G14", StationName: "中山", Lat: 25.0527, Lon: 121.5204 },
        { StationCode: "G15", StationName: "松江南京", Lat: 25.0518, Lon: 121.5333 },
        { StationCode: "G16", StationName: "南京復興", Lat: 25.0524, Lon: 121.5440 },
        { StationCode: "G17", StationName: "台北小巨蛋", Lat: 25.0519, Lon: 121.5526 },
        { StationCode: "G18", StationName: "南京三民", Lat: 25.0514, Lon: 121.5634 },
        { StationCode: "G19", StationName: "松山", Lat: 25.0501, Lon: 121.5777 },

        // Orange Line (Zhonghe-Xinlu)
        { StationCode: "O01", StationName: "南勢角", Lat: 24.9901, Lon: 121.5090 },
        { StationCode: "O02", StationName: "景安", Lat: 24.9945, Lon: 121.5053 },
        { StationCode: "O03", StationName: "永安市場", Lat: 25.0028, Lon: 121.5114 },
        { StationCode: "O04", StationName: "頂溪", Lat: 25.0138, Lon: 121.5154 },
        { StationCode: "O05", StationName: "古亭", Lat: 25.0264, Lon: 121.5229 },
        { StationCode: "O06", StationName: "東門", Lat: 25.0338, Lon: 121.5287 },
        { StationCode: "O07", StationName: "忠孝新生", Lat: 25.0423, Lon: 121.5329 },
        { StationCode: "O08", StationName: "松江南京", Lat: 25.0518, Lon: 121.5333 },
        { StationCode: "O09", StationName: "行天宮", Lat: 25.0599, Lon: 121.5334 },
        { StationCode: "O10", StationName: "中山國小", Lat: 25.0632, Lon: 121.5266 },
        { StationCode: "O11", StationName: "民權西路", Lat: 25.0620, Lon: 121.5193 },
        { StationCode: "O12", StationName: "大橋頭", Lat: 25.0635, Lon: 121.5122 },
        { StationCode: "O13", StationName: "台北橋", Lat: 25.0633, Lon: 121.4998 },
        { StationCode: "O14", StationName: "菜寮", Lat: 25.0607, Lon: 121.4925 },
        { StationCode: "O15", StationName: "三重", Lat: 25.0556, Lon: 121.4846 },
        { StationCode: "O16", StationName: "先嗇宮", Lat: 25.0465, Lon: 121.4715 },
        { StationCode: "O17", StationName: "頭前庄", Lat: 25.0399, Lon: 121.4613 },
        { StationCode: "O18", StationName: "新莊", Lat: 25.0361, Lon: 121.4522 },
        { StationCode: "O19", StationName: "輔大", Lat: 25.0328, Lon: 121.4357 },
        { StationCode: "O20", StationName: "丹鳳", Lat: 25.0287, Lon: 121.4225 },
        { StationCode: "O21", StationName: "迴龍", Lat: 25.0216, Lon: 121.4114 },
        { StationCode: "O50", StationName: "三重國小", Lat: 25.0705, Lon: 121.4967 },
        { StationCode: "O51", StationName: "三和國中", Lat: 25.0768, Lon: 121.4864 },
        { StationCode: "O52", StationName: "徐匯中學", Lat: 25.0809, Lon: 121.4795 },
        { StationCode: "O53", StationName: "三民高中", Lat: 25.0854, Lon: 121.4725 },
        { StationCode: "O54", StationName: "蘆洲", Lat: 25.0915, Lon: 121.4645 },

        // Brown Line (Wenhu)
        { StationCode: "BR01", StationName: "動物園", Lat: 24.9982, Lon: 121.5793 },
        { StationCode: "BR02", StationName: "木柵", Lat: 24.9982, Lon: 121.5731 },
        { StationCode: "BR03", StationName: "萬芳社區", Lat: 24.9985, Lon: 121.5681 },
        { StationCode: "BR04", StationName: "萬芳醫院", Lat: 24.9994, Lon: 121.5581 },
        { StationCode: "BR05", StationName: "辛亥", Lat: 25.0055, Lon: 121.5571 },
        { StationCode: "BR06", StationName: "麟光", Lat: 25.0185, Lon: 121.5587 },
        { StationCode: "BR07", StationName: "六張犁", Lat: 25.0238, Lon: 121.5531 },
        { StationCode: "BR08", StationName: "科技大樓", Lat: 25.0261, Lon: 121.5436 },
        { StationCode: "BR09", StationName: "大安", Lat: 25.0329, Lon: 121.5435 },
        { StationCode: "BR10", StationName: "忠孝復興", Lat: 25.0416, Lon: 121.5438 },
        { StationCode: "BR11", StationName: "南京復興", Lat: 25.0524, Lon: 121.5440 },
        { StationCode: "BR12", StationName: "中山國中", Lat: 25.0608, Lon: 121.5442 },
        { StationCode: "BR13", StationName: "松山機場", Lat: 25.0628, Lon: 121.5515 },
        { StationCode: "BR14", StationName: "大直", Lat: 25.0795, Lon: 121.5469 },
        { StationCode: "BR15", StationName: "劍南路", Lat: 25.0848, Lon: 121.5556 },
        { StationCode: "BR16", StationName: "西湖", Lat: 25.0821, Lon: 121.5673 },
        { StationCode: "BR17", StationName: "港墘", Lat: 25.0800, Lon: 121.5750 },
        { StationCode: "BR18", StationName: "文德", Lat: 25.0785, Lon: 121.5848 },
        { StationCode: "BR19", StationName: "內湖", Lat: 25.0836, Lon: 121.5944 },
        { StationCode: "BR20", StationName: "大湖公園", Lat: 25.0838, Lon: 121.6022 },
        { StationCode: "BR21", StationName: "葫洲", Lat: 25.0728, Lon: 121.6071 },
        { StationCode: "BR22", StationName: "東湖", Lat: 25.0673, Lon: 121.6115 },
        { StationCode: "BR23", StationName: "南港軟體園區", Lat: 25.0599, Lon: 121.6160 },
        { StationCode: "BR24", StationName: "南港展覽館", Lat: 25.0553, Lon: 121.6171 }
    ];

    console.log(`Fetched ${rawStations.length} MRT stations from simulated Open Data.`);
    fs.writeFileSync('src/data/raw_stations.json', JSON.stringify(rawStations, null, 2));
};

main();
