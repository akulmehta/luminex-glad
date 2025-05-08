// Import the combinePatientSets function
import { combinePatientSets } from './src/combine_patient_sets.js';

// Import the checkForDuplicateTubeIDs function
import { checkForDuplicateTubeIDs } from './src/checkForDuplicateTubeIDs.js';

// Import the generateJsonFromCsv function
import { generateJsonFromCsv } from './src/generate_json_from_csv.js';
import path from 'path';
import { fileURLToPath } from 'url';

import {mapJson} from './src/mapJson.js'; // Import the mapJson function

import fs from 'fs';
import { map } from 'd3';

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    try {
        // Combine patient sets
        const combinedData = await combinePatientSets();

        // Check for duplicate Tube IDs
        checkForDuplicateTubeIDs(combinedData);

        // Generate JSON from CSV
        const filePath = path.join(__dirname, 'data_sets/1st cohort_First day_anti ABO Ab IgG_GLAD.csv');
        let outputJson = generateJsonFromCsv(filePath);
        outputJson = mapJson(outputJson, combinedData);
        const outputFilePath = path.join(__dirname, 'output/output.txt');
        fs.writeFileSync(outputFilePath, JSON.stringify(outputJson, null, 2));
        console.log(`Generated JSON saved to ${outputFilePath}`);
    } catch (error) {
        console.error('Error in processing:', error);
    }
}

main();