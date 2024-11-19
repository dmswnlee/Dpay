import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "./Home";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

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

describe("Home", () => {
	test("그룹 생성하기 버튼 클릭 시 그룹 생성 페이지로 이동", () => {
		const { addButton } = renderComponent();

		userEvent.click(addButton);
	});

	test("생성된 그룹 목록이 렌더링 되는가", () => {
		renderComponent();

		const groupContainer = screen.getByTestId("group-container");
    expect(groupContainer).toBeInTheDocument();
	})
});
