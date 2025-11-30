import React from 'react';

const CATEGORIES = [
    { id: 'All', label: '全部', icon: '🔍' },
    { id: 'Food', label: '美食', icon: '🍽️' },
    { id: 'Culture', label: '文化', icon: '🏛️' },
    { id: 'Shopping', label: '購物', icon: '🛍️' },
    { id: 'Leisure', label: '休閒', icon: '☕' },
];

const FOOD_SUB_CATEGORIES = [
    { id: 'Japanese', label: '日式' },
    { id: 'Korean', label: '韓式' },
    { id: 'Chinese', label: '中式' },
    { id: 'HotPot', label: '火鍋' },
    { id: 'NightMarket', label: '夜市' },
    { id: 'Cafe', label: '咖啡/甜點' },
];

const CategoryFilter = ({
    selectedCategory,
    onSelectCategory,
    selectedSubCategory,
    onSelectSubCategory,
    accessibility,
    onToggleAccessibility
}) => {
    return (
        <div className="filter-container">
            {/* Main Categories */}
            <div className="category-scroll">
                <div className="category-list">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            className={`category-chip ${selectedCategory === cat.id ? 'active' : ''}`}
                            onClick={() => {
                                onSelectCategory(cat.id);
                                onSelectSubCategory(null); // Reset sub-category
                            }}
                        >
                            <span className="category-icon">{cat.icon}</span>
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Sub Categories (Only for Food) */}
            {selectedCategory === 'Food' && (
                <div className="sub-category-list">
                    <button
                        className={`sub-category-chip ${!selectedSubCategory ? 'active' : ''}`}
                        onClick={() => onSelectSubCategory(null)}
                    >
                        全部美食
                    </button>
                    {FOOD_SUB_CATEGORIES.map((sub) => (
                        <button
                            key={sub.id}
                            className={`sub-category-chip ${selectedSubCategory === sub.id ? 'active' : ''}`}
                            onClick={() => onSelectSubCategory(sub.id)}
                        >
                            {sub.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Accessibility Toggle */}
            <div className="accessibility-toggle">
                <label className="toggle-label">
                    <input
                        type="checkbox"
                        checked={accessibility}
                        onChange={(e) => onToggleAccessibility(e.target.checked)}
                        className="toggle-input"
                    />
                    <span className="toggle-slider"></span>
                    <span className="toggle-text">♿ 無障礙友善</span>
                </label>
            </div>
        </div>
    );
};

export default CategoryFilter;
