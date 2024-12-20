import styled from "styled-components";
import { useGroupStore } from "../store/useGroupStore";
import OverlayWrapper from "./shared/OverlayWrapper";
import { Table, TableContainer, Tbody, Td, Th, Thead, Tr, useBreakpointValue } from "@chakra-ui/react";
import { useExpenseStore } from "../store/useExpenseStore";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "../supabaseClient";
import { StyledButtonGroup, StyledButtonWrapper } from "../pages/MyPage";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useResponsiveOverlay } from '../hooks/useResponsiveOverlay';
import { FormatNumber } from './shared/FormatNumber';

const ExpenseList = () => {
	const { groupName, startDate, endDate, setGroupName, setStartDate, setEndDate } = useGroupStore();
	const { expenses, setExpenses } = useExpenseStore();
	const { groupId } = useParams();
	const { overlayWidth, overlayHeight } = useResponsiveOverlay(
		{ base: "90vw", lg: "75vh" }, 
    { base: "100%", md: "50vh", lg: "100vh" } 
  );
	const tableSize = useBreakpointValue({ base: "sm", md: "md", lg: "lg" });

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

	const handleDelete = async (expenseId: number) => {
		const { error } = await supabase
			.from("expenses")
			.delete()
			.eq("id", expenseId);
	
		if (error) {
			console.error("입력된 비용을 삭제하는 중 오류가 발생했습니다.", error.message);
			return;
		}

		setExpenses((prevExpenses) => prevExpenses.filter(expense => expense.id !== expenseId));
	};

	return (
		<OverlayWrapper width={overlayWidth} minHeight={overlayHeight}>
			<StyledTableWrapper>
				<StyledGroupDataWrapper>
					<StyledGroupName>{groupName}</StyledGroupName>
					<StyledGroupDate>
						({startDate} ~ {endDate})
					</StyledGroupDate>
				</StyledGroupDataWrapper>
				<StyledTable>
					<StyledTableContainer>
						<Table data-testid="expenseList" size={tableSize}>
							<Thead>
								<Tr>
									<StyledTh>날짜</StyledTh>
									<StyledTh>내용</StyledTh>
									<StyledTh>결제자</StyledTh>
									<StyledTh>금액</StyledTh>
									<StyledTh>메모</StyledTh>
									<StyledTh></StyledTh>
								</Tr>
							</Thead>
							<Tbody>
								{expenses.map((expense) => (
									<Tr key={expense.id}>
										<StyledTd>{expense.date}</StyledTd>
										<StyledTd>{expense.desc}</StyledTd>
										<StyledTd>{expense.member}</StyledTd>
										<StyledTd>{FormatNumber(expense.amount)}</StyledTd>
										<StyledTd>{expense.memo}</StyledTd>
										<StyledTd>
											<StyledButtonGroup>
												<StyledButtonWrapper onClick={() => handleDelete(expense.id)}>
													<RiDeleteBin5Line />
												</StyledButtonWrapper>
											</StyledButtonGroup>
										</StyledTd>
									</Tr>
								))}
							</Tbody>
						</Table>
					</StyledTableContainer>
				</StyledTable>
			</StyledTableWrapper>
		</OverlayWrapper>
	);
};

export default ExpenseList;

const StyledTableWrapper = styled.div`
	padding: 20px;

	@media (min-width: 1024px) {
		padding: 60px;
	}
`;

const StyledGroupDataWrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 10px;
`;

const StyledGroupName = styled.p`
	font-size: 20px;

	@media (min-width: 1024px) {
		font-size: 24px;
	}
`;

const StyledGroupDate = styled.p`
	font-size: 12px;

	@media (min-width: 1024px) {
		font-size: 16px;
	}
`;

const StyledTableContainer = styled(TableContainer)`
	overflow-x: auto;
	width: 100%;
	max-width: 100%;
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
