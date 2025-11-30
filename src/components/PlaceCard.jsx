import React from 'react';

const PlaceCard = ({ place }) => {
    return (
        <div className="place-card hover-card">
            <div className="card-image-container">
                <img src={place.image} alt={place.name} className="card-image" loading="lazy" />
                <div className="card-rating">
                    ⭐ {place.rating}
                </div>
            </div>
            <div className="card-content">
                <div className="card-header">
                    <h3 className="card-title">{place.name}</h3>
                    {place.accessibility && <span className="icon-access" title="Wheelchair Accessible">♿</span>}
                </div>

                <div className="card-meta">
                    <span className="meta-item">📍 {place.distance}</span>
                    <span className="meta-item">🏷️ {place.sub_category || place.main_category}</span>
                </div>

                <div className="card-tags">
                    {place.tags.map(tag => (
                        <span key={tag} className="tag">#{tag}</span>
                    ))}
                </div>

                <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-action"
                >
                    查看地圖
                </a>
            </div>
        </div>
    );
};

export default PlaceCard;
