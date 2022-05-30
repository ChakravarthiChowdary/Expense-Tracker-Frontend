import * as React from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link as RouterLink } from "react-router-dom";
import { useAppSelector } from "../store/store";
import { useDispatch } from "react-redux";
import { CLEAN_UP_AUTH_STATE, forgotPassword } from "../store/actions/auth";
import { LoadingButton } from "@mui/lab";
import Loading from "../components/Loading";

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="#">
        Expense Tracker
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

export default function ForgotPassword() {
  const [email, setEmail] = React.useState("");
  const [oldPassword, setOldPassword] = React.useState("");
  const [formError, setFormError] = React.useState(false);
  const [emailTouched, setEmailTouched] = React.useState(false);
  const [oldPasswordTouched, setOldPasswordTouched] = React.useState(false);
  const [newPasswordTouched, setNewPasswordTouched] = React.useState(false);
  const [confirmNewPasswordTouched, setConfirmNewPasswordTouched] =
    React.useState(false);
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmNewPassword, setConfirmNewPassword] = React.useState("");

  const { loading, error, autoLoginLoading, passwordUpdateSuccess } =
    useAppSelector((state) => state.auth);
  const dispatch: React.Dispatch<any> = useDispatch();

  React.useEffect(() => {
    dispatch({ type: CLEAN_UP_AUTH_STATE });

    return () => {
      dispatch({ type: CLEAN_UP_AUTH_STATE });
    };
  }, []);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    // const data = new FormData(event.currentTarget);
    if (
      email === "" ||
      oldPassword === "" ||
      newPassword === "" ||
      confirmNewPassword === ""
    ) {
      setFormError(true);
      return;
    }

    dispatch(
      forgotPassword({
        email,
        oldPassword,
        newPassword,
        confirmPassword: confirmNewPassword,
      })
    );
  };

  if (autoLoginLoading) {
    return <Loading />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Forgot Password
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => {
                setFormError(false);
                setEmailTouched(true);
                setEmail(e.target.value);
              }}
              error={emailTouched && email === ""}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="oldpassword"
              label="Old Password"
              type="password"
              id="oldpassword"
              onChange={(e) => {
                setFormError(false);
                setOldPasswordTouched(true);
                setOldPassword(e.target.value);
              }}
              error={oldPasswordTouched && oldPassword === ""}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="newpassword"
              label="New Password"
              type="password"
              id="newpassword"
              autoComplete="current-password"
              onChange={(e) => {
                setFormError(false);
                setNewPasswordTouched(true);
                setNewPassword(e.target.value);
              }}
              error={newPasswordTouched && newPassword === ""}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmnewpassword"
              label="Confirm New Password"
              type="password"
              id="confirmnewpassword"
              autoComplete="current-password"
              onChange={(e) => {
                setFormError(false);
                setConfirmNewPasswordTouched(true);
                setConfirmNewPassword(e.target.value);
              }}
              error={confirmNewPasswordTouched && confirmNewPassword === ""}
            />
            {(error || formError || passwordUpdateSuccess) && (
              <Alert severity={passwordUpdateSuccess ? "success" : "error"}>
                {passwordUpdateSuccess
                  ? "Password update successful. Login now."
                  : formError
                  ? "All fields are mandatory."
                  : error.message}
              </Alert>
            )}
            <LoadingButton
              color="primary"
              onClick={handleSubmit}
              loading={loading}
              variant="contained"
              fullWidth
              sx={{ mt: 3, mb: 2 }}
            >
              Change Password
            </LoadingButton>
            <Grid container>
              <Grid item>
                <RouterLink to="/">
                  <Link href="#" variant="body2">
                    {"Remember password ? Sign in"}
                  </Link>
                </RouterLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
