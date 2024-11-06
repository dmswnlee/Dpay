import styled from "styled-components";
import OverlayWrapper from "../components/shared/OverlayWrapper";
import { StyledContainer } from "./Signup";
import { FaRegCalendarAlt, FaMoneyBill } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { MdOutlineMoreVert } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import FormButton from "../components/shared/FormButton";
import useAuthStore from "../store/authStore";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const MyPage = () => {
	const { initializeSession } = useAuthStore();
	const [userName, setUserName] = useState("");

	useEffect(() => {
		const fetchUserName = async () => {
			await initializeSession();
			const userSession = useAuthStore.getState().session;
			if (userSession) {
				const { data, error } = await supabase
					.from("profiles")
					.select("name")
					.eq("id", userSession.user.id)
					.single();
				if (error) {
					console.error("사용자 이름을 가져오는 중 오류 발생:", error.message);
				} else {
					setUserName(data.name);
				}
			}
		};
		fetchUserName();
	}, []);

	return (
		<StyledContainer data-testid="maypage-container">
			<OverlayWrapper minHeight="50vh">
				<StyledUserContainer>
					<StyledUser>
						안녕하세요.<StyledName>{userName}</StyledName>님!
					</StyledUser>
					<div>
						<StyledTitle>지난 모임 내역</StyledTitle>
						<StyledCard>
							<div>
								<StyledGroupName>노른자들의 여행</StyledGroupName>
								<StyledContent>
									<FaRegCalendarAlt />
									<p>모임 날짜 : 24.09.15 ~ 24.09.17 </p>
								</StyledContent>
								<StyledContent>
									<FaUserGroup />
									<p>모임 멤버 : 은주, 은영, 소라</p>
								</StyledContent>
								<StyledContent>
									<FaMoneyBill />
									<p>한 사람 당 지출 금액 : 55,000원</p>
								</StyledContent>
							</div>
							<StyledButtonGroup>
								<StyledButtonWrapper>
									<RiDeleteBin5Line />
								</StyledButtonWrapper>
								<StyledButtonWrapper>
									<MdOutlineMoreVert />
								</StyledButtonWrapper>
							</StyledButtonGroup>
						</StyledCard>
					</div>
					<StyledAddButtonWrapper>
						<FormButton text="생성하기" />
					</StyledAddButtonWrapper>
				</StyledUserContainer>
			</OverlayWrapper>
		</StyledContainer>
	);
};

export default MyPage;

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
