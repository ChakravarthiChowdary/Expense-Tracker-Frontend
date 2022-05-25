export interface ExpenseBody {
  expenseType: string;
  expenseAmount: string;
  expenseDate: string;
  userId: string;
  expenseBillName: string;
}

export interface ExpenseRes {
  expenseType: string;
  expenseAmount: string;
  expenseDate: string;
  userId: string;
  percentageOfIncome: string;
  expenseBillName: string;
  _id: string;
  expenseBillPath: string;
}
