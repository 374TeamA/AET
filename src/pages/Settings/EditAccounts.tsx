// import React from 'react'
import { AccountContext, defaultAccounts } from "../../context/AccountsContext";
import { useState } from "react";
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
import { Account } from "../../types/account";
import { deleteAccount, saveAccount } from "../../database/accounts";
import { v4 as uuidv4 } from "uuid";
export default function EditAccounts() {
  // state to store the list of categories
  const [accountList, setAccountList] = useState<Account[]>(defaultAccounts);
  // state for the editDialog
  const [selectedAccount, setSelectedAccount] = useState<number>(0);
  const [newAccountName, setNewAccountName] = useState<string>("");
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState<boolean>(false);

  const removeAccount = () => {
    // removes a account from the list
    const newAccountList = [...accountList];
    newAccountList.splice(selectedAccount, 1);
    setAccountList(newAccountList);
    // remove the account from local storage
    deleteAccount(accountList[selectedAccount].id);
  };

  const editItem = (index: number) => {
    setNewAccountName(accountList[index].name); // initialise textbox to old account name
    setSelectedAccount(index);
    setEditDialogOpen(true);
  };
  const updateSelectedAccount = () => {
    // update the account name for the selected account
    const newAccountList = [...accountList];
    newAccountList[selectedAccount].name = newAccountName;
    setAccountList(newAccountList);
    setEditDialogOpen(false);
    saveAccount(accountList[selectedAccount]);
  };

  const addAccount = () => {
    // adds a account to the list
    const newAccountList = [...accountList];
    newAccountList.push({ name: "", id: uuidv4() });
    setAccountList(newAccountList);
    // allow the user to enter a name for the account:
    setEditDialogOpen(true);
    setNewAccountName("");
    setSelectedAccount(newAccountList.length - 1);
  };

  return (
    <AccountContext.Provider value={accountList}>
      <Paper elevation={4} sx={{ padding: 5 }}>
        <Typography variant="h5">Account List</Typography>

        {/* Display an array of categories */}
        <List>
          {accountList.map((account: Account, index: number) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => {
                    setRemoveDialogOpen(true);
                    setSelectedAccount(index);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <IconButton
                edge="start"
                aria-label="edit"
                onClick={() => editItem(index)}
              >
                <EditIcon />
              </IconButton>
              <Typography variant="body1"> {account.name}</Typography>
            </ListItem>
          ))}
        </List>
        <Button variant="contained" onClick={addAccount}>
          Add Account
        </Button>
      </Paper>
      <Dialog open={editDialogOpen} sx={{ p: 5 }}>
        <Box sx={{ p: 5 }}>
          <Typography variant="h6">Edit account name:</Typography>
          <TextField
            variant="outlined"
            sx={{ width: "100%" }}
            value={newAccountName}
            onChange={(e) => setNewAccountName(e?.target.value)}
          />
          <Button
            onClick={() => {
              setEditDialogOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button onClick={updateSelectedAccount}>Save</Button>
        </Box>
      </Dialog>
      <Dialog open={removeDialogOpen} sx={{ p: 5 }}>
        <Box sx={{ p: 5 }}>
          <Typography variant="h6">
            Are you sure you want to remove this account?
          </Typography>
          <Button
            onClick={() => {
              setRemoveDialogOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setRemoveDialogOpen(false);
              removeAccount();
            }}
          >
            Remove
          </Button>
        </Box>
      </Dialog>
    </AccountContext.Provider>
  );
}
