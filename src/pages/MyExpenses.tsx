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
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { getAllExpenses } from "../store/actions/expense";
import { useAppSelector } from "../store/store";
import Loading from "../components/Loading";
import Error from "../components/Error";
import { ExpenseRes } from "../types/types";
import BillCard from "../components/BillCard";

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

interface IMyExpensesProps {
  billsPage?: boolean;
}

const MyExpenses: React.FC<IMyExpensesProps> = ({ billsPage }) => {
  const dispatch: Dispatch<any> = useDispatch();
  const { loading, error, expenses } = useAppSelector((state) => state.expense);
  const { user } = useAppSelector((state) => state.auth);
  console.log(billsPage);
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

  const totalAmount = filteredExpenses.reduce(
    (totalValue, currValue) => totalValue + +currValue.expenseAmount,
    0
  );

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
        <FormControl sx={{ mb: 2, minWidth: 230 }} size="small">
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
      {billsPage && (
        <Grid container spacing={2} sx={{ p: 3 }}>
          {filteredExpenses.filter((el) => el.expenseBillName !== "").length <=
          0 ? (
            <Error
              message={"No bills uploaded for this month"}
              severity="info"
            />
          ) : (
            filteredExpenses.map((expense) => (
              <BillCard expense={expense} key={expense._id} />
            ))
          )}
        </Grid>
      )}

      {!billsPage &&
        (filteredExpenses.length <= 0 ? (
          <Error message={"No expenses added in this month"} severity="info" />
        ) : (
          <>
            <Paper sx={{ mb: 2, p: 2 }}>
              <Typography sx={{ fontWeight: "bold" }}>
                Total: ₹{totalAmount}
              </Typography>
              <Typography sx={{ fontWeight: "bold" }}>
                Percentage in income:{" "}
                {((totalAmount * 100) / +user.netIncome).toFixed(2)} %
              </Typography>
            </Paper>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Expense</StyledTableCell>
                    <StyledTableCell align="right">Amount</StyledTableCell>
                    <StyledTableCell align="right">
                      Percentage in income
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      Bill uploaded
                    </StyledTableCell>
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
                        ₹{expense.expenseAmount}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {+expense.percentageOfIncome}%
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
          </>
        ))}
    </Container>
  );
};

export default MyExpenses;
