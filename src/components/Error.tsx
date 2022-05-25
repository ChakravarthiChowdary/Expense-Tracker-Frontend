import { Alert, AlertColor, Button, Container } from "@mui/material";
import React from "react";

interface IErrorProps {
  message: string;
  retryHandleClick?: () => void;
  severity?: AlertColor;
}

const Error: React.FC<IErrorProps> = ({
  message,
  retryHandleClick,
  severity,
}) => {
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "90vh",
      }}
    >
      <Alert severity={severity ? severity : "error"}>
        {message}
        {retryHandleClick && (
          <Button
            size="small"
            color="error"
            sx={{ textTransform: "none", fontFamily: "poppins" }}
            onClick={retryHandleClick}
          >
            RETRY
          </Button>
        )}
      </Alert>
    </Container>
  );
};

export default Error;
