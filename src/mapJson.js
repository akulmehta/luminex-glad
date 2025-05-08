// Function to map outputJson with combinedData
export function mapJson(outputJson, combinedData, analysisType) {
    return outputJson.map(item => {
        const match = combinedData.find(data => data['Tube ID'] === item.Title);
        if (match) {
            item.Title = `patientID-${match['Patient ID']}_bloodType-${match['Blood type']}_timePoint-${match['Time point']}_tubeID-${match['Tube ID']}`;
            if (analysisType) {
                item.Title += `_analysisType-${analysisType}`;
                item.AnalysisType = analysisType;
            }

            // Set barcolor based on Blood type (loose match for rhesus factor)
            const bloodTypeColors = {
                'A': '#800000', // Maroon
                'B': '#000080', // Navy
                'AB': '#004d00', // Dark Green
                'O': '#5a3d1a'  // Dark Brown
            };
            const bloodTypeKey = match['Blood type'].replace(/[+-]/g, ''); // Remove rhesus factor
            item.barcolor = bloodTypeColors[bloodTypeKey] || '#333'; // Default color if Blood type is not found

            // Add other metadata from combinedData to the item
            item.PatientID = match['Patient ID'];
            item.BloodType = match['Blood type'];
            item.TimePoint = match['Time point'];
            item.TubeID = match['Tube ID'];
        }
        return item;
    });
}