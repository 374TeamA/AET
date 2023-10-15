import { useState } from 'react';
import { clearDatabase, importFromJson } from '../../database/backup_restore';
import { connectToDatabase } from '../../database/initialisation';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

// Credit: https://chat.openai.com/share/981949f1-bb2a-4eec-bc21-e1445e543e39

export function RestoreButton() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFileChange:React.ChangeEventHandler<HTMLInputElement> = (event) => {
    if(event.target.files == null) return;
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = () => {
    // You can process the uploaded JSON file here.
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        if(e.target == null) return;
        if(e.target.result == null) return;
        if(typeof(e.target.result) != "string") {
            console.log("error, invalid format")
            // TODO make some dialog for this
            return;
        }
        const jsonData = JSON.parse(e.target.result);
        // Import the JSON Data
        console.log("Importing")
        console.log(jsonData);
        const db = await connectToDatabase();
        await clearDatabase(db);
        await importFromJson(db,jsonData);
        // Do a full page reload
        window.location.reload();
      };
      reader.readAsText(file);
    }

    // Close the dialog
    handleClose();
  };
  // TODO: add a confirmation dialog, as this will delete everything currently in AET.

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Upload JSON
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Upload JSON File</DialogTitle>
        <DialogContent>
          <input
            type="file"
            accept=".json"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="json-upload-input"
          />
          <label htmlFor="json-upload-input">
            <Button
              variant="outlined"
              color="primary"
              component="span"
            >
              Choose File
            </Button>
          </label>
          {file && <div>Selected file: {file.name}</div>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpload} color="primary" disabled={!file}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
