import {
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { BackupButton } from "./BackupButton";
import { ClearButton } from "./ClearButton";
import { RestoreButton } from "./RestoreButton";
export default function EditAccounts() {
  return (
    <Accordion elevation={1} sx={{ padding: 2 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h5">Advanced Options</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box
          sx={{
            width: "100%",
            p: 1,
            border: "1px solid lightgrey",
            marginBottom: "1rem"
          }}
        >
          <Typography variant="h5">Backup & Restore</Typography>
          <Box>
            <Typography>Back up all AET data to an external file</Typography>
            <BackupButton></BackupButton>
          </Box>
          <Box sx={{ marginTop: "1rem" }}>
            <Typography>
              Clear current data and restore from a backup file
            </Typography>
            <RestoreButton></RestoreButton>
          </Box>
        </Box>
        <Box sx={{ width: "100%", p: 1, border: "1px solid lightgrey" }}>
          <Typography variant="h5">Clear Data</Typography>
          <Box>
            <Typography>
              Reset AET back to default state, removing all data
            </Typography>
            <ClearButton></ClearButton>
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
