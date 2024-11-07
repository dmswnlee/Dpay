import { BsEmojiFrown } from "react-icons/bs";
import styled from "styled-components";

const NotFound = () => {
	return (
		<StyledContainer>
			<StyledEmoji>
				<BsEmojiFrown size={200} />
			</StyledEmoji>
			<StyledHeaderText>404</StyledHeaderText>
			<StyledbodyText>페이지를 찾을 수 없습니다.</StyledbodyText>
		</StyledContainer>
	);
};

export default NotFound;

const StyledContainer = styled.div`
	height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	color: #3d8bfd;
`;

const StyledEmoji = styled.div`
	width: 200px;
	height: 200px;
`;

const StyledHeaderText = styled.p`
	font-size: 100px;
	font-weight: 300;
`;

const StyledbodyText = styled.p`
	font-size: 50px;
	font-weight: 300;
`;
