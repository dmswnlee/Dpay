import { useForm } from "react-hook-form";
import OverlayWrapper from "../components/shared/OverlayWrapper";
import FormButton from "../components/shared/FormButton";
import {
	StyledContainer,
	StyledErrorMessage,
	StyledFormWrapper,
	StyledInput,
	StyledInputWrapper,
	StyledLabel,
} from "./Signup";
import styled from "styled-components";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useBreakpointValue } from "@chakra-ui/react";

interface LoginFormData {
	email: string;
	password: string;
}

const Login = () => {
	const navigate = useNavigate();

	const overlayHeight = useBreakpointValue({ base: "100%", lg: "50vh" });
	const overlayWidth = useBreakpointValue({ base: "90vw", lg: "60vh" });

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		mode: "onChange",
	});

	const onSubmit = async (data: LoginFormData) => {
		const { email, password } = data;

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			console.error("로그인 실패", error.message);
		} else {
			navigate("/");
		}
	};

	return (
		<StyledContainer>
			<OverlayWrapper width={overlayWidth} minHeight={overlayHeight}>
				<StyledLoginWrapper>
					<StyledLogoWrapper>
						<StyledLogo src={logo} alt="로고" />
					</StyledLogoWrapper>
					<StyledForm onSubmit={handleSubmit(onSubmit)}>
						<StyledFormWrapper>
							<StyledInputWrapper>
								<StyledLabel htmlFor="email">아이디</StyledLabel>
								<StyledInput
									id="email"
									{...register("email", {
										required: "아이디를 입력해주세요.",
										pattern: {
											value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
											message: "유효한 이메일 주소를 입력해주세요.",
										},
										maxLength: {
											value: 20,
											message: "이름은 최대 20글자까지 입력 가능합니다.",
										},
									})}
									placeholder="아이디를 입력해주세요."
								/>
								{errors.email && <StyledErrorMessage>{errors.email.message}</StyledErrorMessage>}
							</StyledInputWrapper>
							<StyledInputWrapper>
								<StyledLabel htmlFor="password">비밀번호</StyledLabel>
								<StyledInput
									id="password"
									type="password"
									{...register("password", {
										required: "비밀번호를 입력해주세요.",
										maxLength: {
											value: 15,
											message: "비밀번호는 최대 15글자까지 입력 가능합니다.",
										},
									})}
									placeholder="비밀번호를 입력해주세요."
								/>
								{errors.password && <StyledErrorMessage>{errors.password.message}</StyledErrorMessage>}
							</StyledInputWrapper>

							<StyledLink to="/signup">
								<StyledButton type="button">아직 회원가입 전 이신가요?</StyledButton>
							</StyledLink>
						</StyledFormWrapper>

						<FormButton text="로그인" />
					</StyledForm>
				</StyledLoginWrapper>
			</OverlayWrapper>
		</StyledContainer>
	);
};

export default Login;

const StyledLoginWrapper = styled.div`
	height: 500px;
	display: flex;
	flex-direction: column;
	padding: 20px;

	@media (min-width: 768px) {
		height: 700px;
		padding: 60px;
	}
`;

const StyledForm = styled.form`
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
`;

const StyledLink = styled(Link)`
	text-decoration: none;
	display: flex;
	justify-content: center;
`;

const StyledButton = styled.button`
	border: none;
	background-color: transparent;
	font-size: 16px;
	color: #a0aec0;
	cursor: pointer;
`;

const StyledLogoWrapper = styled.div`
	display: flex;
	justify-content: center;
	margin-bottom: 20px;
`;

export const StyledLogo = styled.img`
	width: 94px;
	height: 46px;
`;
