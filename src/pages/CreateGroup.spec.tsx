import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CreateGroup from "./CreateGroup";
import userEvent from "@testing-library/user-event";

const renderComponent = () => {
	render(
		<MemoryRouter>
			<CreateGroup />
		</MemoryRouter>,
	);

	const groupNameInput = screen.getByLabelText(/당신의 모임 이름은 무엇인가요/i);
	const memberInput = screen.getByLabelText(/모임의 멤버를 입력해주세요/i);
	const dateInput = screen.getByLabelText(/모임 날짜를 입력해주세요/i);
	const createButton = screen.getByRole("button", { name: /생성하기/i });

	const groupNameErrorMessage = screen.getByText(/그룹 이름을 입력해 주세요/i);
	const memberErrorMessage = screen.getByText(/모임 멤버를 입력해 주세요/i);
	const dateErrorMessage = screen.getByText(/모임 날짜를 입력해 주세요/i);

	return {
		groupNameInput,
		memberInput,
		dateInput,
		createButton,
		groupNameErrorMessage,
		memberErrorMessage,
		dateErrorMessage,
	};
};

describe("CreateGroup", () => {
	test("모든 인풋과 버튼이 올바르게 렌더링 되는가", () => {
		const { groupNameInput, memberInput, dateInput, createButton } = renderComponent();

		expect(groupNameInput).toBeInTheDocument();
		expect(memberInput).toBeInTheDocument();
		expect(dateInput).toBeInTheDocument();
		expect(createButton).toBeInTheDocument();
	});

	test("필수 입력 인풋이 비어있을 때 '생성하기' 버튼을 클릭하면 오류 메세지를 보여준다.", async () => {
		const { createButton, groupNameErrorMessage, memberErrorMessage, dateErrorMessage } = renderComponent();

		await userEvent.click(createButton);

		expect(groupNameErrorMessage).toBeInTheDocument();
		expect(memberErrorMessage).toBeInTheDocument();
		expect(dateErrorMessage).toBeInTheDocument();
	});

	test("유효한 입력을 한 후 그룹이 성공적으로 생성된다.", async () => {
		const {
			groupNameInput,
			memberInput,
			dateInput,
			createButton,
			groupNameErrorMessage,
			memberErrorMessage,
			dateErrorMessage,
		} = renderComponent();

		await userEvent.type(groupNameInput, "노른자들의 여행");
		await userEvent.type(memberInput, "은주, 토토, 미미");
		await userEvent.type(dateInput, "2024-10-24");
		await userEvent.click(createButton);

		expect(groupNameErrorMessage).not.toBeInTheDocument();
		expect(memberErrorMessage).not.toBeInTheDocument();
		expect(dateErrorMessage).not.toBeInTheDocument();
	});
});
