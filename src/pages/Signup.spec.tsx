import '@testing-library/jest-dom';
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Signup from "./Signup";
import { MemoryRouter } from "react-router-dom";

const renderComponent = () => {
	render(
		<MemoryRouter>
			<Signup />
		</MemoryRouter>,
	);

	const nameInput = screen.getByLabelText(/이름/i);
	const idInput = screen.getByLabelText(/아이디/i);
	const passwordInput = screen.getByLabelText(/비밀번호/i);
	const signupButton = screen.getByRole("button", { name: /가입하기/i });

	return {
		nameInput,
		idInput,
		passwordInput,
		signupButton,
	};
};

// TODO: 각각 테스트하면 성공하고 한꺼번에 하면 실패하는 이유가 무엇인가
describe("Signup", () => {
	test("이름, 아이디, 비밀번호 입력 후 가입하기 버튼 클릭 시 폼이 제출된다.", async () => {
		const { nameInput, idInput, passwordInput, signupButton } = renderComponent();

		userEvent.type(nameInput, "이은주");
		userEvent.type(idInput, "test123@gmail.com");
		userEvent.type(passwordInput, "password123");
		userEvent.click(signupButton);

		// TODO: 폼 제출 성공 시 모달 테스트
		// const sucessMessage = screen.getByText(/회원가입이 완료되었습니다/i);
		// expect(sucessMessage).toBeInTheDocument();
		// const AlertDialog = await screen.findByRole("alertdialog");
		// expect(AlertDialog).toBeInTheDocument();
	});

	test("인풋요소 중 하나라도 빈 인풋이 있는채로 제출 시 오류 메시지가 표시되어야 한다.", async () => {
		const { signupButton } = renderComponent();

		userEvent.click(signupButton);

		const nameError = await screen.findByText(/이름을 입력해주세요/i);
		const idError = await screen.findByText(/아이디를 입력해주세요/i);
		const passwordError = await screen.findByText(/비밀번호를 입력해주세요/i);

		expect(nameError).toBeInTheDocument();
		expect(idError).toBeInTheDocument();
		expect(passwordError).toBeInTheDocument();
	});
});
