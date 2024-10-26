import styled from "styled-components";
import AddExpenseForm from "../components/AddExpenseForm";
import ExpenseList from "../components/ExpenseList";
import SettlementSummary from "../components/SettlementSummary";

const ExpenseMain = () => {
	return (
		<StyledExpenseContainer>
			<StyledExpenseWrapper>
				<div>
					<AddExpenseForm />
					<SettlementSummary />
				</div>
				<div>
					<ExpenseList />
				</div>
			</StyledExpenseWrapper>
		</StyledExpenseContainer>
	);
};

export default ExpenseMain;

const StyledExpenseContainer = styled.div`
	width: 100vw;
	display: flex;
	justify-content: center;
`;

const StyledExpenseWrapper = styled.div`
	width: 80%;
	display: flex;
	justify-content: space-between;
	gap: 20px;
	margin: 70px 0;
`;
