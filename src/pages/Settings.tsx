// import React from 'react'
import {
  CategoryList,
  CategoryContext,
  defaultCategories
} from "../context/CategoryContext";
import { useState } from "react";
import { Button, Grid, Paper, Box, Typography, List,ListItem, IconButton, TextField } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
export default function Settings() {
  // state to store the list of categories
  const [categoryList, setCategoryList] =
    useState<CategoryList>(defaultCategories);

  const removeCategory = (index: number) => {
    // removes a category from the list
    const newCategoryList = [...categoryList];
    newCategoryList.splice(index, 1);
    setCategoryList(newCategoryList);
  };

  const addCategory = () => {
    // adds a category to the list
    const newCategoryList = [...categoryList];
    newCategoryList.push("");
    setCategoryList(newCategoryList);
  };

  const updateCategory = (index: number, newName: string) => {
    // updates a category in the list
    const newCategoryList = [...categoryList];
    newCategoryList[index] = newName;
    setCategoryList(newCategoryList);
  };
  // TODO: Categories need unique ids for if they're changed
  return (
    <Box sx={{ width: "100%", height: "94%",p:3 }}>
      <Typography variant="h4">Settings</Typography>
      
      {/* CategoryContext Provider sets the CategoryContext to whatever categoryList is (and react handles updating it in the background)*/}
      
      <Grid container direction="row" spacing={2}>
      <Grid item xs={4} md={6} sm={12}>
      <CategoryContext.Provider value={categoryList}>
        <Paper elevation={4} sx={{padding:5}}>
        <Typography variant="h5">Category List</Typography>
        <Button variant="contained" onClick={addCategory}>Add Category</Button>
        {/* Display an array of categories */}
        <List>
        {categoryList.map((categoryName, index) => (
          <ListItem key={index} secondaryAction={
            <IconButton edge="end" aria-label="delete" onClick={() => removeCategory(index)}>
              <DeleteIcon />
            </IconButton>
          }>
            <TextField variant="outlined" sx={{width:"100%"}} defaultValue={categoryName}
              /*onChange={() => {
                updateCategory(index, categoryName);
              }}*/ />
          </ListItem>
        ))}
        </List>
        </Paper>
      </CategoryContext.Provider>
      </Grid>
      </Grid>
      
    </Box>
  );
}
