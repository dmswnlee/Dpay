import styled from "styled-components";
import { FiPlus } from "react-icons/fi";
import CardOverlay from "../components/shared/CardOverlay";

const Home = () => {
	return (
		<StyledHomeContainer>
			<StyledHomeWrapper>
				<CardOverlay>
					<FiPlus />
					<StyledAddButton>그룹 생성하기</StyledAddButton>
				</CardOverlay>
			</StyledHomeWrapper>
		</StyledHomeContainer>
	);
};

export default Home;

const StyledHomeContainer = styled.div`
	display: flex;
	justify-content: center;
  margin-top: 70px;
`;

const StyledHomeWrapper = styled.div`
	width: 80%;
`;

const StyledAddButton = styled.button`
	border: none;
	background-color: transparent;
	font-size: 20px;
`;
