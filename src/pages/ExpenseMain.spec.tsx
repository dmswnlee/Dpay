import "@testing-library/jest-dom";
import { render, screen, waitFor, within } from "@testing-library/react";
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

	describe("SettlementSummary", () => {
		test("정산 결과 컴포넌트가 렌더링 되는가", () => {
			renderComponent();

			const component = screen.getByText(/정산 결과/i);
			expect(component).toBeInTheDocument();
		});
	});

	describe("새로운 비용이 입력 되었을 때", () => {
		const addNewExpense = async () => {
			const { dateInput, descInput, payerInput, amountInput, addButton } = renderComponent();
			await userEvent.type(dateInput, "2024-11-01");
			await userEvent.type(descInput, "장보기");
			await userEvent.type(amountInput, "34000");
			await userEvent.selectOptions(payerInput, "은주");
			await userEvent.click(addButton);
		};

		beforeEach(async () => {
			await addNewExpense();
		});

		test("날짜, 내용, 결제자, 금액 데이터가 정산 리스트에 추가 된다.", () => {
			const expenseListComponent = screen.getByTestId("expenseList");

			const dateValue = within(expenseListComponent).getByText("2024-11-01");
			expect(dateValue).toBeInTheDocument();

			const descValue = within(expenseListComponent).getByText("장보기");
			expect(descValue).toBeInTheDocument();

			const payerValue = within(expenseListComponent).getByText("은주");
			expect(payerValue).toBeInTheDocument();

			const amountValue = within(expenseListComponent).getByText("34000원");
			expect(amountValue).toBeInTheDocument();
		});

		test("정산 결과 또한 업데이트가 된다.", () => {
			const totalText = screen.getByText(/2 명이서 총 30000 원 지출/i);
			expect(totalText).toBeInTheDocument();

			const transactionText = screen.getByText(/영희가 영수에게 15000원 보내기/i);
			expect(transactionText).toBeInTheDocument();
		});

		const htmlToImage = require("html-to-image");

		test("정산 결과를 이미지 파일로 저장할 수 있다.", async () => {
			const spiedToPng = jest.spyOn(htmlToImage, "toPng");

			const downloadBtn = screen.getByTestId("btn-download");
			await waitFor(() => {
				expect(downloadBtn).toBeInTheDocument();
			});

			userEvent.click(downloadBtn);
			await waitFor(() => {
				expect(spiedToPng).toHaveBeenCalledTimes(1);
			});
		});
	});
});
