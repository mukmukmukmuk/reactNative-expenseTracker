import axios from "axios";

const BACKEND_URL =
  "https://reactnative-expensetrack-af8e9-default-rtdb.asia-southeast1.firebasedatabase.app/";

export const storeExpense = (expenseData) => {
  axios.post(BACKEND_URL + "/expenses.json", expenseData);
};

export const fetchExpenses = async () => {
  const response = await axios.get(BACKEND_URL + "/expenses.json");
  const expenses = [];

  console.log(response.data);
  for (const key in response.data) {
    const expenseObj = {
      id: key,
      amount: response.data[key].amount,
      date: new Date(response.data[key].date),
      description: response.data[key].description,
    };
    expenses.push(expenseObj);
  }
  return expenses;
};
