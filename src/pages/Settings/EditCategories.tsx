// import React from 'react'
import {
  CategoryContext,
  CategoryUpdaterContext
} from "../../context/CategoryContext";
import { useContext, useState } from "react";
import {
  Button,
  Paper,
  Box,
  Typography,
  List,
  ListItem,
  IconButton,
  TextField,
  Dialog
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Category } from "../../types/category";
import { deleteCategory, saveCategory } from "../../database/categories";
import { v4 as uuidv4 } from "uuid";
export default function EditCategories() {
  // Get the category list context, and the setter function, from the global context (see App.tsx)
  const categoryList = useContext(CategoryContext);
  const setCategoryList = useContext(CategoryUpdaterContext);
  // state for the editDialog
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [removeDialog, setRemoveDialog] = useState<boolean>(false);

  const removeCategory = () => {
    // removes a category from the list
    const newCategoryList = [...categoryList];
    newCategoryList.splice(selectedCategory, 1);
    setCategoryList(newCategoryList);
    // remove the category from local storage
    deleteCategory(categoryList[selectedCategory].id);
  };

  const displayEditDialog = (index: number) => {
    setNewCategoryName(categoryList[index].name); // initialise textbox to old category name
    setSelectedCategory(index);
    setOpenDialog(true);
  };

  const updateSelectedCategory = () => {
    // update the category name for the selected category
    const newCategoryList = [...categoryList];
    newCategoryList[selectedCategory].name = newCategoryName;
    setCategoryList(newCategoryList);
    setOpenDialog(false);
    // Store the updated category list in local storage
    saveCategory(categoryList[selectedCategory]);
  };

  const addCategory = () => {
    // adds a category to the list
    const newCategoryList = [...categoryList];
    newCategoryList.push({ name: "", id: uuidv4() });
    setCategoryList(newCategoryList);
    // allow the user to enter a name for the category:
    setOpenDialog(true);
    setNewCategoryName("");
    setSelectedCategory(newCategoryList.length - 1);
  };

  return (
    <>
      <Paper elevation={1} sx={{ padding: 2, width: "40dvw" }}>
        <Typography variant="h6">Category List</Typography>

        {/* Display an array of categories */}
        <List>
          {categoryList.map((category: Category, index: number) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => {
                    setRemoveDialog(true);
                    setSelectedCategory(index);
                  }}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <IconButton
                edge="start"
                aria-label="edit"
                onClick={() => displayEditDialog(index)}
                size="small"
              >
                <EditIcon />
              </IconButton>
              <Typography variant="body1"> {category.name}</Typography>
            </ListItem>
          ))}
        </List>
        <Button size="small" variant="contained" onClick={addCategory}>
          Add Category
        </Button>
      </Paper>
      <Dialog open={openDialog} sx={{ p: 2 }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">Edit category name:</Typography>
          <TextField
            variant="outlined"
            sx={{ width: "100%" }}
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e?.target.value)}
          />
          <Button
            size="small"
            onClick={() => {
              setOpenDialog(false);
            }}
          >
            Cancel
          </Button>
          <Button onClick={updateSelectedCategory}>Save</Button>
        </Box>
      </Dialog>
      <Dialog open={removeDialog} sx={{ p: 2 }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">
            Are you sure you want to remove this category?
          </Typography>
          <Button
            size="small"
            onClick={() => {
              setRemoveDialog(false);
            }}
          >
            Cancel
          </Button>
          <Button
            size="small"
            onClick={() => {
              setRemoveDialog(false);
              removeCategory();
            }}
          >
            Remove
          </Button>
        </Box>
      </Dialog>
    </>
  );
}
