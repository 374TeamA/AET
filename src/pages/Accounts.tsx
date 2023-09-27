// import React from 'react'
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Transactions from "./Accounts/Transactions";
import Import from "./Accounts/Import";
import History from "./Accounts/History";
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
      {value === index && (
        <Box sx={{ p: 3, height: "100%" }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
export default function Accounts() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", height: "94%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="Accounts-Tab-Panel"
        >
          <Tab label="Transactions" {...a11yProps(0)} />
          <Tab label="Import" {...a11yProps(1)} />
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
    </Box>
  );
}
