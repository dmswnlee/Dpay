import styled from "styled-components";
import AddExpenseForm from "../components/AddExpenseForm";
import ExpenseList from "../components/ExpenseList";
import SettlementSummary from "../components/SettlementSummary";
import { IoShareSocialOutline } from "react-icons/io5";

const ExpenseMain = () => {
	const handleSharing = () => {
		if (navigator.userAgent.match(/iphone|android/i) && navigator.share) {
			navigator.share({
				url: window.location.href,
			});
		} else {
			navigator.clipboard.writeText(window.location.href).then(() => {
				alert("공유 링크가 클립 보드에 복사 되었습니다.");
			});
		}
	};

	return (
		<StyledExpenseContainer>
			<StyledExpenseWrapper>
				<StyledLeft>
					<AddExpenseForm />
					<SettlementSummary />
				</StyledLeft>
				<div>
					<ExpenseList />
				</div>
			</StyledExpenseWrapper>
			<StyledShareBtnContainer>
				<StyledShareBtn data-testId="share-btn" onClick={handleSharing}>
					<IoShareSocialOutline />
				</StyledShareBtn>
			</StyledShareBtnContainer>
		</StyledExpenseContainer>
	);
};

export default ExpenseMain;

const StyledExpenseContainer = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const StyledExpenseWrapper = styled.div`
	width: 100%;
	max-width: 1400px;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 20px;
	padding: 20px;

	@media (min-width: 1024px) {
		flex-direction: row;
		padding: 20px 0;
	}
`;

const StyledLeft = styled.div`
	@media (min-width: 768px) {
		width: 100%;
		display: flex;
		gap: 10px;
	}

	@media (min-width: 1024px) {
		flex-direction: column;
		gap: 0;
	}
`;

const StyledShareBtnContainer = styled.div`
	position: fixed;
	right: 40px;
	bottom: 40px;
	width: 55px;
	height: 55px;
	background-color: #3d8bfd;
	border-radius: 50%;
`;

const StyledShareBtn = styled.button`
	outline: none;
	border: none;
	width: 100%;
	height: 100%;
	background-color: transparent;
	font-size: 28px;
	line-height: 1.4rem;
	color: #ffffff;
	text-align: center;
	cursor: pointer;
	&:hover {
		filter: brightness(0.8);
	}
`;
