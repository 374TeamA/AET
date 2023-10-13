import { Button } from '@mui/material';
import { exportToJson } from '../../database/backup_restore';
import { connectToDatabase } from '../../database/initialisation';

const downloadJSON = async () => {
    // Get JSON
    const jsonObject = await exportToJson(await connectToDatabase())

    // Convert the JSON object to a string
    const jsonString = JSON.stringify(jsonObject, null, 2); // The second argument is for pretty formatting

    // Create a Blob containing the JSON string
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Create a download link for the Blob
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';

    // Trigger a click event on the download link
    a.click();

    // Clean up by revoking the Object URL
    URL.revokeObjectURL(url);
}

export const BackupButton = ()=>{


    return (
        <>
            <Button variant="contained" onClick={downloadJSON}>Backup</Button>
        </>
    );
}

