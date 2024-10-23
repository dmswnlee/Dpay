import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "./Home";
import userEvent from "@testing-library/user-event";

const renderComponent = () => {
	render(
		<MemoryRouter>
			<Home />
		</MemoryRouter>,
	);

	const addButton = screen.getByRole("button", { name: /그룹 생성하기/i });

	return {
		addButton,
	};
};

// TODO: import.meta.env 테스트 환경 오류 해결
describe("Home", () => {
	test("그룹 생성하기 버튼 클릭 시 그룹 생성 페이지로 이동", () => {
		const { addButton } = renderComponent();

		userEvent.click(addButton);
	});
});
