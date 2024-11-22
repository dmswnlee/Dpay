import styled from "styled-components";
import { FiPlus } from "react-icons/fi";
import CardOverlay from "../components/shared/CardOverlay";
import useAuthStore from "../store/authStore";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Button,
} from "@chakra-ui/react";
import { supabase } from "../supabaseClient";
import { FaRegCalendarAlt, FaMoneyBill } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { format } from "date-fns";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import { Group } from '../types/group';
import { Expense } from '../types/expense';

const Home = () => {
	const { session, initializeSession, isSessionInitialized } = useAuthStore();
	const [isOpen, setIsOpen] = useState(false);
	const [groups, setGroups] = useState<Group[]>([]);
	const [expenses, setExpenses] = useState<Record<string, Expense[]>>({});
	const [isLoading, setIsLoading] = useState(true);
	const cancelRef = useRef(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchUserSessionAndGroups = async () => {
			setIsLoading(true);

			if (!isSessionInitialized) {
				await initializeSession();
			}

			if (session) {
				await fetchGroups(session.user.id);
			} else {
				setGroups([]);
				setExpenses({});
			}
			setIsLoading(false);
		};

		if (isSessionInitialized) {
			fetchUserSessionAndGroups();
		}
	}, [session, isSessionInitialized]);

	const fetchGroups = async (userId: string) => {
		const { data, error } = await supabase
			.from("groups")
			.select("id, group_name, start_date, end_date, tags")
			.eq("created_by", userId);

		if (error) {
			console.error("그룹을 불러오는 중 오류가 발생했습니다:", error.message);
			return;
		}
		setGroups(data || []);

		await Promise.all(data.map(group => fetchExpensesForGroup(group.id)));
	};

	const fetchExpensesForGroup = async (groupId: string) => {
		const { data, error } = await supabase
			.from("expenses")
			.select("date, desc, amount, member")
			.eq("group_id", groupId);

		if (error) {
			console.error("데이터를 불러오는 중 오류가 발생했습니다:", error.message);
			return;
		}

		setExpenses(prevExpenses => ({
			...prevExpenses,
			[groupId]: data || [],
		}));
	};

	const onOpen = () => setIsOpen(true);
	const onClose = () => {
		setIsOpen(false);
		navigate("/login");
	};

	const handleAddGroup = () => {
		if (!session) {
			onOpen();
		} else {
			navigate("/create");
		}
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return format(date, "yy.MM.dd");
	};

	if (isLoading) {
		return <LoadingSpinner />;
	}

	return (
		<StyledHomeContainer data-testid="group-container">
			<StyledHomeWrapper>
				<CardOverlay onClick={handleAddGroup}>
					<FiPlus />
					<StyledAddButton>그룹 생성하기</StyledAddButton>
				</CardOverlay>

				{groups.map(group => (
					<CardOverlay key={group.id} onClick={() => navigate(`/expense/${group.id}`)}>
						<StyledContentWrapper>
							<StyledTitle>{group.group_name}</StyledTitle>
							<StyledDivider></StyledDivider>
							<StyledContent>
								<FaRegCalendarAlt />
								<p>모임 날짜 : {`${formatDate(group.start_date)} ~ ${formatDate(group.end_date)}`}</p>
							</StyledContent>
							<StyledContent>
								<FaUserGroup />
								<StyledMemberList>모임 멤버 : {group.tags.join(", ")}</StyledMemberList>
							</StyledContent>
							<StyledExpenseContainer>
								<StyledExpenseTitle>
									<FaMoneyBill />
									<p>정산 내역</p>
								</StyledExpenseTitle>
								{expenses[group.id]?.length === 0 ? (
									<StyledNoExpense>정산 내역 없음</StyledNoExpense>
								) : (
									expenses[group.id]?.slice(0, 1).map((expense, index) => (
										<StyledExpense key={index}>
											<p>{expense.date}</p>
											<p>{expense.desc}</p>
											<p>{expense.amount}원</p>
											<p>{expense.member}</p>
											{expenses[group.id]?.length > 1 && <p>...</p>}
										</StyledExpense>
									))
								)}
							</StyledExpenseContainer>
						</StyledContentWrapper>
					</CardOverlay>
				))}

				<AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={() => setIsOpen(false)} isCentered>
					<AlertDialogOverlay>
						<AlertDialogContent>
							<AlertDialogHeader fontSize="md" fontWeight="bold">
								로그인 필요
							</AlertDialogHeader>
							<AlertDialogBody>
								그룹을 생성하려면 로그인이 필요합니다. <br />
								로그인 후 이용해 주세요.
							</AlertDialogBody>
							<AlertDialogFooter>
								<Button ref={cancelRef} onClick={() => setIsOpen(false)} border="none">
									취소
								</Button>
								<Button colorScheme="blue" onClick={onClose} ml={3} border="none">
									확인
								</Button>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialogOverlay>
				</AlertDialog>
			</StyledHomeWrapper>
		</StyledHomeContainer>
	);
};

export default Home;

const StyledHomeContainer = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	padding: 20px;
`;

const StyledHomeWrapper = styled.div`
	width: 100%;
	max-width: 1400px;
	display: grid;
	grid-template-columns: repeat(1, 1fr);
	gap: 20px;

	@media (min-width: 768px) {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	@media (min-width: 1024px) {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
`;

const StyledContentWrapper = styled.div`
	width: 100%;
`;

const StyledAddButton = styled.button`
	border: none;
	background-color: transparent;
	font-size: 16px;
	cursor: pointer;

	@media (min-width: 1024px) {
		font-size: 20px;
	}
`;

const StyledTitle = styled.h3`
	font-size: 20px;
	font-weight: 600;
	margin: 0;

	@media (min-width: 1024px) {
		font-size: 24px;
	}
`;

const StyledDivider = styled.div`
	width: 100%;
	height: 1px;
	background-color: #a0aec0;
	margin-top: 10px;
`;

const StyledContent = styled.div`
	font-size: 16px;
	margin: 0;
	display: grid;
	grid-template-columns: auto 1fr;
	align-items: center;
	gap: 10px;
	margin-top: 10px;
	width: 100%;

	@media (min-width: 1024px) {
		font-size: 20px;
	}
`;

const StyledMemberList = styled.p`
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	margin: 0;
	min-width: 0;
`;

const StyledExpenseContainer = styled.div`
	width: 100%;
	font-size: 16px;
	margin: 0;
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 10px;
	margin-top: 10px;

	@media (min-width: 1024px) {
		font-size: 20px;
	}
`;

const StyledExpenseTitle = styled.div`
	display: flex;
	align-items: center;
	gap: 10px;
`;

const StyledExpense = styled.div`
	display: flex;
	gap: 10px;
`;

const StyledNoExpense = styled.p`
	font-size: 16px;
	color: #a0aec0;
`;
