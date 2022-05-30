import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {
  Divider,
  Drawer,
  IconButton,
  List,
  Menu,
  MenuItem,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import MoreIcon from "@mui/icons-material/MoreVert";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useNavigate } from "react-router";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import ListItemText from "@mui/material/ListItemText";
import DescriptionIcon from "@mui/icons-material/Description";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PaidIcon from "@mui/icons-material/Paid";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useAppSelector } from "../store/store";
import { useDispatch } from "react-redux";
import { AUTH_SIGNOUT } from "../store/actions/auth";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const NavBar = () => {
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch: React.Dispatch<any> = useDispatch();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const getListIcon = (text: string) => {
    switch (text) {
      case "My Expenses":
        return <DescriptionIcon />;
      case "Add Expense":
        return <AddCircleIcon />;
      case "My Bills":
        return <PaidIcon />;
      case "My Profile":
        return <AccountCircleIcon />;
    }
  };

  const navigateToPath = (text: string) => {
    switch (text) {
      case "My Expenses":
        navigate("/myExpenses");
        break;
      case "Add Expense":
        navigate("/addExpense");
        break;
      case "My Bills":
        navigate("/myBills");
        break;
      case "My Profile":
        navigate("/myProfile");
        break;
    }

    handleDrawerClose();
  };

  const mobileMenuId = "primary-search-account-menu-mobile";

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {user ? (
        <>
          <MenuItem>
            <IconButton size="large" color="inherit">
              <DashboardIcon />
            </IconButton>
            <p>Dashboard</p>
          </MenuItem>
          <MenuItem>
            <IconButton size="large" color="inherit">
              <AddCircleOutlineIcon />
            </IconButton>
            <p>Add Expense</p>
          </MenuItem>
          <MenuItem onClick={() => navigate("/addexpense")}>
            <IconButton size="large" color="inherit">
              <AccountCircleIcon />
            </IconButton>
            <p>My Profile</p>
          </MenuItem>
        </>
      ) : (
        <>
          <MenuItem>
            <IconButton
              size="large"
              color="inherit"
              onClick={() => navigate("/")}
            >
              <LockOpenIcon />
            </IconButton>
            <p>Sign In</p>
          </MenuItem>
          <MenuItem>
            <IconButton
              size="large"
              color="inherit"
              onClick={() => navigate("/signup")}
            >
              <ExitToAppIcon />
            </IconButton>
            <p>Sign Up</p>
          </MenuItem>
          <MenuItem onClick={() => navigate("/forgotPassword")}>
            <IconButton size="large" color="inherit">
              <VpnKeyIcon />
            </IconButton>
            <p>Forgot Password</p>
          </MenuItem>
        </>
      )}
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {user && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(open && { display: "none" }) }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Expense Tracker
          </Typography>
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {user ? (
              <>
                <Button color="inherit" onClick={() => navigate("/")}>
                  Expenses
                </Button>
                <Button color="inherit" onClick={() => navigate("/myProfile")}>
                  My Profile
                </Button>
                <Button
                  color="inherit"
                  onClick={() => {
                    dispatch({ type: AUTH_SIGNOUT });
                    navigate("/", { replace: true });
                  }}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" onClick={() => navigate("/")}>
                  Sign In
                </Button>

                <Button color="inherit" onClick={() => navigate("/signup")}>
                  Sign Up
                </Button>
              </>
            )}
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {["My Expenses", "Add Expense", "My Bills", "My Profile"].map(
            (text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton onClick={() => navigateToPath(text)}>
                  <ListItemIcon>{getListIcon(text)}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            )
          )}
        </List>
      </Drawer>

      {renderMobileMenu}
    </Box>
  );
};

export default NavBar;
