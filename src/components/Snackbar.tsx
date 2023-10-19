import React, { useContext, useEffect, ReactElement } from "react";
import { SnackbarContext } from "../context/SnackbarContext";
import { Snackbar } from "@mui/material";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  }
);
export default function SnackbarConsumer() {
  const [alert, setAlert] = React.useState<ReactElement | undefined>(undefined);
  const { snackbarOpen, snackbarMessage, hideSnackbar } =
    useContext(SnackbarContext);
  useEffect(() => {
    console.log(snackbarMessage);
    switch (snackbarMessage?.type) {
      case "success":
        setAlert(
          <Alert severity="success">{String(snackbarMessage?.content)}</Alert>
        );
        break;
      case "error":
        setAlert(<Alert severity="error">{snackbarMessage?.content}</Alert>);
        break;
      case "warning":
        setAlert(<Alert severity="warning">{snackbarMessage?.content}</Alert>);
        break;
      case "info":
        setAlert(<Alert severity="info">{snackbarMessage?.content}</Alert>);
        break;
      default:
        setAlert(<Alert severity="info">{snackbarMessage?.content}</Alert>);
        break;
    }
  }, [snackbarMessage]);
  return (
    <div>
      {/* Your other layout components */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={hideSnackbar}
      >
        {alert}
      </Snackbar>
    </div>
  );
}
