import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useState } from 'react';


/**
 * A button that also has a confirmation window
 * @param props 
 * @returns 
 */
interface ConfirmationButtonProps {
  children:string // button text
  dialogTitle?:string // title for dialog box
  dialogText?:string // text for dialog box
  cancelText?:string // text for "cancel action" button
  confirmText?:string // text for "confirm action" button
  onConfirm?: ()=>void // called when "confirm" is clicked
  onCancel?: ()=>void // called when "cancel" is clicked
}
export function ConfirmationButton(props: ConfirmationButtonProps) {
  const [open, setOpen] = useState(false);

  const handleConfirm = ()=>{
    setOpen(false);
    if(props.onConfirm) {
      props.onConfirm();
    }
  }
  const handleCancel = ()=>{
    setOpen(false);
    if(props.onCancel) props.onCancel();
  }

  return (
    <>
      <Button variant="contained" color="primary" onClick={()=>{setOpen(true)}}>
        {props.children ?? "Click Me"}
      </Button>
      <Dialog open={open} onClose={()=>{setOpen(false)}}>
        <DialogTitle>{props.dialogTitle}</DialogTitle>
        <DialogContent>
          {props.dialogText}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            {props.cancelText ?? "Cancel"}
          </Button>
          <Button onClick={handleConfirm} color="primary">
            {props.confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
