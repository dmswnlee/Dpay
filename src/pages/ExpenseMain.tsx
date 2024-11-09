import styled from "styled-components";
import AddExpenseForm from "../components/AddExpenseForm";
import ExpenseList from "../components/ExpenseList";
import SettlementSummary from "../components/SettlementSummary";

const ExpenseMain = () => {
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
		</StyledExpenseContainer>
	);
};

export default ExpenseMain;

const StyledExpenseContainer = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
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
`
