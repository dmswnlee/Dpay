import styled from "styled-components";
import OverlayWrapper from "./shared/OverlayWrapper";
import { HiDownload } from "react-icons/hi";

const SettlementSummary = () => {
	return (
		<StyledContainer>
			<OverlayWrapper minHeight="50vh">
				<StyledTitle>정산 결과</StyledTitle>
				<StyledWrapper>
					<span>멤버 수: 3명</span>
					<span>총 지출 금액 : 165,000원</span>
					<span>한 사람당 지출 금액 : 55,000원</span>
					<StyledDivider></StyledDivider>
					<StyledUl>
						<li>은주가 소라에게 30000원 보내기</li>
					</StyledUl>
				</StyledWrapper>
				<StyledButton>
					<HiDownload />
				</StyledButton>
			</OverlayWrapper>
		</StyledContainer>
	);
};

export default SettlementSummary;

const StyledContainer = styled.div`
	margin-top: 20px;
	position: relative;
`;

const StyledWrapper = styled.div`
	display: flex;
	flex-direction: column;
	font-size: 20px;
	gap: 20px;
	margin-top: 30px;
`;

const StyledTitle = styled.p`
	margin: 0;
	font-size: 24px;
	text-align: center;
`;

const StyledButton = styled.button`
	background: none;
	border: none;
	font-size: 25px;
	position: absolute;
	bottom: 15px;
	right: 15px;
	cursor: pointer;

	&:hover,
	&:active {
		background: none;
		color: #3d8bfd;
	}
`;

const StyledDivider = styled.div`
	width: 100%;
	height: 1px;
	background-color: #e2e8f0;
`;

const StyledUl = styled.ul`
	padding: 20px;
	margin: 0;
	font-weight: 600;

	list-style-type: disclosure-closed;
	li::marker {
		animation: blinker 1.5s linear infinite;
	}

	@keyframes blinker {
		50% {
			opacity: 0;
		}
	}
`;
