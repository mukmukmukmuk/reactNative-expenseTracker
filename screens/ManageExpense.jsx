import { useLayoutEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import IconButton from "../components/ExpensesOutput/UI/IconButton";
import { GlobalStyles } from "../constans/styles";
import { useContext } from "react";
import { ExpensesContext } from "../store/expenses-context";
import ExpenseForm from "./../components/ExpensesOutput/ManageExpense/ExpenseForm";
import { deleteExpense, storeExpense, updateExpense } from "../util/http";
import LoadingOverlay from "../components/ExpensesOutput/UI/LoadingOverlay";
export default function ManageExpense({ route, navigation }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const expensesCtx = useContext(ExpensesContext);
  const editedExpenseId = route.params?.expenseId;
  const isEditing = !!editedExpenseId;
  const selectedExpense = expensesCtx.expenses.find(
    (expense) => expense.id === editedExpenseId
  );
  const [error, setError] = useState();
  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? "Edit Expense" : "Add Expense",
    });
  }, [navigation, isEditing]);
  const deleteExpenseHandler = async () => {
    setIsSubmitting(true);
    try {
      await deleteExpense(editedExpenseId);
      expensesCtx.deleteExpense(editedExpenseId);
      navigation.goBack();
    } catch (error) {
      setError("Could not delete expense - please try again later!");
    }
    setIsSubmitting(false);
  };
  const cancelHandler = () => {
    navigation.goBack();
  };
  const confirmHandler = async (expenseData) => {
    setIsSubmitting(true);
    try {
      if (isEditing) {
        expensesCtx.updateExpense(editedExpenseId, expenseData);
        await updateExpense(editedExpenseId, expenseData);
        //setIsSubmitting(false);
      } else {
        const id = await storeExpense(expenseData);
        //setIsSubmitting(false);
        expensesCtx.addExpense({ id: id, ...expenseData });
      }
      navigation.goBack();
    } catch (error) {
      setError("Could not save data - please try again later!");
    }
    setIsSubmitting(false);
  };

  if (error && !isFetching) return <ErrorOverlay message={error} />;

  if (isSubmitting) return <LoadingOverlay />;
  return (
    <View style={styles.container}>
      <ExpenseForm
        submitButtonLable={isEditing ? "Update" : "Add"}
        onCancle={cancelHandler}
        onSubmit={confirmHandler}
        defaultValues={selectedExpense}
      />
      {isEditing && (
        <View style={styles.deleteContainer}>
          <IconButton
            icon="trash"
            color={GlobalStyles.colors.error500}
            size={36}
            onPress={deleteExpenseHandler}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: GlobalStyles.colors.primary800,
  },

  deleteContainer: {
    marginTop: 16,
    paddingTop: 8,
    borderTopColor: GlobalStyles.colors.primary200,
    borderTopWidth: 2,
    alignItems: "center",
  },
});
