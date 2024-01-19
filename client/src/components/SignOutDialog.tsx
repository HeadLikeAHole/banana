import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '../hooks.ts';
import { signOut } from '../features/auth/authSlice.ts';
import { showAlert } from '../features/alerts/alertsSlice.ts';

interface SignOutDialogProps {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  closeUserMenu: () => void
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function SignOutDialog({ open, setOpen, closeUserMenu }: SignOutDialogProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
    closeUserMenu();
  }

  const handleSignOut = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    handleClose();
    dispatch(signOut());
    dispatch(showAlert({ type: 'success', message: 'You have successfully signed out' }));
    navigate('/');
  }

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
        <form method="post">
          <Button type="submit" variant="outlined" onClick={e => handleSignOut(e)}>Yes</Button>
        </form>
      </DialogActions>
    </Dialog>
  );
}
