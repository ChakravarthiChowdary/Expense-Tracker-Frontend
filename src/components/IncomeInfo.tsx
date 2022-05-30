import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Snackbar,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { Dispatch, useEffect, useState } from "react";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

import { useAppSelector } from "../store/store";
import { useDispatch } from "react-redux";
import {
  AUTH_CLEAN_UPDATE_PROFILE_STATE,
  updateIncomeInfo,
} from "../store/actions/auth";

const IncomeInfo = () => {
  const { user, updateIncomeLoading, updateIncomeError, updateIncomeSuccess } =
    useAppSelector((state) => state.auth);
  const dispatch: Dispatch<any> = useDispatch();
  const [editMode, setEditMode] = useState(false);
  const [open, setOpen] = useState(false);
  const [fields, setFields] = useState({
    values: {
      netIncome: user.netIncome,
      savingsPercentage: user.savingsPercentage,
    },
    errors: {
      netIncome: "",
      savingsPercentage: "",
    },
  });

  useEffect(() => {
    if (updateIncomeError) {
      setOpen(true);
    }
  }, [updateIncomeError]);

  useEffect(() => {
    if (updateIncomeSuccess) {
      setOpen(true);
    }
  }, [updateIncomeSuccess]);

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    dispatch({ type: AUTH_CLEAN_UPDATE_PROFILE_STATE });
    setOpen(false);
    setEditMode(false);
    resetForm();
  };

  const getErrorMessage = () => {
    if (updateIncomeError) {
      return updateIncomeError.message;
    }

    if (updateIncomeSuccess) {
      return "Income info updated.";
    }
  };

  const resetForm = () => {
    setEditMode(false);
    setFields({
      values: {
        netIncome: user.netIncome,
        savingsPercentage: user.savingsPercentage,
      },
      errors: {
        netIncome: "",
        savingsPercentage: "",
      },
    });
  };

  const modifyClickedHandler = () => {
    if (
      fields.errors.savingsPercentage === "" &&
      fields.errors.netIncome === ""
    ) {
      dispatch(
        updateIncomeInfo(
          fields.values.netIncome,
          fields.values.savingsPercentage
        )
      );
    }
  };

  return (
    <>
      <Paper sx={{ width: "100%", height: "100%", mt: 2 }} elevation={10}>
        <Grid container spacing={2} sx={{ p: 3 }}>
          <Grid item xs={12} sm={12} md={12}>
            <FormControl fullWidth>
              <InputLabel htmlFor="net-income">Net Income</InputLabel>
              <OutlinedInput
                id="net-income"
                value={fields.values.netIncome}
                startAdornment={
                  <InputAdornment position="start">₹</InputAdornment>
                }
                label="Net Income"
                aria-describedby="net-income-error-text"
                name="Net Income"
                onChange={(e) =>
                  setFields((prevState) => ({
                    values: {
                      ...prevState.values,
                      netIncome: e.target.value,
                    },
                    errors:
                      e.target.value === ""
                        ? {
                            netIncome: "Net income cannot be zero",
                            savingsPercentage:
                              prevState.errors.savingsPercentage,
                          }
                        : {
                            netIncome: "",
                            savingsPercentage:
                              prevState.errors.savingsPercentage,
                          },
                  }))
                }
                disabled={!editMode}
                error={fields.errors.netIncome !== ""}
              />
              {fields.errors.netIncome !== "" && (
                <FormHelperText
                  sx={{ m: 0, mt: 1 }}
                  id="net-income-error-text"
                  error={fields.errors.netIncome !== ""}
                >
                  Net income should not be blank
                </FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth sx={{ mt: 3, mb: 3 }}>
              <InputLabel htmlFor="savings-percentage">
                Savings Percentage
              </InputLabel>
              <OutlinedInput
                id="savings-percentage"
                value={fields.values.savingsPercentage}
                label="Savings Percentage"
                aria-describedby="savings-percentage-error-text"
                name="Savings Percentage"
                onChange={(e) =>
                  setFields((prevState) => ({
                    values: {
                      ...prevState.values,
                      savingsPercentage: e.target.value,
                    },
                    errors:
                      e.target.value === ""
                        ? {
                            netIncome: prevState.errors.netIncome,
                            savingsPercentage:
                              "Savings percentage cannot be zero",
                          }
                        : {
                            netIncome: prevState.errors.netIncome,
                            savingsPercentage: "",
                          },
                  }))
                }
                error={fields.errors.savingsPercentage !== ""}
                disabled={!editMode}
                endAdornment={
                  <InputAdornment position="start">%</InputAdornment>
                }
              />
              {fields.errors.savingsPercentage !== "" && (
                <FormHelperText
                  sx={{ m: 0, mt: 1 }}
                  id="net-income-error-text"
                  error={fields.errors.savingsPercentage !== ""}
                >
                  Savings percentage should not be blank
                </FormHelperText>
              )}
            </FormControl>
            <LoadingButton
              variant="outlined"
              startIcon={!editMode && <ModeEditIcon />}
              onClick={
                !editMode ? () => setEditMode(true) : modifyClickedHandler
              }
              loading={updateIncomeLoading}
            >
              {editMode ? "Modify Income Info" : "Edit Income Info"}
            </LoadingButton>
            {editMode && (
              <Button color="error" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>
      {(updateIncomeError || updateIncomeSuccess) && (
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
            severity={updateIncomeSuccess ? "success" : "error"}
            sx={{ width: "100%" }}
          >
            {getErrorMessage()}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default IncomeInfo;
