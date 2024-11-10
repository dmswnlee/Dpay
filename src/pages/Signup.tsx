import styled from "styled-components";
import OverlayWrapper from "../components/shared/OverlayWrapper";
import { useForm } from "react-hook-form";
import FormButton from "../components/shared/FormButton";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Button,
	useBreakpointValue,
} from "@chakra-ui/react";

interface SignupFormData {
	name: string;
	email: string;
	password: string;
}

const Signup = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const navigate = useNavigate();
	const cancelRef = useRef(null);

	const overlayHeight = useBreakpointValue({ base: "100%", lg: "50vh" });
	const overlayWidth = useBreakpointValue({ base: "90vw", lg: "60vh" });

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignupFormData>({
		mode: "onChange",
	});

	const onSubmit = async (data: SignupFormData) => {
		const { name, email, password } = data;

		const { data: signUpData, error } = await supabase.auth.signUp({
			email,
			password,
		});

		if (error) {
			console.error("회원가입 오류:", error.message);
		} else if (signUpData?.user) {
			const { error: profileError } = await supabase.from("profiles").insert([{ name, id: signUpData.user.id }]);

			if (profileError) {
				console.error("프로필 저장 오류:", profileError.message);
			} else {
				//alert("회원가입이 완료되었습니다");
				setIsModalOpen(true);
			}
		}
	};

	const handleModalClose = () => {
		setIsModalOpen(false);
		navigate("/login");
	};

	return (
		<StyledContainer data-testid="signup-page">
			<OverlayWrapper width={overlayWidth} minHeight={overlayHeight}>
				<StyledForm onSubmit={handleSubmit(onSubmit)}>
					<StyledFormWrapper>
						<StyledInputWrapper>
							<StyledLabel htmlFor="name">이름</StyledLabel>
							<StyledInput
								id="name"
								{...register("name", {
									required: "이름을 입력해주세요.",
									maxLength: {
										value: 5,
										message: "이름은 최대 5글자까지 입력 가능합니다.",
									},
								})}
								placeholder="이름을 입력해주세요."
							/>
							{errors.name && <StyledErrorMessage>{errors.name.message}</StyledErrorMessage>}
						</StyledInputWrapper>

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
										message: "아이디는 최대 20글자까지 입력 가능합니다.",
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
					</StyledFormWrapper>

					<FormButton text="가입하기" />
				</StyledForm>
			</OverlayWrapper>

			{/* 회원가입 완료 팝업 */}
			<AlertDialog
				isOpen={isModalOpen}
				leastDestructiveRef={cancelRef}
				onClose={handleModalClose}
				isCentered
				motionPreset="slideInBottom"
				useInert={false}>
				<AlertDialogOverlay />
				<AlertDialogContent>
					<AlertDialogHeader fontSize="lg" fontWeight="bold">
						회원가입 완료
					</AlertDialogHeader>
					<AlertDialogBody>회원가입이 완료되었습니다.</AlertDialogBody>
					<AlertDialogFooter>
						<Button colorScheme="blue" size="md" ref={cancelRef} onClick={handleModalClose} border="none">
							확인
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</StyledContainer>
	);
};

export default Signup;

export const StyledContainer = styled.div`
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 0 20px;

	@media (min-width: 768px) {
		padding: 0;
	}
`;

export const StyledErrorMessage = styled.span`
	color: red;
	font-size: 12px;
	display: block;
	margin-top: 5px;

	@media (min-width: 768px) {
		font-size: 16px;
	}
`;

export const StyledForm = styled.form`
	height: 450px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding: 20px;

	@media (min-width: 768px) {
		height: 700px;
		padding: 60px;
	}
`;

export const StyledFormWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 30px;
`;

export const StyledInputWrapper = styled.div`
	display: flex;
	flex-direction: column;
`;

export const StyledLabel = styled.label`
	font-size: 16px;

	@media (min-width: 768px) {
		font-size: 20px;
	}
`;

export const StyledInput = styled.input`
	outline: none;
	border: 1px solid #e2e8f0;
	border-radius: 5px;
	padding: 10px;
	font-size: 14px;
	margin-top: 5px;
	::placeholder {
		color: #a0aec0;
	}

	@media (min-width: 768px) {
		padding: 20px;
		font-size: 18px;
		margin-top: 15px;
	}
`;
