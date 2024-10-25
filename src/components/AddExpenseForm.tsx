import styled from "styled-components";
import { StyledForm, StyledFormWrapper, StyledInput, StyledInputWrapper } from "../pages/Signup";
import FormButton from "./shared/FormButton";
import OverlayWrapper from "./shared/OverlayWrapper";

const AddExpenseForm = () => {
	return (
		<div>
			<OverlayWrapper minHeight="50vh">
				<StyledForm>
					<StyledFormWrapper>
						<StyledInputWrapper>
							<StyledInput id="date" type="date" />
						</StyledInputWrapper>

						<StyledInputWrapper>
							<StyledInput id="desc" placeholder="비용에 대한 설명을 입력해주세요." />
						</StyledInputWrapper>

						<StyledInputWrapper>
							<StyledInput id="memo" placeholder="메모를 입력해주세요." />
						</StyledInputWrapper>

						<StyledInputWrapper>
							<StyledPaneWrapper>
								<StyledAmountInput id="amount" type="number" min={0} placeholder="비용을 입력해주세요." />
								<StyledMemberSelect defaultValue="">
									<option value="" disabled>
										누가 결제 했나요?
									</option>
								</StyledMemberSelect>
							</StyledPaneWrapper>
						</StyledInputWrapper>
					</StyledFormWrapper>

					<FormButton text="추가하기" />
				</StyledForm>
			</OverlayWrapper>
		</div>
	);
};

export default AddExpenseForm;

const StyledPaneWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	gap: 20px;
`;

const StyledAmountInput = styled.input`
	width: 50%;
	outline: none;
	border: 1px solid #e2e8f0;
	border-radius: 5px;
	padding: 20px;
	font-size: 18px;
	margin-top: 15px;
	::placeholder {
		color: #a0aec0;
	}
`;

const StyledMemberSelect = styled.select`
	width: 50%;
	border: 1px solid #e2e8f0;
	border-radius: 5px;
	padding: 20px;
	font-size: 18px;
	margin-top: 15px;
`;
