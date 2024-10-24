import FormButton from '../components/shared/FormButton';
import OverlayWrapper from "../components/shared/OverlayWrapper";
import { StyledContainer, StyledForm, StyledFormWrapper, StyledInput, StyledInputWrapper, StyledLabel } from "./Signup";

const CreateGroup = () => {
	return (
		<StyledContainer>
			<OverlayWrapper minHeight="50vh">
				<StyledForm>
					<StyledFormWrapper>
						<StyledInputWrapper>
							<StyledLabel>당신의 모임 이름은 무엇인가요?</StyledLabel>
							<StyledInput />
						</StyledInputWrapper>

						<StyledInputWrapper>
							<StyledLabel>모임의 멤버를 입력해주세요.</StyledLabel>
							<StyledInput />
						</StyledInputWrapper>

						<StyledInputWrapper>
							<StyledLabel>모임 날짜를 입력해주세요.</StyledLabel>
							<StyledInput />
						</StyledInputWrapper>
					</StyledFormWrapper>

          <FormButton text="생성하기" />
				</StyledForm>
			</OverlayWrapper>
		</StyledContainer>
	);
};

export default CreateGroup;
