export interface Expense {
	date?: string;
	desc?: string;
	amount: number;
	member: string;
}

export interface Transaction {
	receiver: string;
	sender: string;
	amount: number;
}

export interface AddExpenseData {
	id: number;
	date: string;
	desc: string;
	memo: string;
	amount: number;
	member: string;
}