// import React from 'react'
import {  Grid,  Box, Typography } from "@mui/material";
import { useTitle } from "../hooks/UseTitle";
import EditCategories from "./Settings/EditCategories";
import EditAccounts from "./Settings/EditAccounts";
export default function Settings() {
  useTitle("Settings");

  return (
    <Box sx={{ width: "100%", height: "94%",p:3 }}>
      <Typography variant="h4">Settings</Typography>
      
      {/* CategoryContext Provider sets the CategoryContext to whatever categoryList is (and react handles updating it in the background)*/}
      
      <Grid container direction="row" spacing={2}>
      <Grid item xs={4} md={6} sm={12}>
        <EditCategories/>
      </Grid>
        <Grid item xs={4} md={6} sm={12}>
          <EditAccounts/>
        </Grid>
      </Grid>
      
    </Box>
  );
}
