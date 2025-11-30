import React from 'react';
import PlaceCard from './PlaceCard';

const PlaceList = ({ places }) => {
    if (places.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">🏙️</div>
                <h3>找不到相關地點</h3>
                <p>請嘗試更改篩選條件或選擇其他捷運站。</p>
            </div>
        );
    }

    return (
        <div className="place-grid">
            {places.map((place) => (
                <PlaceCard key={place.id} place={place} />
            ))}
        </div>
    );
};

export default PlaceList;
