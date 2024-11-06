import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MyPage from "./MyPage";
import "@testing-library/jest-dom";

const renderComponent = () => {
	render(
		<MemoryRouter>
			<MyPage />
		</MemoryRouter>,
	);
};

describe("MyPage", () => {
	test("마이페이지 컴포넌트가 렌더링 되는가", () => {
		renderComponent();

		const mypageContainer = screen.getByTestId("maypage-container");
		expect(mypageContainer).toBeInTheDocument();
	});
});
