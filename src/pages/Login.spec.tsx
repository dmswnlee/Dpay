import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import Login from "./Login";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "./Home";
import Signup from "./Signup";

const LocationDisplay = () => {
	const location = useLocation();
	return <div data-testid="location-display">{location.pathname}</div>;
};

const renderComponent = () => {
	render(
		<MemoryRouter initialEntries={["/login"]}>
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route path="/" element={<Home />} />
				<Route path="/signup" element={<Signup />} />
			</Routes>
			<LocationDisplay />
		</MemoryRouter>,
	);

	const idInput = screen.getByLabelText(/아이디/i);
	const passwordInput = screen.getByLabelText(/비밀번호/i);
	const loginButton = screen.getByRole("button", { name: /로그인/i });
	const signupButton = screen.getByRole("button", { name: /아직 회원가입 전 이신가요/i });

	return {
		idInput,
		passwordInput,
		loginButton,
		signupButton,
	};
};

describe("login", () => {
	test("아이디, 비밀번호 입력 후 로그인 버튼 클릭 시 로그인이 된다.", async () => {
		const { idInput, passwordInput, loginButton } = renderComponent();

		userEvent.type(idInput, "test123@gmail.com");
		userEvent.type(passwordInput, "password123");
		userEvent.click(loginButton);

		// TODO: 로그인 성공 시 테스트
		await waitFor(() => {
			expect(screen.getByTestId("location-display").textContent).toBe("/");
		});
	});

	test("인풋요소 중 하나라도 빈 인풋이 있는 경우 오류 메세지가 표시되어야 한다.", async () => {
		const { loginButton } = renderComponent();

		userEvent.click(loginButton);

		const idError = await screen.findByText(/아이디를 입력해주세요/i);
		const passwordError = await screen.findByText(/비밀번호를 입력해주세요/i);

		expect(idError).toBeInTheDocument();
		expect(passwordError).toBeInTheDocument();
	});

	test("회원가입 전이라면 회원가입 버튼 클릭 시 회원가입 페이지로 이동", async () => {
		const { signupButton } = renderComponent();

		userEvent.click(signupButton);

		// TODO: 회원가입 페이지로 이동하는지 테스트
		await waitFor(() => {
			expect(screen.getByTestId("signup-page")).toBeInTheDocument();
		});
	});
});
