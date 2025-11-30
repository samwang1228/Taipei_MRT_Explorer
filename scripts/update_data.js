import { execSync } from 'child_process';

console.log('🚀 Starting Data Update Process...');

try {
    console.log('\n1️⃣  Fetching latest data from OpenStreetMap...');
    // Run the fetch script
    execSync('node scripts/fetch_osm_data.js', { stdio: 'inherit' });

    console.log('\n2️⃣  Transforming data for application...');
    // Run the transform script
    execSync('node scripts/transform_data.js', { stdio: 'inherit' });

    console.log('\n✅ Data update complete! Please restart your dev server if needed.');
} catch (error) {
    console.error('\n❌ Error during update:', error.message);
    process.exit(1);
}
