import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ExpenseMain from "./ExpenseMain";
import userEvent from "@testing-library/user-event";

const renderComponent = () => {
	render(
		<MemoryRouter>
			<ExpenseMain />
		</MemoryRouter>,
	);

	const dateInput = screen.getByPlaceholderText(/날짜를 입력해주세요/i);
	const descInput = screen.getByPlaceholderText(/비용에 대한 설명을 입력해주세요/i);
	const memoInput = screen.getByPlaceholderText(/메모를 입력해주세요/i);
	const amountInput = screen.getByPlaceholderText(/비용을 입력해주세요/i);
	const payerInput = screen.getByDisplayValue(/누가 결제했나요/i);
	const addButton = screen.getByText("추가하기");

	const descErrorMessage = screen.getByText("비용 내용을 입력해주세요.");
	const amountErrorMessage = screen.getByText("결제자를 선택해주세요.");
	const payerErrorMessage = screen.getByText("1원 이상의 금액을 입력해주세요.");

	return {
		dateInput,
		descInput,
		memoInput,
		amountInput,
		payerInput,
		addButton,
		descErrorMessage,
		amountErrorMessage,
		payerErrorMessage,
	};
};

describe("ExpenseMain", () => {
	describe("AddExpenseForm", () => {
		test("비용 추가 컴포넌트가 렌더링 되는가", () => {
			const { dateInput, descInput, memoInput, amountInput, payerInput, addButton } = renderComponent();

			expect(dateInput).toBeInTheDocument();
			expect(descInput).toBeInTheDocument();
			expect(memoInput).toBeInTheDocument();
			expect(amountInput).toBeInTheDocument();
			expect(payerInput).toBeInTheDocument();
			expect(addButton).toBeInTheDocument();
		});

		test("비용 추가에 필수적인 값들을 입력하지 않고 '추가하기' 버튼 클릭 시, 에러 메세지를 노출한다.", async () => {
			const { addButton, descErrorMessage, amountErrorMessage, payerErrorMessage } = renderComponent();

			expect(addButton).toBeInTheDocument();
			await userEvent.click(addButton);

			expect(descErrorMessage).toBeInTheDocument();
			expect(amountErrorMessage).toBeInTheDocument();
			expect(payerErrorMessage).toBeInTheDocument();
		});

		test("비용 추가에 값들을 입력한 후 '추가하기' 버튼 클릭 시, 저장에 성공한다.", async () => {
			const {
				descInput,
				amountInput,
				payerInput,
				addButton,
				descErrorMessage,
				payerErrorMessage,
				amountErrorMessage,
			} = renderComponent();

			await userEvent.type(descInput, "음료수 사먹음");
			await userEvent.type(amountInput, "26000");
			await userEvent.selectOptions(payerInput, "은주");
			await userEvent.click(addButton);

			expect(descErrorMessage).not.toBeInTheDocument();
			expect(amountErrorMessage).not.toBeInTheDocument();
			expect(payerErrorMessage).not.toBeInTheDocument();
		});
	});

	describe("ExpenseList", () => {
		test("비용 리스트 컴포넌트가 렌더링 되는가", () => {
			renderComponent();

			const expenseListComponent = screen.getByTestId("expenseList");
			expect(expenseListComponent).toBeInTheDocument();
		});
	});
});
