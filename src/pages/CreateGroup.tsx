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
import { useGroupStore } from "../store/useGroupStore";

interface CreateGroupData {
	groupName: string;
	member: string[];
	startDate: string;
	endDate: string;
}

const CreateGroup = () => {
	const navigate = useNavigate();
	const { tags, setGroupName, addTag, removeTag, setStartDate, setEndDate } = useGroupStore();
	const [inputValue, setInputValue] = useState("");

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CreateGroupData>({
		mode: "onChange",
	});

	const onSubmit = (data: CreateGroupData) => {
		setGroupName(data.groupName);
		setStartDate(data.startDate);
		setEndDate(data.endDate);
		navigate("/expense");
	};

	const handleAddTag = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			event.preventDefault();
		}

		if (event.key === " " && inputValue.trim() !== "") {
			event.preventDefault();
			addTag(inputValue.trim());
			setInputValue("");
		}
	};

	const handleRemoveTag = (tagToRemove: string) => {
		removeTag(tagToRemove);
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
							<StyledLabel>모임 날짜를 입력해주세요.</StyledLabel>
							<StyledDateWrapper>
								<StyledInput
									id="startDate"
									type="date"
									{...register("startDate", {
										required: "모임 시작 날짜를 입력해주세요.",
									})}
									placeholder="시작 날짜"
								/>
								<span> ~ </span>
								<StyledInput
									id="endDate"
									type="date"
									{...register("endDate", {
										required: "모임 종료 날짜를 입력해주세요.",
									})}
									placeholder="종료 날짜"
								/>
							</StyledDateWrapper>
							{(errors.startDate || errors.endDate) && (
								<StyledErrorMessage>{errors.startDate?.message || errors.endDate?.message}</StyledErrorMessage>
							)}
						</StyledInputWrapper>
					</StyledFormWrapper>

					<FormButton text="생성하기" />
				</StyledForm>
			</OverlayWrapper>
		</StyledContainer>
	);
};

export default CreateGroup;

const StyledDateWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 10px; /* 입력 필드 사이 간격 조절 */
`;

const StyledMemberInfo = styled.span`
	margin-top: 5px;
	font-size: 12px;
	color: #a0aec0;
`;
