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
import { MuiColorInput } from "mui-color-input";
export default function EditCategories() {
  // Get the category list context, and the setter function, from the global context (see App.tsx)
  const categoryList = useContext(CategoryContext);
  const setCategoryList = useContext(CategoryUpdaterContext);
  // state for the editDialog
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [newCategoryColor, setNewCategoryColor] = useState("#ffffff");
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
    const newCategoryList = [...categoryList];
    // check if this is a new item first - we may need to add it to the list
    if (selectedCategory == categoryList.length) {
      newCategoryList.push({ name: "", id: uuidv4(), color: "#ffffff" });
    }
    // update the category name for the selected category
    newCategoryList[selectedCategory].name = newCategoryName;
    newCategoryList[selectedCategory].color = newCategoryColor;
    setCategoryList(newCategoryList);
    setOpenDialog(false);
    // Store the updated category list in local storage
    saveCategory(newCategoryList[selectedCategory]);
  };

  const addCategory = () => {
    // allow the user to enter a name for the category:
    setOpenDialog(true);
    setNewCategoryName("");
    setSelectedCategory(categoryList.length); // Selected category index is out of bounds of list to indicate addding a new item
  };

  return (
    <>
      <Paper
        elevation={1}
        sx={{ padding: 2, minWidth: "200px", maxWidth: "50dvw" }}
      >
        <Typography variant="h6">Category List</Typography>
        <Typography variant="body1">
          Add & remove expense categories here. Choose categories that make
          sense for your budgeting goals.
        </Typography>

        {/* Display an array of categories */}
        <List>
          {categoryList.map((category: Category, index: number) => (
            <ListItem
              sx={{ backgroundColor: category.color, m: 1, p: 0 }}
              key={index}
              onClick={() => displayEditDialog(index)}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={(e) => {
                    e.stopPropagation(); // so that it doesn't bubble up to the parent component and open the edit dialog as well.
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
        <Button variant="contained" onClick={addCategory}>
          Add Category
        </Button>
      </Paper>
      <Dialog open={openDialog} sx={{ p: 5 }}>
        <Box sx={{ p: 5 }}>
          <Typography variant="h6">Edit category</Typography>
          <TextField
            variant="outlined"
            label="Category Name"
            sx={{ width: "100%" }}
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e?.target.value)}
          />
          <MuiColorInput
            label="Colour"
            value={newCategoryColor}
            sx={{ width: "100%", mt: 1 }}
            onChange={(c) => setNewCategoryColor(c)}
          ></MuiColorInput>
          <Button
            onClick={() => {
              setOpenDialog(false);
            }}
          >
            Cancel
          </Button>
          <Button onClick={updateSelectedCategory}>Save</Button>
        </Box>
      </Dialog>
      <Dialog open={removeDialog} sx={{ p: 5 }}>
        <Box sx={{ p: 5 }}>
          <Typography variant="h6">
            Are you sure you want to remove this category?
          </Typography>
          <Button
            onClick={() => {
              setRemoveDialog(false);
            }}
          >
            Cancel
          </Button>
          <Button
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
