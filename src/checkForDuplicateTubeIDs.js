// Function to check for duplicate Tube IDs in the combined data
export function checkForDuplicateTubeIDs(data) {
    const tubeIDCounts = data.reduce((acc, item) => {
        acc[item['Tube ID']] = (acc[item['Tube ID']] || 0) + 1;
        return acc;
    }, {});

    const duplicates = Object.entries(tubeIDCounts).filter(([id, count]) => count > 1);

    if (duplicates.length > 0) {
        console.warn('Warning: Duplicate Tube IDs found:', duplicates.map(([id]) => id));
    } else {
        console.log('All Tube IDs are unique.');
    }
}