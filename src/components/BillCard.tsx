import * as React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea, Grid } from "@mui/material";

import { ExpenseRes } from "../types/types";

interface IBillCardProps {
  expense: ExpenseRes;
}

const BillCard: React.FC<IBillCardProps> = ({ expense }) => {
  if (expense.expenseBillName === "") {
    return null;
  }
  return (
    <Grid item xs={12} sm={6} md={3}>
      <Card sx={{ maxWidth: 400 }}>
        <CardActionArea>
          <CardMedia
            component="img"
            height="400"
            image={expense.expenseBillPath}
            alt={expense.expenseBillName}
          />
        </CardActionArea>
      </Card>
    </Grid>
  );
};

export default BillCard;
