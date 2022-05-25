import {
  Alert,
  Button,
  Container,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import DeleteIcon from "@mui/icons-material/Delete";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import React, { Dispatch, useEffect, useState } from "react";

import { useAppSelector } from "../store/store";
import "../styles/AddExpense.css";
import { PhotoCamera } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { addExpense, CLEAN_EXPENSE_STATE } from "../store/actions/expense";
import LinearProgressComp from "../components/LinearProgress";

interface FieldsState {
  values: {
    expenseType: string;
    expenseAmount: string;
    expenseDate: Date | null;
    expenseBillName: string;
    expenseBillFile: FileList | null;
  };
  errors: {
    expenseType: string;
    expenseAmount: string;
    expenseDate: string;
  };
}

const Input = styled("input")({
  display: "none",
});

const AddExpense = () => {
  const [fields, setFields] = useState<FieldsState>({
    values: {
      expenseType: "",
      expenseAmount: "",
      expenseDate: null,
      expenseBillName: "",
      expenseBillFile: null,
    },
    errors: {
      expenseType: "",
      expenseAmount: "",
      expenseDate: "",
    },
  });
  const dispatch: Dispatch<any> = useDispatch();

  const { totalNetIncome } = useAppSelector((state) => state.profile);
  const { user } = useAppSelector((state) => state.auth);
  const { loading, addExpenseSuccess, error, progress } = useAppSelector(
    (state) => state.expense
  );

  useEffect(() => {
    let timeout: NodeJS.Timeout | null;
    if (addExpenseSuccess || error) {
      if (addExpenseSuccess) resetButtonClicked();
      timeout = setTimeout(() => {
        dispatch({ type: CLEAN_EXPENSE_STATE });
      }, 6000);
    }
    return () => {
      if (timeout) {
        dispatch({ type: CLEAN_EXPENSE_STATE });
        clearTimeout(timeout);
      }
    };
  }, [addExpenseSuccess, error]);

  const resetButtonClicked = () => {
    setFields({
      values: {
        expenseType: "",
        expenseAmount: "",
        expenseDate: null,
        expenseBillName: "",
        expenseBillFile: null,
      },
      errors: {
        expenseType: "",
        expenseAmount: "",
        expenseDate: "",
      },
    });
  };

  const handleFieldChange = (event: any) => {
    const value = event.target.value;
    switch (event.target.name) {
      case "Expense Type":
        if (value === "") {
          setFields((prevState) => ({
            values: { ...prevState.values, expenseType: value },
            errors: {
              ...prevState.errors,
              expenseType: "Expense type cannot be left blank.",
            },
          }));
        } else {
          setFields((prevState) => ({
            values: { ...prevState.values, expenseType: value },
            errors: {
              ...prevState.errors,
              expenseType: "",
            },
          }));
        }
        break;
      case "Expense Amount":
        if (value === "") {
          setFields((prevState) => ({
            values: {
              ...prevState.values,
              expenseAmount: value,
            },
            errors: {
              ...prevState.errors,
              expenseAmount: "Expense amount cannot be left blank.",
            },
          }));
        } else {
          setFields((prevState) => ({
            values: {
              ...prevState.values,
              expenseAmount: value,
            },
            errors: {
              ...prevState.errors,
              expenseAmount: "",
            },
          }));
        }
        break;
      case "Expense Bill":
        if (event.target.files.length <= 0) {
          setFields((prevState) => ({
            values: {
              ...prevState.values,
              expenseBillName: "",
              expenseBillFile: null,
            },
            errors: prevState.errors,
          }));
        } else {
          setFields((prevState) => ({
            values: {
              ...prevState.values,
              expenseBillName: event.target.files[0].name,
              expenseBillFile: event.target.files,
            },
            errors: prevState.errors,
          }));
        }
    }
  };

  const handleSubmitClicked = () => {
    if (
      fields.values.expenseType === "" ||
      fields.values.expenseAmount === "" ||
      !fields.values.expenseDate
    ) {
      setFields((prevState) => ({
        values: prevState.values,
        errors: {
          expenseType:
            fields.values.expenseType === "" ? "Expense type is required." : "",
          expenseAmount:
            fields.values.expenseAmount === ""
              ? "Expense amount is required."
              : "",
          expenseDate: !fields.values.expenseDate
            ? "Expense date is required."
            : "",
        },
      }));

      return;
    }

    dispatch(
      addExpense(
        {
          expenseAmount: fields.values.expenseAmount,
          expenseDate: fields.values.expenseDate
            ? fields.values.expenseDate.toString()
            : "",
          expenseType: fields.values.expenseType,
          userId: user ? user.id : "",
          expenseBillName:
            fields.values.expenseBillName !== ""
              ? fields.values.expenseBillName
              : "",
        },
        fields.values.expenseBillFile
      )
    );
  };

  return (
    <Container
      sx={{
        mt: 4,
      }}
    >
      <div className="addexpense_heading_container">
        <Typography
          variant="h5"
          sx={{ backgroundColor: "secondary" }}
          color="white"
        >
          Add Expense
        </Typography>
      </div>
      <div className="addexpense_form_container">
        <div className="addexpense_form_fields_container">
          <FormControl sx={{ mt: 3, mb: 3 }} fullWidth size="medium">
            <InputLabel id="expense-type">
              What is this type of expense ?
            </InputLabel>
            <Select
              labelId="expense-type"
              id="expense-type"
              value={fields.values.expenseType}
              label="What is this type of expense ?"
              fullWidth
              variant="outlined"
              color="primary"
              name="Expense Type"
              onChange={handleFieldChange}
              error={fields.errors.expenseType !== ""}
            >
              <MenuItem value={"Entertainment"}>Entertainment</MenuItem>
              <MenuItem value={"Food"}>Food</MenuItem>
              <MenuItem value={"Essentials"}>Essentials</MenuItem>
            </Select>
            {fields.errors.expenseType !== "" && (
              <FormHelperText
                sx={{ m: 0, mt: 1 }}
                id="expense-amount-error-text"
                error={fields.errors.expenseType !== ""}
              >
                {fields.errors.expenseType !== ""
                  ? "Expense type should not be blank"
                  : ""}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth>
            <InputLabel htmlFor="expense-amount">Amount</InputLabel>
            <OutlinedInput
              id="expense-amount"
              value={fields.values.expenseAmount}
              startAdornment={
                <InputAdornment position="start">₹</InputAdornment>
              }
              label="Amount"
              error={
                fields.errors.expenseAmount !== "" ||
                totalNetIncome < +fields.values.expenseAmount
              }
              aria-describedby="expense-amount-error-text"
              name="Expense Amount"
              onChange={handleFieldChange}
            />
            {(fields.errors.expenseAmount !== "" ||
              totalNetIncome < +fields.values.expenseAmount) && (
              <FormHelperText
                sx={{ m: 0, mt: 1 }}
                id="expense-amount-error-text"
                error={
                  fields.errors.expenseAmount !== "" ||
                  totalNetIncome < +fields.values.expenseAmount
                }
              >
                {fields.errors.expenseAmount !== ""
                  ? "Expense amount should not be blank"
                  : "Expense cannot be greater than income."}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mt: 3, mb: 3 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Expense Date"
                value={fields.values.expenseDate}
                onChange={(newValue: Date | null) => {
                  setFields((prevState) => ({
                    values: { ...prevState.values, expenseDate: newValue },
                    errors: { ...prevState.errors, expenseDate: "" },
                  }));
                }}
                renderInput={(params: any) => (
                  <TextField
                    {...params}
                    helperText={
                      fields.errors.expenseDate !== ""
                        ? "Date should be in mm/dd/yyyy format"
                        : ""
                    }
                    FormHelperTextProps={{
                      sx: { m: 0, mt: 1 },
                    }}
                    error={fields.errors.expenseDate !== ""}
                  />
                )}
              />
            </LocalizationProvider>
          </FormControl>
          <FormControl fullWidth>
            <div className="addexpense_upload_bill_container">
              <TextField
                size="small"
                sx={{ flex: 1 }}
                disabled
                value={
                  fields.values.expenseBillFile
                    ? `${fields.values.expenseBillName} will be uploaded.`
                    : "Select bill to upload."
                }
              />
              <label htmlFor="contained-button-file">
                <Input
                  accept="image/*"
                  id="contained-button-file"
                  type="file"
                  name="Expense Bill"
                  onChange={handleFieldChange}
                />
                <Button
                  variant="contained"
                  startIcon={<PhotoCamera />}
                  component="span"
                  sx={{ ml: 1, mr: 1 }}
                >
                  Upload
                </Button>
              </label>
              <Button
                variant="contained"
                startIcon={<DeleteIcon />}
                color="error"
                onClick={() => {
                  setFields((prevState) => ({
                    values: {
                      ...prevState.values,
                      expenseBillName: "",
                      expenseBillFile: null,
                    },
                    errors: prevState.errors,
                  }));
                }}
              >
                Remove
              </Button>
            </div>
          </FormControl>
        </div>
        {fields.values.expenseBillFile && (
          <LinearProgressComp progress={progress} />
        )}
        {addExpenseSuccess && (
          <div>
            <Alert sx={{ mt: 3 }} severity="success">
              Expense added successfully.
            </Alert>
          </div>
        )}

        {error && (
          <div>
            <Alert sx={{ mt: 3 }} severity="error">
              {error.message}
            </Alert>
          </div>
        )}

        <div className="addexpense_button_container">
          <FormControl fullWidth sx={{ mt: 3, mb: 3 }}>
            <LoadingButton
              loading={loading}
              variant="contained"
              onClick={handleSubmitClicked}
            >
              Submit Expense
            </LoadingButton>
          </FormControl>
          <FormControl fullWidth>
            <Button
              color="error"
              variant="contained"
              onClick={resetButtonClicked}
            >
              Reset
            </Button>
          </FormControl>
        </div>
      </div>
    </Container>
  );
};

export default AddExpense;
