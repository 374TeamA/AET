import {
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Stack
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { BackupButton } from "./BackupButton";
import { ClearButton } from "./ClearButton";
import { RestoreButton } from "./RestoreButton";
import HelpDialog from "../../components/HelpDialog";
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
            <Typography>Back up all AET data to an external file.</Typography>
            <Stack justifyContent="space-between" alignItems="flex-start" direction="row">
              <BackupButton />
              <HelpDialog title="Backing up data">
                All AET data is stored in your browser - never in our servers. However, this means
                you need to back up your data regularly, in case something goes wrong. For example,
                if you reset your browser, you will lose all your data.
                <br/><br/>
                To do so, press the "Backup" button. A .json file will be downloaded to your computer,
                containing all your expenses, categories, reports, and other settings.
                <br/><br/>
                Keep this file safe - it includes your private financial data. If you need to restore 
                from a backup, you can use the "restore data" feature, and upload the .json file again.
                <br/><br/>
                You can also use this same process to move AET between different browsers or computers -
                as long as you have the .json file!
                <br/><br/>
                Note: do not try to edit the file with any external apps, this could corrupt your data.
              </HelpDialog>
            </Stack>
          </Box>
          <Box sx={{ marginTop: "1rem" }}>
            <Typography>
              Clear current data and restore from a backup file
            </Typography>
            <Stack justifyContent="space-between" alignItems="flex-start" direction="row">
              <RestoreButton />
              <HelpDialog title="Restoring Data">
                You can restore your AET data from a previous backup. To do this:
                <br/><br/>
                  Click the "Restore Data" button. This will open a popup.
                  <br/>
                  The popup asks you to confirm that you want to restore your data. Restoring from a backup deletes anything you currently have in AET. (Make sure to back it up first!)
                  <br/>
                  Choose the AET backup file from your system, then press "Restore"
                  <br/>
                  AET will restore your data from the file, and refresh the page.
                <br/><br/>
                This feature is most helpful for if you move to a new computer, reset your browser, or swap browsers.
              </HelpDialog>
            </Stack>
          </Box>
        </Box>
        <Box sx={{ width: "100%", p: 1, border: "1px solid lightgrey" }}>
          <Typography variant="h5">Clear Data</Typography>
          <Box>
            <Typography>
              Reset AET back to default state, removing all data
            </Typography>
            <Stack justifyContent="space-between" alignItems="flex-start" direction="row">
              <ClearButton></ClearButton>
              <HelpDialog title="Clearing data">
                This allows you to reset all of AET, deleting all your data in the process
                <br/><br/>
                You probably never need to do this, unless you were testing AET before and want to start from scratch,
                or you have moved your data to another computer and don't want others to access it.
                <br/><br/>
                Be sure to back up your data first!
              </HelpDialog>
            </Stack>
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
