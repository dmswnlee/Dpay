import styled from "styled-components";
import OverlayWrapper from "../components/shared/OverlayWrapper";
import { StyledContainer } from "./Signup";
import { FaRegCalendarAlt, FaMoneyBill } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { MdOutlineMoreVert } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import FormButton from "../components/shared/FormButton";
import useAuthStore from "../store/authStore";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../supabaseClient";
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
import LoadingSpinner from "../components/shared/LoadingSpinner";
import { Group } from '../types/group';
import { useResponsiveOverlay } from '../hooks/useResponsiveOverlay';
import { FormatDate } from '../components/shared/FormatDate';
import { FormatNumber } from '../components/shared/FormatNumber';

const MyPage = () => {
	const { initializeSession } = useAuthStore();
	const [userName, setUserName] = useState("");
	const [groups, setGroups] = useState<Group[]>([]);
	const [deleteGroupId, setDeleteGroupId] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const cancelRef = useRef(null);
	const navigate = useNavigate();
	const { overlayWidth, overlayHeight } = useResponsiveOverlay(
    { base: "90vw", lg: "60vh" }, 
    { base: "100%", lg: "50vh" }  
  );

	useEffect(() => {
		const fetchUserNameAndGroups = async () => {
			setIsLoading(true);
			await initializeSession();
			const userSession = useAuthStore.getState().session;

			if (userSession) {
				const { data: userData, error: userError } = await supabase
					.from("profiles")
					.select("name")
					.eq("id", userSession.user.id)
					.single();

				if (userError) {
					console.error("사용자 이름을 가져오는 중 오류 발생:", userError.message);
				} else {
					setUserName(userData.name);
				}

				const { data: groupData, error: groupError } = await supabase
					.from("groups")
					.select("id, group_name, start_date, end_date, tags")
					.eq("created_by", userSession.user.id);

				if (groupError) {
					console.error("그룹 데이터를 가져오는 중 오류 발생:", groupError.message);
				} else if (groupData.length > 0) {
					const groupIds = groupData.map(group => group.id);

					const { data: settlementData, error: settlementError } = await supabase
						.from("settlement")
						.select("group_id, amount_per_person")
						.in("group_id", groupIds);

					if (settlementError) {
						console.error("정산 데이터를 가져오는 중 오류 발생:", settlementError.message);
					} else {
						const groupsWithAmounts = groupData.map(group => ({
							...group,
							amount_per_person:
								settlementData.find(settlement => settlement.group_id === group.id)?.amount_per_person || 0,
						}));

						setGroups(groupsWithAmounts);
					}
				}
			}
			setIsLoading(false);
		};

		fetchUserNameAndGroups();
	}, []);

	const onOpen = (groupId: string) => {
		setDeleteGroupId(groupId);
	};

	const onClose = () => {
		setDeleteGroupId(null);
	};

	const handleConfirmDelete = async () => {
		if (!deleteGroupId) return;

		try {
			const { error: expenseError } = await supabase
				.from("expenses")
				.delete()
				.eq("group_id", deleteGroupId);

			if (expenseError) {
				console.error("비용 데이터 삭제 중 오류가 발생했습니다:", expenseError.message);
				return;
			}

			const { error: groupError } = await supabase
				.from("groups")
				.delete()
				.eq("id", deleteGroupId);

			if (groupError) {
				console.error("그룹 삭제 중 오류가 발생했습니다:", groupError.message);
				return;
			}

			setGroups(prevGroups => prevGroups.filter(group => group.id !== deleteGroupId));
		} catch (error) {
			console.error("삭제 중 오류가 발생했습니다:", error);
		} finally {
			onClose();
		}
	};

	const handleClick = () => {
		navigate("/create");
	};

	if (isLoading) {
		return <LoadingSpinner />;
	}

	return (
		<StyledContainer data-testid="maypage-container">
			<OverlayWrapper width={overlayWidth} minHeight={overlayHeight}>
				<StyledUserContainer>
					<StyledUser>
						안녕하세요.<StyledName>{userName}</StyledName>님!
					</StyledUser>
					<div>
						<StyledTitle>지난 모임 내역</StyledTitle>
						<StyledScrollableContainer>
							{groups.length === 0 ? (
								<StyledNoGroup>모임 내역이 없습니다.</StyledNoGroup>
							) : (
								groups.map(group => (
									<StyledCard key={group.id}>
										<div>
											<StyledTop>
												<StyledGroupName>{group.group_name}</StyledGroupName>
												<StyledButtonGroup>
													<StyledButtonWrapper onClick={() => onOpen(group.id)}>
														<RiDeleteBin5Line />
													</StyledButtonWrapper>
													<StyledButtonWrapper onClick={() => navigate(`/expense/${group.id}`)}>
														<MdOutlineMoreVert />
													</StyledButtonWrapper>
												</StyledButtonGroup>
											</StyledTop>
											<StyledContent>
												<FaRegCalendarAlt />
												<p>
													모임 날짜 : {FormatDate(group.start_date)} ~ {FormatDate(group.end_date)}
												</p>
											</StyledContent>
											<StyledContent>
												<FaUserGroup />
												<p>모임 멤버 : {group.tags.join(", ")}</p>
											</StyledContent>
											<StyledContent>
												<FaMoneyBill />
												<StyledAmount>
													한 사람 당 지출 금액 :{" "}
													{group.amount_per_person ? (
														<p>{FormatNumber(group.amount_per_person)}원</p>
													) : (
														<StyledNoAmount>정산 내역 없음</StyledNoAmount>
													)}
												</StyledAmount>
											</StyledContent>
										</div>
									</StyledCard>
								))
							)}
						</StyledScrollableContainer>
					</div>
					<StyledAddButtonWrapper>
						<FormButton text="생성하기" onClick={handleClick} />
					</StyledAddButtonWrapper>
				</StyledUserContainer>
			</OverlayWrapper>

			<AlertDialog isOpen={deleteGroupId !== null} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader fontSize="lg" fontWeight="bold">
							모임 삭제
						</AlertDialogHeader>
						<AlertDialogBody>
							정말로 이 모임을 삭제하시겠습니까? <br />이 작업은 되돌릴 수 없습니다.
						</AlertDialogBody>
						<AlertDialogFooter>
							<Button ref={cancelRef} onClick={onClose} border="none" cursor="pointer">
								취소
							</Button>
							<Button colorScheme="red" onClick={handleConfirmDelete} ml={3} border="none" cursor="pointer">
								삭제
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</StyledContainer>
	);
};

export default MyPage;

const StyledScrollableContainer = styled.div`
	max-height: 380px;
	overflow-y: auto;
	scrollbar-gutter: stable both-edges;

	&::-webkit-scrollbar {
		width: 0.5rem;
	}

	&::-webkit-scrollbar-track {
		background: #f1f1f1;
	}

	&::-webkit-scrollbar-thumb {
		background-color: #3d8bfd;
		border-radius: 10px;
	}

	@media (min-width: 768px) {
		margin-top: 10px;
	}
`;

const StyledNoGroup = styled.div`
	height: 170px;
	background-color: #edf2f7;
	border-radius: 5px;
	padding: 20px;
	margin-top: 20px;
	display: flex;
	justify-content: center;
	align-items: center;
	color: #a0aec0;
`;

const StyledAmount = styled.div`
	display: flex;
	gap: 5px;
`;

const StyledNoAmount = styled.p`
	color: #a0aec0;
`;

const StyledUserContainer = styled.div`
	height: 600px;
	display: flex;
	flex-direction: column;
	padding: 20px;
	gap: 20px;

	@media (min-width: 768px) {
		height: 700px;
		padding: 60px;
	}
`;

const StyledUser = styled.div`
	display: flex;
	justify-content: flex-end;
	font-size: 24px;

	@media (min-width: 768px) {
		font-size: 28px;
	}
`;

const StyledName = styled.span`
	color: #3d8bfd;
`;

const StyledTitle = styled.p`
	font-size: 20px;

	@media (min-width: 768px) {
		font-size: 24px;
	}
`;

const StyledCard = styled.div`
	background-color: #edf2f7;
	border-radius: 5px;
	padding: 20px;
	margin-top: 20px;
`;

const StyledTop = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
`;

const StyledGroupName = styled.p`
	font-size: 18px;

	@media (min-width: 768px) {
		font-size: 20px;
	}
`;
const StyledContent = styled.div`
	display: flex;
	align-items: center;
	gap: 10px;
	font-size: 14px;
	margin-top: 10px;

	@media (min-width: 768px) {
		font-size: 16px;
	}
`;

export const StyledButtonGroup = styled.div`
	width: 80px;
	height: 30px;
	display: flex;
	gap: 20px;
`;

export const StyledButtonWrapper = styled.button`
	width: 30px;
	height: 30px;
	background-color: #ffffff;
	border-radius: 50%;
	border: none;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 18px;
	cursor: pointer;
	transition: all 150ms ease-out;
	&:hover {
		background-color: #3d8bfd;
		transform: rotate(15deg) scale(1.2);
		color: #ffffff;
	}

	@media (min-width: 768px) {
		font-size: 20px;
	}
`;

export const StyledAddButtonWrapper = styled.div`
	width: 90%;
	position: fixed;
	bottom: 20px;

	@media (min-width: 768px) {
		width: 83%;
		bottom: 60px;
	}
`;
