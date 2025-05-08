import fs from 'fs';
import path from 'path';

export function calculateStats(values) {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    const cv = (stdDev / mean) * 100;
    return { mean, stdDev, cv };
}

export function generateJsonFromCsv(filePath) {
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.split('\n');
    const headers = lines[0].split(',');

    const jsonData = [];
    const tubeData = {};

    for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',');
        if (row.length < 2) continue;

        const name = row[0];
        const glycan = row[1];

        const tubeRepeats = {};

        for (let j = 2; j < headers.length; j++) {
            const tubeName = headers[j].split('-')[0];
            const value = parseFloat(row[j]);

            if (!tubeRepeats[tubeName]) {
                tubeRepeats[tubeName] = [];
            }

            tubeRepeats[tubeName].push(value);
        }

        for (const tubeName in tubeRepeats) {
            const values = tubeRepeats[tubeName];
            const { mean, stdDev, cv } = calculateStats(values);

            if (!tubeData[tubeName]) {
                tubeData[tubeName] = [];
            }

            tubeData[tubeName].push({
                ID: i, // Use the line number as the ID
                Name: name,
                Name2: glycan,
                Title: tubeName,
                RFU: mean,
                SD: stdDev,
                CV: cv,
                barcolor: '#333',
            });
        }
    }

    for (const tubeName in tubeData) {
        const rankedData = tubeData[tubeName].sort((a, b) => b.RFU - a.RFU);
        rankedData.forEach((item, index) => {
            item.Rank = index + 1;
            jsonData.push(item);
        });
    }

    // Sort jsonData by Title and then by ID
    jsonData.sort((a, b) => {
        if (a.Title === b.Title) {
            return a.ID - b.ID;
        }
        return a.Title.localeCompare(b.Title);
    });

    return jsonData;
}