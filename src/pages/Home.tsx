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

const Home = () => {
	const { session, initializeSession } = useAuthStore();
	const [isOpen, setIsOpen] = useState(false);
	const cancelRef = useRef(null);
	const navigate = useNavigate();

	useEffect(() => {
		initializeSession();
	}, [initializeSession]);

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

	return (
		<StyledHomeContainer>
			<StyledHomeWrapper>
				<CardOverlay onClick={handleAddGroup}>
					<FiPlus />
					<StyledAddButton >그룹 생성하기</StyledAddButton>
				</CardOverlay>

				{/* 모달 */}
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
	margin: 70px 0;
`;

const StyledHomeWrapper = styled.div`
	width: 80%;
`;

const StyledAddButton = styled.button`
	border: none;
	background-color: transparent;
	font-size: 20px;
  cursor:pointer;
`;
