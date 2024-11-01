import styled from "styled-components";
import { StyledContainer } from "../pages/Signup";
import { useGroupStore } from "../store/useGroupStore";
import OverlayWrapper from "./shared/OverlayWrapper";
import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useExpenseStore } from "../store/useExpenseStore";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "../supabaseClient";

const ExpenseList = () => {
	const { groupName, startDate, endDate, setGroupName, setStartDate, setEndDate } = useGroupStore();
	const { expenses, setExpenses } = useExpenseStore();
	const { groupId } = useParams();

	useEffect(() => {
		const fetchGroupInfo = async () => {
			if (groupId) {
				const { data, error } = await supabase
					.from("groups")
					.select("group_name, start_date, end_date, tags")
					.eq("id", groupId)
					.single();

				if (error) {
					console.error("그룹 정보를 가져오는 중 오류가 발생했습니다:", error.message);
					return;
				}

				if (data) {
					setGroupName(data.group_name);
					setStartDate(data.start_date);
					setEndDate(data.end_date);
				}
			}
		};

		const fetchExpenses = async () => {
			if (groupId) {
				const { data, error } = await supabase
					.from("expenses")
					.select("*")
					.eq("group_id", groupId);

				if (error) {
					console.error("비용 정보를 가져오는 중 오류가 발생했습니다:", error.message);
					return;
				}

				if (data) {
					setExpenses(data);
				}
			}
		};

		fetchGroupInfo();
		fetchExpenses();
	}, [groupId, setGroupName, setStartDate, setEndDate, setExpenses]);

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
						<Table data-testid="expenseList">
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
