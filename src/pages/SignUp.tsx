import * as React from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link as RouterLink } from "react-router-dom";
import { Alert } from "@mui/material";
import { useAppSelector } from "../store/store";
import { useDispatch } from "react-redux";
import { CLEAN_UP_AUTH_STATE, signUp } from "../store/actions/auth";
import { LoadingButton } from "@mui/lab";

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

export default function SignUp() {
  const [email, setEmail] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [emailTouched, setEmailTouched] = React.useState(false);
  const [firstNameTouched, setFirstNameTouched] = React.useState(false);
  const [lastNameTouched, setLastNameTouched] = React.useState(false);
  const [passwordTouched, setPasswordTouched] = React.useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] =
    React.useState(false);
  const [formError, setFormError] = React.useState(false);
  const { error, loading, signUpSuccess } = useAppSelector(
    (state) => state.auth
  );
  const dispatch: React.Dispatch<any> = useDispatch();

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const errorForm =
      email === "" ||
      password === "" ||
      confirmPassword === "" ||
      firstName === "" ||
      lastName === "";
    // const data = new FormData(event.currentTarget);
    setFormError(errorForm);

    if (!errorForm) {
      dispatch(
        signUp({
          username: firstName + lastName,
          email,
          password,
          confirmPassword,
          photoUrl:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8YXZhdGFyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
        })
      );
    }
  };

  React.useEffect(() => {
    return () => {
      dispatch({ type: CLEAN_UP_AUTH_STATE });
    };
  }, [dispatch]);

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
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  onChange={(e) => {
                    setFirstNameTouched(true);
                    setFirstName(e.target.value);
                  }}
                  error={firstNameTouched && firstName === ""}
                  value={firstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  onChange={(e) => {
                    setLastNameTouched(true);
                    setLastName(e.target.value);
                  }}
                  error={lastNameTouched && lastName === ""}
                  value={lastName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={(e) => {
                    setEmailTouched(true);
                    setEmail(e.target.value);
                  }}
                  error={emailTouched && email === ""}
                  value={email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={(e) => {
                    setPasswordTouched(true);
                    setPassword(e.target.value);
                  }}
                  error={passwordTouched && password === ""}
                  value={password}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmpassword"
                  label="ConfirmPassword"
                  type="password"
                  id="confirmpassword"
                  onChange={(e) => {
                    setConfirmPasswordTouched(true);
                    setConfirmPassword(e.target.value);
                  }}
                  error={confirmPasswordTouched && confirmPassword === ""}
                  value={confirmPassword}
                />
              </Grid>
            </Grid>
            {(error || formError || signUpSuccess) && (
              <Alert
                severity={signUpSuccess ? "success" : "error"}
                sx={{ mt: 2 }}
              >
                {signUpSuccess
                  ? "Sign up success. Please sign in to continue."
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
              Sign Up
            </LoadingButton>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <RouterLink to="/">
                  <Link href="#" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </RouterLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
