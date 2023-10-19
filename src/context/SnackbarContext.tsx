import React, { createContext, useState } from "react";
export const SnackbarContext = createContext<SnackbarContextValue>({
  snackbarOpen: false,
  snackbarMessage: { type: "", content: "" },
  showSnackbar: () => {},
  hideSnackbar: () => {}
});

export interface SnackbarContextValue {
  snackbarOpen: boolean;
  snackbarMessage: SnackBarMessage | null;
  showSnackbar: (type: string, content: string) => void;
  hideSnackbar: () => void;
}

interface SnackBarMessage {
  type: string;
  content: string;
}

interface SnackbarProviderProps {
  children: React.ReactNode;
}

export default function SnackbarProvider({ children }: SnackbarProviderProps) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<{
    type: string;
    content: string;
  } | null>({
    type: "",
    content: ""
  });

  const showSnackbar = (type: string, content: string) => {
    console.log("showSnackbar");
    setSnackbarMessage({ type, content });
    setSnackbarOpen(true);
  };

  const hideSnackbar = () => {
    setSnackbarOpen(false);
  };
  const value: SnackbarContextValue = {
    snackbarOpen,
    snackbarMessage,
    showSnackbar,
    hideSnackbar
  };

  return (
    <SnackbarContext.Provider value={value}>
      {children}
    </SnackbarContext.Provider>
  );
}

// export default SnackbarProvider;
