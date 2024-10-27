import styled from 'styled-components';
import OverlayWrapper from "./shared/OverlayWrapper";

const SettlementSummary = () => {
	return (
		<StyledContainer>
			<OverlayWrapper minHeight="50vh">
				<StyledWrapper>
          <StyledTitle>정산 결과</StyledTitle>
        </StyledWrapper>
			</OverlayWrapper>
		</StyledContainer>
	);
};

export default SettlementSummary;

const StyledContainer = styled.div`
  margin-top: 20px;
`

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
`

const StyledTitle = styled.p`
  margin: 0;
  font-size: 24px;
`