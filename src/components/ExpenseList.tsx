import styled from "styled-components";
import { StyledContainer } from "../pages/Signup";
import { useGroupStore } from "../store/useGroupStore";
import OverlayWrapper from "./shared/OverlayWrapper";
import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useExpenseStore } from "../store/useExpenseStore";

const ExpenseList = () => {
	const { groupName, startDate, endDate } = useGroupStore();
	const { expenses } = useExpenseStore();

	return (
		<StyledContainer>
			<OverlayWrapper width="75vh" minHeight="100vh">
				<StyledGroupDataWrapper>
					<StyledGroupName>{groupName}</StyledGroupName>
					<StyledGroupDate>
						({startDate} ~ {endDate})
					</StyledGroupDate>
				</StyledGroupDataWrapper>
				<StyledTable>
					<TableContainer>
						<Table>
							<Thead>
								<Tr>
									<StyledTh>날짜</StyledTh>
									<StyledTh>내용</StyledTh>
									<StyledTh>결제자</StyledTh>
									<StyledTh>금액</StyledTh>
									<StyledTh>메모</StyledTh>
								</Tr>
							</Thead>
							<Tbody>
								{expenses.map((expense, index) => (
									<Tr key={index}>
										<StyledTd>{expense.date}</StyledTd>
										<StyledTd>{expense.desc}</StyledTd>
										<StyledTd>{expense.member}</StyledTd>
										<StyledTd>{expense.amount}</StyledTd>
										<StyledTd>{expense.memo}</StyledTd>
									</Tr>
								))}
							</Tbody>
						</Table>
					</TableContainer>
				</StyledTable>
			</OverlayWrapper>
		</StyledContainer>
	);
};

export default ExpenseList;

const StyledGroupDataWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 10px;
`;

const StyledGroupName = styled.p`
	margin: 0;
	font-size: 24px;
`;

const StyledGroupDate = styled.p`
	margin: 0;
	font-size: 16px;
`;

const StyledTable = styled.div`
	margin-top: 20px;
`;

const StyledTh = styled(Th)`
	text-align: center !important;
`;

const StyledTd = styled(Td)`
	text-align: center !important;
`;
