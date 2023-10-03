// import React from 'react'
import {
    CategoryList,
    CategoryContext,
    defaultCategories
  } from "../../context/CategoryContext";
import { useState } from "react";
import { Button, Paper, Box, Typography, List,ListItem, IconButton, TextField,Dialog } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Category } from "../../types/category";
import { deleteCategory, saveCategory } from "../../database/categories";
export default function EditCategories() {

  // state to store the list of categories
  const [categoryList, setCategoryList] =
    useState<CategoryList>(defaultCategories);
  // state for the editDialog
  const [selectedCategory,setSelectedCategory] = useState<number>(0);
  const [newCategoryName,setNewCategoryName] = useState<string>("");
  const [openDialog,setOpenDialog] = useState<boolean>(false);
  const [removeDialog,setRemoveDialog] = useState<boolean>(false);

  const removeCategory = () => {
    // removes a category from the list
    const newCategoryList = [...categoryList];
    newCategoryList.splice(selectedCategory, 1);
    setCategoryList(newCategoryList);
    // remove the category from local storage
    deleteCategory(categoryList[selectedCategory].id);
  };

  const displayEditDialog = (index:number) =>{
    setNewCategoryName(categoryList[index].name)// initialise textbox to old category name
    setSelectedCategory(index)
    setOpenDialog(true)
  }

  const updateSelectedCategory = ()=>{
    // update the category name for the selected category
    const newCategoryList = [...categoryList];
    newCategoryList[selectedCategory].name = newCategoryName;
    setCategoryList(newCategoryList);
    setOpenDialog(false);
    // Store the updated category list in local storage
    saveCategory(categoryList[selectedCategory]);
  }

  const addCategory = () => {
    // adds a category to the list
    const newCategoryList = [...categoryList];
    newCategoryList.push({ name: "", id: Math.random().toString()});
    setCategoryList(newCategoryList);
    // allow the user to enter a name for the category:
    setOpenDialog(true);
    setNewCategoryName("");
    setSelectedCategory(newCategoryList.length-1);
  };

  return (
      <CategoryContext.Provider value={categoryList}>
        <Paper elevation={4} sx={{padding:5}}>
        <Typography variant="h5">Category List</Typography>
        
        {/* Display an array of categories */}
        <List>
        {categoryList.map((category:Category, index:number) => (
          <ListItem key={index} 
          secondaryAction={
            <IconButton edge="end" aria-label="delete" onClick={() => {setRemoveDialog(true);setSelectedCategory(index)}}>
              <DeleteIcon />
            </IconButton>
          }>
            <IconButton edge="start" aria-label="edit" onClick={() => displayEditDialog(index)}>
              <EditIcon />
            </IconButton>
            <Typography variant="body1" > {category.name}</Typography>
          </ListItem>
        ))}
        </List>
        <Button variant="contained" onClick={addCategory}>Add Category</Button>
        </Paper>
        <Dialog open={openDialog} sx={{p:5}}>
          <Box sx={{p:5}}>
            <Typography variant="h6">Edit category name:</Typography>
            <TextField variant="outlined" sx={{width:"100%"}} value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e?.target.value)} />
            <Button onClick={()=>{setOpenDialog(false)}}>Cancel</Button>
            <Button onClick={updateSelectedCategory}>Save</Button>
          </Box>
        </Dialog>
        <Dialog open={removeDialog} sx={{p:5}}>
          <Box sx={{p:5}}>
            <Typography variant="h6">Are you sure you want to remove this category?</Typography>
            <Button onClick={()=>{setRemoveDialog(false)}}>Cancel</Button>
            <Button onClick={()=>{setRemoveDialog(false);removeCategory()}}>Remove</Button>
          </Box>
        </Dialog>
      </CategoryContext.Provider>
  );
}
  