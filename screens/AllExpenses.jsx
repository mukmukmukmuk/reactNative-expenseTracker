import { View, StyleSheet, Text } from "react-native";
import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";

export default function AllExpenses() {
  return <ExpensesOutput expensesPeriod="Total" />;
}

const styles = StyleSheet.create({});
