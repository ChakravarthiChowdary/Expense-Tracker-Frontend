import React, { Dispatch, useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { getAllExpenses } from "../store/actions/expense";
import { useAppSelector } from "../store/store";
import Loading from "../components/Loading";
import Error from "../components/Error";
import { ExpenseRes } from "../types/types";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function MyExpenses() {
  const dispatch: Dispatch<any> = useDispatch();
  const { loading, error, expenses } = useAppSelector((state) => state.expense);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentMonth = new Date().getMonth();
  const [month, setMonth] = useState(months[currentMonth]);
  const [filteredExpenses, setFilteredExpenses] =
    useState<ExpenseRes[]>(expenses);

  useEffect(() => {
    dispatch(getAllExpenses());
  }, []);

  useEffect(() => {
    setFilteredExpenses(expenses);
  }, [expenses.length]);

  useEffect(() => {
    const index = months.findIndex((el) => el === month);
    setFilteredExpenses((prevState: ExpenseRes[]) =>
      expenses.filter((expense: ExpenseRes) => {
        return (
          months[index] === months[new Date(expense.expenseDate).getMonth()]
        );
      })
    );
  }, [month, expenses.length]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Error
        message={error.message}
        severity="error"
        retryHandleClick={() => dispatch(getAllExpenses())}
      />
    );
  }

  const getExpenseDate = (expenseDate: string) => {
    const date = new Date(expenseDate);
    return `
    ${date.toLocaleString("default", {
      month: "long",
    })} ${date.getDate()}, ${date.getFullYear()}`;
  };

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "80vh",
        mt: 4,
      }}
    >
      <div>
        <FormControl sx={{ mb: 4, minWidth: 230 }} size="small">
          <InputLabel id="month-select-label">Month</InputLabel>
          <Select
            labelId="month-select-label"
            id="month-select-label"
            value={month}
            label="Month"
            onChange={(e) => setMonth(e.target.value)}
          >
            <MenuItem
              value={months[currentMonth]}
            >{`Current Month (${months[currentMonth]})`}</MenuItem>
            <MenuItem value={months[currentMonth - 1]}>{`Previous Month (${
              months[currentMonth - 1]
            })`}</MenuItem>
            {months
              .slice(0, currentMonth - 1)
              .reverse()
              .map((month) => (
                <MenuItem key={month} value={month}>
                  {month}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </div>

      {filteredExpenses.length <= 0 ? (
        <Error message={"No expenses added in this month"} severity="info" />
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Expense</StyledTableCell>
                <StyledTableCell align="right">Amount</StyledTableCell>
                <StyledTableCell align="right">
                  Percentage in income
                </StyledTableCell>
                <StyledTableCell align="right">Bill uploaded</StyledTableCell>
                <StyledTableCell align="right">Date</StyledTableCell>
                <StyledTableCell align="right">Bill Link</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredExpenses.map((expense: ExpenseRes) => (
                <StyledTableRow key={expense._id}>
                  <StyledTableCell component="th" scope="row">
                    {expense.expenseType}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {expense.expenseAmount}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {+expense.percentageOfIncome}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {expense.expenseBillName !== "" ? "Yes" : "No"}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {getExpenseDate(expense.expenseDate)}
                  </StyledTableCell>
                  {expense.expenseBillPath !== "" ? (
                    <StyledTableCell align="right">
                      <a href={expense.expenseBillPath} target="_blank">
                        {expense.expenseBillName}
                      </a>
                    </StyledTableCell>
                  ) : (
                    <StyledTableCell align="right">NA</StyledTableCell>
                  )}
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}
