import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { Form } from 'react-router-dom';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function SignOutDialog({ open, setOpen, closeUserMenu }) {
  const handleClose = () => {
    setOpen(false);
    closeUserMenu();
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
      sx={{ zIndex: 'tooltip' }}
    >
      <DialogTitle>Are you sure you want to sign out?</DialogTitle>
      <DialogActions>
        <Button variant="outlined" color="primary" onClick={handleClose}>No</Button>
        <Form method="post" action="/sign-out">
          <Button type="submit" variant="outlined" onClick={handleClose}>Yes</Button>
        </Form>
      </DialogActions>
    </Dialog>
  );
}
