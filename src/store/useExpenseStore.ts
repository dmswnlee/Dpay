import { create } from "zustand";

interface Expense {
	date: string;
	desc: string;
	memo: string;
	amount: number;
	member: string;
}

interface ExpenseState {
	expenses: Expense[];
	addExpense: (expense: Expense) => void;
	setExpenses: (expenses: Expense[]) => void;
}

export const useExpenseStore = create<ExpenseState>(set => ({
	expenses: [],
	addExpense: expense => set(state => ({ expenses: [...state.expenses, expense] })),
	setExpenses: expenses => set({ expenses }),
}));
