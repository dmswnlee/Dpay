import { create } from "zustand";

interface Expense {
	id: number;
	date: string;
	desc: string;
	memo: string;
	amount: number;
	member: string;
}

interface ExpenseState {
	expenses: Expense[];
	addExpense: (expense: Expense) => void;
	setExpenses: (expensesOrUpdater: Expense[] | ((prev: Expense[]) => Expense[])) => void;
}

export const useExpenseStore = create<ExpenseState>(set => ({
	expenses: [],
	addExpense: expense => set(state => ({ expenses: [...state.expenses, expense] })),
	setExpenses: (expensesUpdater) =>
		set((state) => ({
			expenses:
				typeof expensesUpdater === "function"
					? expensesUpdater(state.expenses)
					: expensesUpdater,
		})),
}));
