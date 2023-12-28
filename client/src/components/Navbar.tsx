import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import SvgIcon from '@mui/material/SvgIcon';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import { grey } from '@mui/material/colors';
import { NavLink, Link, ActionFunctionArgs, redirect } from 'react-router-dom';

import { useAppSelector } from '../hooks.ts';
import { selectUser, signOut } from '../features/auth/authSlice.ts';
import { showAlert } from '../features/alerts/alertsSlice.ts';
import Logo from './Logo.tsx';
import SignOutDialog from './SignOutDialog.tsx';

export function action(dispatch) {
  return async function({ request }: ActionFunctionArgs) {
    dispatch(signOut());
    dispatch(showAlert({ type: 'success', message: 'You have successfully signed out' }));

    return redirect('/');
  }
}
const pages = ['Products', 'Pricing', 'Blog'];
export default function Navbar() {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const [dialogOpen, setDialogOpen] = useState(false);

  const userState = useAppSelector(selectUser);

  const authenticatedLinks = (
    <>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '45px' }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <MenuItem onClick={() => setDialogOpen(true)}>
          <Typography textAlign="center">Sign Out</Typography>
        </MenuItem>
      </Menu>
    </>
  );

  const guestLinks = (
    <Grid container spacing={2}>
      <Grid item>
        <NavLink
          to="/sign-in"
          className={({ isActive, isPending }) =>
            isPending ? "pending-nav-link" : isActive ? "active-nav-link" : ""
          }
        >
          <Button
            onClick={handleCloseNavMenu}
            sx={{ my: 2, color: 'white', display: 'block' }}
          >
            Sign In
          </Button>
        </NavLink>
      </Grid>

      <Grid item>
        <NavLink
          to="/sign-up"
          className={({ isActive, isPending }) =>
            isPending ? "pending-nav-link" : isActive ? "active-nav-link" : ""
          }
        >
          <Button
            onClick={handleCloseNavMenu}
            sx={{ my: 2, color: 'white', display: 'block' }}
          >
            Sign Up
          </Button>
        </NavLink>
      </Grid>
    </Grid>
  );

  return (
    <>
      <SignOutDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        closeUserMenu={handleCloseUserMenu}
      />
      <AppBar position="static" className="navbar">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <SvgIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}>
              <Logo />
            </SvgIcon>
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              BANANA
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            <SvgIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}>
              <Logo />
            </SvgIcon>
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              BANANA
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {page}
                </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              {userState.status === 'loading' ? (
                <Skeleton animation="wave" variant="circular" width={40} height={40} sx={{ bgcolor: grey[500] }} />
              ) : (
                userState.isAuthenticated ? authenticatedLinks : guestLinks
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}
