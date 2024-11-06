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
import { format } from 'date-fns';

interface Group {
	id: string;
	group_name: string;
	start_date: string;
	end_date: string;
	tags: string[];
}

interface Expense {
	date: string;
	desc: string;
	amount: number;
	member: string;
}

const Home = () => {
	const { session, initializeSession } = useAuthStore();
	const [isOpen, setIsOpen] = useState(false);
	const [groups, setGroups] = useState<Group[]>([]);
	const [expenses, setExpenses] = useState<Record<string, Expense[]>>({});
	const cancelRef = useRef(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchUserSessionAndGroups = async () => {
			await initializeSession();
			const userSession = useAuthStore.getState().session;

			if (userSession) {
				fetchGroups(userSession.user.id);
			}
		};

		fetchUserSessionAndGroups();
	}, []);

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

		data.forEach(group => fetchExpensesForGroup(group.id));
	};

	const fetchExpensesForGroup = async (groupId: string) => {
		const { data, error } = await supabase
			.from("expenses")
			.select("date, desc, amount, member")
			.eq("group_id", groupId);

		if (error) {
			console.error("비용 데이터를 불러오는 중 오류가 발생했습니다:", error.message);
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

	return (
		<StyledHomeContainer data-testid="group-container">
			<StyledHomeWrapper>
				<CardOverlay onClick={handleAddGroup}>
					<FiPlus />
					<StyledAddButton>그룹 생성하기</StyledAddButton>
				</CardOverlay>

				{groups.map(group => (
					<CardOverlay key={group.id} onClick={() => navigate(`/expense/${group.id}`)}>
						<div>
							<StyledTitle>{group.group_name}</StyledTitle>
							<StyledContent>
								<FaRegCalendarAlt />
								<p>모임 날짜 : {`${formatDate(group.start_date)} ~ ${formatDate(group.end_date)}`}</p>
							</StyledContent>
							<StyledContent>
								<FaUserGroup />
								<p>모임 멤버 : {group.tags.join(", ")}</p>
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
						</div>
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
	display: flex;
	justify-content: center;
	padding: 70px 0;
`;

const StyledHomeWrapper = styled.div`
	width: 80%;
	display: flex;
	justify-content: space-between;
	gap: 50px;
	flex-wrap: wrap;
`;

const StyledAddButton = styled.button`
	border: none;
	background-color: transparent;
	font-size: 20px;
	cursor: pointer;
`;

const StyledTitle = styled.h3`
	font-size: 24px;
	font-weight: 600;
	margin: 0;
`;

const StyledContent = styled.div`
	font-size: 20px;
	margin: 0;
	display: flex;
	align-items: center;
	gap: 10px;
	margin-top: 10px;
`;

const StyledExpenseContainer = styled.div`
	font-size: 20px;
	margin: 0;
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 10px;
	margin-top: 10px;
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
