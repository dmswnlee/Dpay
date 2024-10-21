import styled from "styled-components";

interface OverlayWrapperProps {
	children: React.ReactNode;
	minHeight: string;
}

interface StyledContainerProps {
	minHeight: string;
}

const OverlayWrapper = ({ children, minHeight }: OverlayWrapperProps) => {
	return <StyledContainer minHeight={minHeight}>{children}</StyledContainer>;
};

export default OverlayWrapper;

const StyledContainer = styled.div<StyledContainerProps>`
	width: 50vh;
	height: 0;
	padding: 60px;
	border-radius: 5px;
	background-color: white;
	filter: drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.1));
	min-height: ${props => props.minHeight || "0"};
`;
