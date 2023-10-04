
import { Button, Typography, Accordion, AccordionDetails, AccordionSummary, Box } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
export default function EditAccounts() {

  return (
    <Accordion  elevation={4} sx={{padding:5}}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5">Advanced Options</Typography>

        </AccordionSummary>
        <AccordionDetails>
            <Typography variant="h5">Backup & Restore</Typography>
            <Box sx={{width:"100%", p:3}}>
                <Typography>Back up all AET data to an external file</Typography>
                <Button variant="contained" >Backup</Button>
            </Box>
            <Box sx={{width:"100%", p:3}}>
                <Typography>Clear current data and restore from a backup file</Typography>
                <Button variant="contained" >Restore from Backup</Button>

            </Box>
            <Typography variant="h5">Clear Data</Typography>
            <Box sx={{width:"100%", p:3}}>
                <Typography>Reset AET back to default state, removing all data</Typography>
                <Button variant="contained" >Clear Data</Button>

            </Box>

        </AccordionDetails>
    </Accordion>
  );
}
  