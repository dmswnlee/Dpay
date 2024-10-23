import styled from "styled-components";

interface CardOverlayProps {
	children: React.ReactNode;
}

const CardOverlay = ({ children }: CardOverlayProps) => {
	return <StyledCardContainer>{children}</StyledCardContainer>;
};

export default CardOverlay;

const StyledCardContainer = styled.div`
	width: 25%;
	height: 250px;
	border-radius: 5px;
	background-color: #ffffff;
	filter: drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.1));
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 20px;
	font-size: 24px;
	&:hover {
		filter: brightness(1.1);
	}
	cursor: pointer;
`;