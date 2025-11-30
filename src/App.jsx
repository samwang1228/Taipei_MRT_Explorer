import React, { useState, useMemo } from 'react';
import StationSelector from './components/StationSelector';
import CategoryFilter from './components/CategoryFilter';
import PlaceList from './components/PlaceList';
import stationsData from './data/stations.json';
import placesData from './data/places.json';
import './styles/index.css';

function App() {
  const [currentStationId, setCurrentStationId] = useState(''); // Renamed for clarity
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [accessibility, setAccessibility] = useState(false);

  // Mapping for transfer stations (Same location, different codes)
  const transferStations = {
    // Taipei Main Station
    "R10": ["R10", "BL22"], "BL22": ["R10", "BL22"],
    // Zhongshan
    "R11": ["R11", "G14"], "G14": ["R11", "G14"],
    // Chiang Kai-shek Memorial Hall
    "R08": ["R08", "G10"], "G10": ["R08", "G10"],
    // Minquan W. Rd.
    "R13": ["R13", "O11"], "O11": ["R13", "O11"],
    // Songjiang Nanjing
    "G15": ["G15", "O08"], "O08": ["G15", "O08"],
    // Nanjing Fuxing
    "G16": ["G16", "BR11"], "BR11": ["G16", "BR11"],
    // Zhongshan Elementary School (No transfer, but check)
    // Zhongxiao Xinsheng
    "BL20": ["BL20", "O07"], "O07": ["BL20", "O07"],
    // Zhongxiao Fuxing
    "BL19": ["BL19", "BR10"], "BR10": ["BL19", "BR10"],
    // Taipei Nangang Exhibition Center
    "BL11": ["BL11", "BR24"], "BR24": ["BL11", "BR24"],
    // Daan
    "R05": ["R05", "BR09"], "BR09": ["R05", "BR09"],
    // Ximen
    "BL23": ["BL23", "G12"], "G12": ["BL23", "G12"],
    // Dongmen
    "R07": ["R07", "O06"], "O06": ["R07", "O06"],
    // Guting
    "G09": ["G09", "O05"], "O05": ["G09", "O05"],
    // Jingan
    "O02": ["O02", "Y11"], // Y line not fully implemented but good to have
    // Touqianzhuang
    "O17": ["O17", "Y18"],
    // Banqiao
    "BL27": ["BL27", "Y16"],
    // New Taipei Industrial Park
    // ... add others as needed
  };

  // Filter Logic
  const filteredPlaces = useMemo(() => {
    if (!currentStationId) return []; // Use currentStationId

    // Get all valid codes for the selected station (e.g., R11 -> [R11, G14])
    // If currentStationId is 'R10', validCodes will be ["R10", "BL22"]
    const validCodes = transferStations[currentStationId] || [currentStationId];

    return placesData.filter(place => { // Use placesData
      // 1. Station Filter (Check against all valid codes)
      if (!validCodes.includes(place.mrt_station)) return false;

      // 2. Category Filter
      if (selectedCategory !== 'All' && place.main_category !== selectedCategory) return false;

      // 3. Sub-category Filter (only if Food is selected and sub-cat is chosen)
      if (selectedCategory === 'Food' && selectedSubCategory && place.sub_category !== selectedSubCategory) return false;

      // 4. Accessibility Filter
      if (accessibility && !place.accessibility) return false; // Use accessibility

      return true;
    }).sort((a, b) => b.rating - a.rating); // Sort by rating desc
  }, [currentStationId, selectedCategory, selectedSubCategory, accessibility]); // Use currentStationId and accessibility

  const currentStationName = useMemo(() => {
    if (!currentStationId) return ''; // Use currentStationId
    for (const line of stationsData) {
      const station = line.stations.find(s => s.id === currentStationId); // Use currentStationId
      if (station) return station.name;
    }
    return '';
  }, [currentStationId]);

  return (
    <div className="app">
      <header className="hero-section">
        <div className="container">
          <h1 className="app-title">北捷探索指南</h1>
          <p className="app-subtitle">探索捷運站周邊的隱藏景點</p>

          <StationSelector
            stations={stationsData}
            currentStation={currentStationId}
            onSelect={setCurrentStationId}
          />
        </div>
      </header>

      <main className="main-content container">
        {currentStationId ? (
          <>
            <div className="station-header">
              <h2>探索 <span className="highlight">{currentStationName}</span> 周邊</h2>
            </div>

            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedSubCategory={selectedSubCategory}
              onSelectSubCategory={setSelectedSubCategory}
              accessibility={accessibility}
              onToggleAccessibility={setAccessibility}
            />

            <PlaceList places={filteredPlaces} />
          </>
        ) : (
          <div className="welcome-state">
            <div className="welcome-icon">🚇</div>
            <h2>請選擇一個捷運站開始探索</h2>
          </div>
        )}
      </main>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 北捷探索指南. 為旅人打造.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
