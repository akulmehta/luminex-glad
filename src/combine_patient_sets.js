// Import the required library
import * as d3 from 'd3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to combine patient sets into a single JSON file
export async function combinePatientSets() {
    const patientSetsFolder = path.join(__dirname, '../patient_sets');
    const outputFilePath = path.join(__dirname, '../output/combined_patient_sets.json');

    try {
        // Read all CSV files in the patient_sets folder
        const files = fs.readdirSync(patientSetsFolder).filter(file => file.endsWith('.csv'));

        const combinedData = [];

        for (const file of files) {
            const filePath = path.join(patientSetsFolder, file);
            const fileContent = fs.readFileSync(filePath, 'utf-8');

            // Remove the first line (date) before parsing the CSV
            const fileContentWithoutDate = fileContent.split('\n').slice(1).join('\n');

            // Parse the CSV content
            const rows = d3.csvParse(fileContentWithoutDate);

            // Add the rows to the combined data
            combinedData.push(...rows);
        }

        // Write the combined data to a JSON file
        fs.writeFileSync(outputFilePath, JSON.stringify(combinedData, null, 2));

        console.log(`Combined patient sets saved to ${outputFilePath}`);

        return combinedData;
    } catch (error) {
        console.error('Error combining patient sets:', error);
    }
}