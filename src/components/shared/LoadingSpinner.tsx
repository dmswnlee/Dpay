import { Spinner } from "@chakra-ui/react";
import styled from "styled-components";

const LoadingSpinner = () => {
	return (
		<StyledLoadingContainer>
			<Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
		</StyledLoadingContainer>
	);
};

export default LoadingSpinner;

const StyledLoadingContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100vh;
	width: 100vw;
`;
