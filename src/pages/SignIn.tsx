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
import { signInUser } from "../store/actions/auth";
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

export default function SignIn() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [formError, setFormError] = React.useState(false);
  const [emailTouched, setEmailTouched] = React.useState(false);
  const [passwordTouched, setPasswordTouched] = React.useState(false);
  const { loading, error, autoLoginLoading } = useAppSelector(
    (state) => state.auth
  );
  const dispatch: React.Dispatch<any> = useDispatch();

  const handleSubmit = (event: any) => {
    event.preventDefault();
    // const data = new FormData(event.currentTarget);
    if (email === "" || password === "") {
      setFormError(true);
      return;
    }
    dispatch(signInUser({ email, password }));
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
            Sign in
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
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e) => {
                setFormError(false);
                setPasswordTouched(true);
                setPassword(e.target.value);
              }}
              error={passwordTouched && password === ""}
            />
            {(error || formError) && (
              <Alert severity="error">
                {formError ? "All fields are mandatory." : error.message}
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
              Sign In
            </LoadingButton>
            <Grid container>
              <Grid item xs>
                <RouterLink to="/forgotpassword">
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </RouterLink>
              </Grid>
              <Grid item>
                <RouterLink to="/signup">
                  <Link href="#" variant="body2">
                    {"Don't have an account? Sign Up"}
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
