import { useForm } from "react-hook-form";
import FormButton from "../components/shared/FormButton";
import OverlayWrapper from "../components/shared/OverlayWrapper";
import {
	StyledContainer,
	StyledErrorMessage,
	StyledForm,
	StyledFormWrapper,
	StyledInput,
	StyledInputWrapper,
	StyledLabel,
} from "./Signup";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Box, Tag, TagCloseButton, TagLabel } from "@chakra-ui/react";
import styled from "styled-components";

interface CreateGroupData {
	groupName: string;
	member: string[];
	date: string;
}

const CreateGroup = () => {
	const navigate = useNavigate();
	const [tags, setTags] = useState<string[]>([]);
	const [inputValue, setInputValue] = useState("");

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm<CreateGroupData>({
		mode: "onChange",
	});

	const onSubmit = (data: CreateGroupData) => {
		navigate("/expense", {
			state: {
				groupName: data.groupName,
				tags: tags,
				date: data.date,
			},
		});
	};

	const handleAddTag = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			event.preventDefault();
		}

		if (event.key === " " && inputValue.trim() !== "") {
			event.preventDefault();
			const newTags = [...tags, inputValue.trim()];
			setTags(newTags);
			setValue("member", newTags);
			setInputValue("");
		}
	};

	const handleRemoveTag = (tagToRemove: string) => {
		const newTags = tags.filter(tag => tag !== tagToRemove);
		setTags(newTags);
		setValue("member", newTags);
	};

	return (
		<StyledContainer>
			<OverlayWrapper minHeight="50vh">
				<StyledForm onSubmit={handleSubmit(onSubmit)}>
					<StyledFormWrapper>
						<StyledInputWrapper>
							<StyledLabel htmlFor="groupName">당신의 모임 이름은 무엇인가요?</StyledLabel>
							<StyledInput
								id="groupName"
								{...register("groupName", {
									required: "모임 이름을 입력해주세요.",
									maxLength: {
										value: 20,
										message: "모임 이름은 최대 20글자까지 입력 가능합니다.",
									},
								})}
								placeholder="모임 이름을 입력해주세요."
							/>
							{errors.groupName && <StyledErrorMessage>{errors.groupName.message}</StyledErrorMessage>}
						</StyledInputWrapper>

						<StyledInputWrapper>
							<StyledLabel htmlFor="member">모임의 멤버를 입력해주세요.</StyledLabel>
							<Box>
								{tags.map((tag, index) => (
									<Tag key={index} colorScheme="blue" size="lg" mr={2} mt={2}>
										<TagLabel>{tag}</TagLabel>
										<TagCloseButton onClick={() => handleRemoveTag(tag)} border="none" />
									</Tag>
								))}
							</Box>
							<StyledInput
								id="member"
								value={inputValue}
								onChange={e => setInputValue(e.target.value)}
								onKeyDown={handleAddTag}
								placeholder="모임 멤버를 입력해주세요."
							/>
							<StyledMemberInfo>* 모임멤버 입력 후 스페이스바를 누르면 추가할 수 있습니다😉</StyledMemberInfo>
							{errors.member && <StyledErrorMessage>{errors.member.message}</StyledErrorMessage>}
						</StyledInputWrapper>

						<StyledInputWrapper>
							<StyledLabel htmlFor="date">모임 날짜를 입력해주세요.</StyledLabel>
							<StyledInput
								id="date"
								type="date"
								{...register("date", {
									required: "모임 날짜를 입력해주세요.",
								})}
								placeholder="모임 날짜를 입력해주세요."
							/>
							{errors.date && <StyledErrorMessage>{errors.date.message}</StyledErrorMessage>}
						</StyledInputWrapper>
					</StyledFormWrapper>

					<FormButton text="생성하기" />
				</StyledForm>
			</OverlayWrapper>
		</StyledContainer>
	);
};

export default CreateGroup;

const StyledMemberInfo = styled.span`
	margin-top: 5px;
	font-size: 12px;
	color: #a0aec0;
`;
