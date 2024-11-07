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
import { format } from "date-fns";
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

interface Group {
	id: string;
	group_name: string;
	start_date: string;
	end_date: string;
	tags: string[];
}

const MyPage = () => {
	const { initializeSession } = useAuthStore();
	const [userName, setUserName] = useState("");
	const [groups, setGroups] = useState<Group[]>([]);
	const [deleteGroupId, setDeleteGroupId] = useState<string | null>(null);
	const cancelRef = useRef(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchUserNameAndGroups = async () => {
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
				} else {
					setGroups(groupData || []);
				}
			}
		};

		fetchUserNameAndGroups();
	}, []);

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return format(date, "yy.MM.dd");
	};

	const onOpen = (groupId: string) => {
		setDeleteGroupId(groupId);
	};

	const onClose = () => {
		setDeleteGroupId(null);
	};

	const handleConfirmDelete = async () => {
		if (!deleteGroupId) return;

		const { error } = await supabase
			.from("groups")
			.delete()
			.eq("id", deleteGroupId);

		if (error) {
			console.error("모임 삭제 중 오류가 발생했습니다:", error.message);
		} else {
			setGroups(prevGroups => prevGroups.filter(group => group.id !== deleteGroupId));
		}
		onClose();
	};

	const handleClick = () => {
		navigate("/create");
	};

	return (
		<StyledContainer data-testid="maypage-container">
			<OverlayWrapper minHeight="50vh">
				<StyledUserContainer>
					<StyledUser>
						안녕하세요.<StyledName>{userName}</StyledName>님!
					</StyledUser>
					<div>
						<StyledTitle>지난 모임 내역</StyledTitle>
						<StyledScrollableContainer>
							{groups.map(group => (
								<StyledCard key={group.id}>
									<div>
										<StyledGroupName>{group.group_name}</StyledGroupName>
										<StyledContent>
											<FaRegCalendarAlt />
											<p>
												모임 날짜 : {formatDate(group.start_date)} ~ {formatDate(group.end_date)}
											</p>
										</StyledContent>
										<StyledContent>
											<FaUserGroup />
											<p>모임 멤버 : {group.tags.join(", ")}</p>
										</StyledContent>
										<StyledContent>
											<FaMoneyBill />
											<p>한 사람 당 지출 금액 : 55,000원</p>
										</StyledContent>
									</div>
									<StyledButtonGroup>
										<StyledButtonWrapper onClick={() => onOpen(group.id)}>
											<RiDeleteBin5Line />
										</StyledButtonWrapper>
										<StyledButtonWrapper onClick={() => navigate(`/expense/${group.id}`)}>
											<MdOutlineMoreVert />
										</StyledButtonWrapper>
									</StyledButtonGroup>
								</StyledCard>
							))}
						</StyledScrollableContainer>
					</div>
					<StyledAddButtonWrapper>
						<FormButton text="생성하기" onClick={handleClick} />
					</StyledAddButtonWrapper>
				</StyledUserContainer>
			</OverlayWrapper>

			<AlertDialog
				isOpen={deleteGroupId !== null}
				leastDestructiveRef={cancelRef}
				onClose={onClose}
				isCentered>
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
	margin-top: 10px;
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
`;

const StyledUserContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 20px;
`;

const StyledUser = styled.div`
	display: flex;
	justify-content: flex-end;
	font-size: 28px;
`;

const StyledName = styled.span`
	color: #3d8bfd;
`;

const StyledTitle = styled.p`
	font-size: 24px;
`;

const StyledCard = styled.div`
	background-color: #edf2f7;
	border-radius: 5px;
	padding: 20px;
	margin-top: 20px;
	display: flex;
	justify-content: space-between;
`;

const StyledGroupName = styled.p`
	font-size: 20px;
`;
const StyledContent = styled.div`
	display: flex;
	align-items: center;
	gap: 10px;
	font-size: 16px;
	margin-top: 10px;
`;

const StyledButtonGroup = styled.div`
	display: flex;
	gap: 20px;
`;

const StyledButtonWrapper = styled.button`
	width: 30px;
	height: 30px;
	background-color: #ffffff;
	border-radius: 50%;
	border: none;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 20px;
	cursor: pointer;
	transition: all 150ms ease-out;
	&:hover {
		background-color: #3d8bfd;
		transform: rotate(15deg) scale(1.2);
		color: #ffffff;
	}
`;

const StyledAddButtonWrapper = styled.div`
	width: 83%;
	position: fixed;
	bottom: 50px;
`;
