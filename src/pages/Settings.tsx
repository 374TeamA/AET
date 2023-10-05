// import React from 'react'
import { Grid, Box, Typography } from "@mui/material";
import { useTitle } from "../hooks/UseTitle";
import EditCategories from "./Settings/EditCategories";
import EditAccounts from "./Settings/EditAccounts";
import AdvancedSettings from "./Settings/AdvancedSettings";
export default function Settings() {
  useTitle("Settings");

  return (
    <div className="content">
      <Box sx={{ width: "100%", p: 3 }}>
        <Typography variant="h4">Settings</Typography>

        {/* CategoryContext Provider sets the CategoryContext to whatever categoryList is (and react handles updating it in the background)*/}

        <Grid container direction="row" spacing={2} justifyContent="center">
          <Grid item xs={4} md={6} sm={12}>
            <EditCategories />
          </Grid>
          <Grid item xs={4} md={6} sm={12}>
            <EditAccounts />
          </Grid>
          <Grid item xs={6} md={8} sm={12}>
            <AdvancedSettings />
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
