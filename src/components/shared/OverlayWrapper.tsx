import styled from "styled-components";

interface OverlayWrapperProps {
	children: string;
	padding: string;
	minHeight: string;
}

interface StyledContainerProps {
	padding: string;
	minHeight: string;
}

const OverlayWrapper = ({ children, padding, minHeight }: OverlayWrapperProps) => {
	return (
		<StyledContainer padding={padding} minHeight={minHeight}>
			{children}
		</StyledContainer>
	);
};

export default OverlayWrapper;

const StyledContainer = styled.div<StyledContainerProps>`
	padding: ${props => props.padding || "5vw"};
	border-radius: 15px;
	background-color: white;
  filter: drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.1));
	min-height: ${props => props.minHeight || "0"};
`;
