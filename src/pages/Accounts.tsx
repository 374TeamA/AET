// import React from 'react'
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Transactions from "./Accounts/Transactions";
import Import from "./Accounts/ImportTransaction";
import History from "./Accounts/History";
import { useTitle } from "../hooks/UseTitle";
import { useParams } from "react-router";
import Cash from "./Accounts/Cash";
//Accounts page is the default layout for each account and will need to load the specifics of the account based on a given account id

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ height: "100%" }}
    >
      {value === index && <Box sx={{ p: 1, height: "80dvh" }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  // Accessibility props (A11y is shorthand)
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  };
}
export default function Accounts() {
  const [value, setValue] = React.useState(0);
  const params = useParams();
  const accountId: string | undefined = params.id;
  useTitle("Accounts");
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className="content">
      <Box sx={{ width: "100%", height: "90%" }}>
        {accountId == "CASH" ? ( // When it is the cash screen
          <>
            <Cash></Cash>
          </>
        ) : (
          // When it is not the cash screen
          <>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="Accounts-Tab-Panel"
              >
                <Tab label="Expenses" {...a11yProps(0)} />
                <Tab label="Import From Bank" {...a11yProps(1)} />
                <Tab label="Import History" {...a11yProps(2)} />
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              <Transactions />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <Import />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              <History />
            </CustomTabPanel>
          </>
        )}
      </Box>
    </div>
  );
}
