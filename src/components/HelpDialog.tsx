import { ReactNode, useState } from "react";
import {
  IconButton,
  Dialog,
  Typography,
  Box,
  Stack,
  Tooltip
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CloseIcon from "@mui/icons-material/Close";

const HelpDialog = (props: { children: ReactNode; title: string }) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip title={"Help: " + props.title}>
        <IconButton
          color="inherit"
          onClick={handleDialogOpen}
          aria-owns={open ? "help-dialog" : undefined}
          aria-haspopup="true"
        >
          <HelpOutlineIcon />
        </IconButton>
      </Tooltip>
      <Dialog id="help-dialog" open={open} onClose={handleDialogClose}>
        <Box sx={{ p: 4 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={{ xs: 1, sm: 2, md: 4 }}
          >
            <Typography variant="h4">{props.title}</Typography>
            <IconButton
              color="inherit"
              onClick={handleDialogClose}
              aria-owns={open ? "help-dialog" : undefined}
            >
              <CloseIcon />
            </IconButton>
          </Stack>
          {props.children}
        </Box>
      </Dialog>
    </>
  );
};

export default HelpDialog;
