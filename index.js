// Import the combinePatientSets function
import { combinePatientSets } from './src/combine_patient_sets.js';

// Import the checkForDuplicateTubeIDs function
import { checkForDuplicateTubeIDs } from './src/checkForDuplicateTubeIDs.js';

// Import the generateJsonFromCsv function
import { generateJsonFromCsv } from './src/generate_json_from_csv.js';
import path from 'path';
import { fileURLToPath } from 'url';

import {mapJson} from './src/mapJson.js'; // Import the mapJson function

import readlineSync from 'readline-sync'; // Import readline-sync

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

        // Generate JSON for each file in the data_sets directory
        const dataSetsDir = path.join(__dirname, 'data_sets');
        const outputDir = path.join(__dirname, 'output');

        fs.readdirSync(dataSetsDir).forEach(file => {
            const filePath = path.join(dataSetsDir, file);
            if (fs.statSync(filePath).isFile()) {
                let analysisType = ['IgG', 'IgA', 'IgM'].find(type => file.includes(type));
                if (!analysisType) {
                    analysisType = readlineSync.question(`Analysis type not found in file name: ${file}. Please enter the analysis type (e.g., IgG, IgA, IgM): `);
                }

                let outputJson = generateJsonFromCsv(filePath);
                outputJson = mapJson(outputJson, combinedData, analysisType);

                const outputFileName = `${path.parse(file).name}_GLAD_selection.txt`;
                const outputFilePath = path.join(outputDir, outputFileName);

                fs.writeFileSync(outputFilePath, JSON.stringify(outputJson, null, 2));
                console.log(`Generated JSON saved to ${outputFilePath}`);
            }
        });
    } catch (error) {
        console.error('Error in processing:', error);
    }
}

main();