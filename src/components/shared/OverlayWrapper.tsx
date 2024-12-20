import styled from "styled-components";

interface OverlayWrapperProps {
	children: React.ReactNode;
	minHeight?: string;
	width?: string;
}

interface StyledContainerProps {
	minHeight?: string;
	width?: string;
}

const OverlayWrapper = ({ children, minHeight, width }: OverlayWrapperProps) => {
	return <StyledContainer width={width} minHeight={minHeight}>{children}</StyledContainer>;
};

export default OverlayWrapper;

const StyledContainer = styled.div<StyledContainerProps>`
	width: ${props => props.width || "50vh"};
	min-height: ${props => props.minHeight || "0"};
	border-radius: 5px;
	background-color: white;
	filter: drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.1));
`;
