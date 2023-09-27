// import React from 'react'
import {
  CategoryList,
  CategoryContext,
  defaultCategories
} from "../context/CategoryContext";
import { useState } from "react";
import { Button, Grid } from "@mui/material";
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
    <>
      <div>Settings</div>
      {/* CategoryContext Provider sets the CategoryContext to whatever categoryList is (and react handles updating it in the background)*/}
      <CategoryContext.Provider value={categoryList}>
        {/* Display an array of categories */}
        {categoryList.map((categoryName, index) => (
          <Grid container direction="row" key={index}>
            <Grid item xs={6}>
              <div>
                <input
                  type="text"
                  value={categoryName}
                  onChange={() => {
                    updateCategory(index, categoryName);
                  }}
                />
              </div>
            </Grid>
            <Grid item xs={6}>
              <div>
                <Button
                  variant="contained"
                  onClick={() => removeCategory(index)}
                >
                  Add
                </Button>
              </div>
            </Grid>
          </Grid>
        ))}
      </CategoryContext.Provider>
    </>
  );
}
