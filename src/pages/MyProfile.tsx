import {
  Avatar,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Grid,
  IconButton,
  Paper,
  Snackbar,
  TextField,
  styled,
  AppBar,
  Tabs,
  Tab,
  Typography,
  Box,
} from "@mui/material";
import SwipeableViews from "react-swipeable-views";
import React, { useState, Dispatch, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useAppSelector } from "../store/store";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { useDispatch } from "react-redux";
import {
  AUTH_CLEAN_UPDATE_PROFILE_STATE,
  changeOrUploadProfilePic,
  updateProfile,
} from "../store/actions/auth";
import { LoadingButton } from "@mui/lab";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { useTheme } from "@mui/material/styles";
import IncomeInfo from "../components/IncomeInfo";
import useWindowSize from "../hooks/useWindowSize";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Input = styled("input")({
  display: "none",
});

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const Profile = () => {
  const theme = useTheme();
  const {
    user,
    updateProfileLoading,
    updateProfileError,
    updateProfileSuccess,
    updateProfilePicError,
    updateProfilePicSuccess,
  } = useAppSelector((state) => state.auth);
  const [editMode, setEditMode] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [username, setUsername] = useState(user?.username);
  const dispatch: Dispatch<any> = useDispatch();
  const [error, setError] = useState<null | string>(null);
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [tabValue, setTabValue] = React.useState(0);
  const size = useWindowSize();

  useEffect(() => {
    if (updateProfileError || updateProfilePicError) {
      setOpen(true);
    }
  }, [updateProfileError, updateProfilePicError]);

  useEffect(() => {
    if (updateProfileSuccess || updateProfilePicSuccess) {
      if (updateProfilePicSuccess) {
        window.location.reload();
      }
      setOpen(true);
    }
  }, [updateProfileSuccess, updateProfilePicSuccess]);

  const resetForm = () => {
    setEditMode(false);
    setPassword("");
    setConfirmPassword("");
    setUsername(user?.username);
    setOpen(false);
    handleDialogClose();
  };

  const handleDialogClose = () => {
    resetForm();

    dispatch({ type: AUTH_CLEAN_UPDATE_PROFILE_STATE });
  };

  const proceedClickedHandler = () => {
    dispatch(
      updateProfile({
        username: username ? username : "",
        passwordUpdated,
        password,
        confirmPassword,
        id: user ? user?.id : "",
      })
    );
    setDialogOpen(false);
  };

  const modifyClickedHandler = () => {
    let passwordChanged = false;
    if (password !== "") {
      setPasswordUpdated(true);
      passwordChanged = true;
    }

    if (username !== "") {
      if (passwordChanged) {
        if (password === confirmPassword) {
          setDialogOpen(true);
        } else {
          setOpen(true);
          setError("Confirm password should be same as password.");
        }
      } else if (username !== user?.username) {
        setDialogOpen(true);
      } else {
        setOpen(true);
        setError("Nothing changed to update profile.");
      }
    } else {
      setOpen(true);
      setError("Nothing changed to update profile.");
    }
  };

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    dispatch({ type: AUTH_CLEAN_UPDATE_PROFILE_STATE });
    setOpen(false);
    setError(null);
    setEditMode(false);
    resetForm();
  };

  const getErrorMessage = () => {
    if (updateProfileError || error || updateProfilePicError) {
      if (updateProfileError) return updateProfileError.message;
      if (updateProfilePicError) return updateProfilePicError.message;
      if (error) return error;
    }

    if (updateProfilePicSuccess || updateProfileSuccess) {
      if (updateProfilePicSuccess) return "Profile pic update success.";
      if (updateProfileSuccess) return "Profile updated success.";
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setTabValue(index);
  };

  return (
    <>
      <Container
        sx={{
          mt: 5,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <AppBar position="static">
          <Tabs
            value={tabValue}
            onChange={handleChange}
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
            aria-label="full width tabs example"
          >
            <Tab label="Personal Info" />
            <Tab label="Income Info" />
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={tabValue}
          onChangeIndex={handleChangeIndex}
        >
          <TabPanel value={tabValue} index={0} dir={theme.direction}>
            <Paper sx={{ width: "100%", height: "100%", mt: 2 }} elevation={10}>
              <Grid container spacing={2} sx={{ p: 3 }}>
                <Grid item xs={12} sm={12} md={6}>
                  <Container
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Avatar
                      alt="Remy Sharp"
                      src={user ? user.photoUrl : ""}
                      sx={
                        size.width && size.width > 556
                          ? {
                              width: "50vh",
                              height: "50vh",
                              mb: 3,
                            }
                          : {
                              width: "20vh",
                              height: "20vh",
                              mb: 3,
                            }
                      }
                    />
                    <label htmlFor="profile-photo">
                      <Input
                        accept="image/*"
                        id="profile-photo"
                        type="file"
                        onChange={(e) =>
                          dispatch(changeOrUploadProfilePic(e.target.files))
                        }
                      />
                      <Button component="span">Change Photo</Button>
                    </label>
                  </Container>
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <Container
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <TextField
                      value={username}
                      label="My Name"
                      fullWidth
                      sx={{ mb: 4 }}
                      disabled={!editMode}
                      InputLabelProps={{
                        style: { fontFamily: "poppins", fontSize: 17 },
                      }}
                      InputProps={{
                        style: { fontFamily: "poppins", fontSize: 20 },
                      }}
                      onChange={(e) => setUsername(e.target.value)}
                    />

                    <TextField
                      value={user?.email}
                      label="My Email"
                      fullWidth
                      sx={{ mb: 4 }}
                      focused
                      disabled
                      InputLabelProps={{
                        style: { fontFamily: "poppins", fontSize: 17 },
                      }}
                      InputProps={{
                        style: { fontFamily: "poppins", fontSize: 20 },
                      }}
                    />
                    {editMode && (
                      <>
                        <TextField
                          value={password}
                          label="New password"
                          fullWidth
                          sx={{ mb: 4 }}
                          InputLabelProps={{
                            style: { fontFamily: "poppins", fontSize: 17 },
                          }}
                          InputProps={{
                            style: { fontFamily: "poppins", fontSize: 20 },
                          }}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <TextField
                          value={confirmPassword}
                          label="Confirm password"
                          fullWidth
                          sx={{ mb: 4 }}
                          InputLabelProps={{
                            style: { fontFamily: "poppins", fontSize: 17 },
                          }}
                          InputProps={{
                            style: { fontFamily: "poppins", fontSize: 20 },
                          }}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </>
                    )}
                    <LoadingButton
                      variant="outlined"
                      startIcon={!editMode && <ModeEditIcon />}
                      onClick={
                        !editMode
                          ? () => setEditMode(true)
                          : modifyClickedHandler
                      }
                      loading={updateProfileLoading}
                      color="secondary"
                    >
                      {editMode ? "Modify" : "Edit Profile"}
                    </LoadingButton>
                    {editMode && (
                      <Button color="error" onClick={resetForm}>
                        Cancel
                      </Button>
                    )}
                  </Container>
                </Grid>
              </Grid>
            </Paper>
          </TabPanel>
          <TabPanel value={tabValue} index={1} dir={theme.direction}>
            <IncomeInfo />
          </TabPanel>
        </SwipeableViews>
      </Container>
      {(updateProfileError ||
        error ||
        updateProfileSuccess ||
        updateProfilePicError ||
        updateProfilePicSuccess) && (
        <Snackbar
          open={open}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          autoHideDuration={3000}
          onClose={handleClose}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          <Alert
            onClose={handleClose}
            severity={
              updateProfileSuccess || updateProfilePicSuccess
                ? "success"
                : "error"
            }
            sx={{ width: "100%" }}
          >
            {getErrorMessage()}
          </Alert>
        </Snackbar>
      )}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Proceed to update profile ?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Keep in mind that updating profile requires users to login again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={resetForm}>Cancel</Button>
          <Button onClick={proceedClickedHandler} autoFocus>
            Proceed
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Profile;
