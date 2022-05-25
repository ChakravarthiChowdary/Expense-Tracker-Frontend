import { Button, Container, Paper, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";

import useWindowSize from "../hooks/useWindowSize";

const PageNotFound = () => {
  const navigate = useNavigate();
  const size = useWindowSize();

  return (
    <Container
      sx={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "90vh",
      }}
    >
      <Paper
        sx={{
          p: 6,
          width: "50%",
          textAlign: "center",
          fontFamily: "poppins",
          fontSize: "1.5rem",
        }}
        elevation={4}
      >
        <Typography
          variant={size.width && size.width <= 800 ? "body1" : "h5"}
          sx={{ fontWeight: "bold" }}
        >
          Oops ! Page not found (404).
        </Typography>
        <Button
          sx={{ marginTop: 3 }}
          variant="contained"
          onClick={() => navigate("/", { replace: true })}
          color="secondary"
        >
          Go back to home
        </Button>
      </Paper>
    </Container>
  );
};

export default PageNotFound;
