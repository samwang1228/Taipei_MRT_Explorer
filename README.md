# Taipei MRT Explorer (台北捷運探索者)

A modern, interactive travel guide for exploring attractions, food, and shops around Taipei MRT stations.

![Project Preview](image.png)

## 🌟 Features

*   **Comprehensive Coverage**: Supports all major Taipei MRT lines (Red, Blue, Green, Orange, Brown, Yellow).
*   **Real-World Data**: Powered by **OpenStreetMap (OSM)**, providing access to over 10,000 real locations.
*   **Smart Filtering**: Filter by category (Food, Culture, Shopping, Leisure) and specific cuisines (Japanese, Korean, etc.).
*   **Accessibility First**: Dedicated filter for wheelchair-accessible locations.
*   **Premium Design**: Responsive, modern UI with a polished user experience.
*   **Localization**: Fully localized in Traditional Chinese (繁體中文).

## 🚀 Getting Started

### Prerequisites

*   Node.js (v16 or higher)
*   npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/taipei-mrt-explorer.git
    cd taipei-mrt-explorer
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```

## 🔄 Updating Data

This project uses a custom script to fetch fresh data from OpenStreetMap. To update the database:

```bash
npm run update-data
```

This command will:
1.  Fetch the latest data for all 120+ MRT stations from the Overpass API.
2.  Transform and map the data to the application's format.
3.  Update `src/data/places.json`.

*Note: The update process may take a few minutes due to API rate limiting.*

## ️ Technologies

*   **Frontend**: React, Vite
*   **Styling**: CSS Variables, Modern CSS
*   **Data**: OpenStreetMap (Overpass API)
*   **Scripts**: Node.js

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔮 Future Roadmap (未來展望)

We are constantly working to improve Taipei MRT Explorer. Here are some features planned for future updates:

1.  **Real Images (圖片功能)**:
    *   Integrate with Google Places API or similar services to provide high-quality, real-world photos for every location.
2.  **Reviews & Ratings (評論與評分)**:
    *   Implement a system to fetch real Google Maps ratings and reviews, replacing the current simulated rating system.
3.  **User Accounts (登入系統)**:
    *   Allow users to sign in, save their favorite places, and create custom itineraries.

