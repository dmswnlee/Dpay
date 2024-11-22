import { useForm } from "react-hook-form";
import FormButton from "../components/shared/FormButton";
import OverlayWrapper from "../components/shared/OverlayWrapper";
import {
	StyledContainer,
	StyledErrorMessage,
	StyledFormWrapper,
	StyledInput,
	StyledInputWrapper,
	StyledLabel,
} from "./Signup";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Tag, TagCloseButton, TagLabel, useBreakpointValue } from "@chakra-ui/react";
import styled from "styled-components";
import { useGroupStore } from "../store/useGroupStore";
import { supabase } from "../supabaseClient";
import useAuthStore from "../store/authStore";
import { CreateGroupData } from '../types/group';
import { useResponsiveOverlay } from '../hooks/useResponsiveOverlay';

const CreateGroup = () => {
	const navigate = useNavigate();
	const { tags, setGroupName, addTag, removeTag, setStartDate, setEndDate, setTags } = useGroupStore();
	const [inputValue, setInputValue] = useState("");
	const [memberError, setMemberError] = useState<string | null>(null);
	const { overlayWidth, overlayHeight } = useResponsiveOverlay(
    { base: "90vw", lg: "60vh" }, 
    { base: "100%", lg: "50vh" }  
  );
	const tagSize = useBreakpointValue({ base: "sm", lg: "lg" });
	const today = new Date().toISOString().split("T")[0];

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CreateGroupData>({
		mode: "onChange",
	});

	useEffect(() => {
		setTags([]);
	}, [setTags]);

	const onSubmit = async (data: CreateGroupData) => {
		if (tags.length === 0) {
			setMemberError("멤버를 최소 한 명 이상 추가해주세요.");
			return;
		}
		setMemberError(null);

		const { session } = useAuthStore.getState();

		setGroupName(data.groupName);
		setStartDate(data.startDate);
		setEndDate(data.endDate);

		const userId = session?.user?.id;

		if (!userId) {
			console.error("로그인된 사용자 정보가 없습니다. 다시 시도해주세요.");
			return;
		}

		const { data: groupData, error } = await supabase
			.from("groups")
			.insert({
				group_name: data.groupName,
				tags,
				start_date: data.startDate,
				end_date: data.endDate,
				created_by: userId,
			})
			.select();

		if (error) {
			console.error("그룹 생성 오류:", error.message);
			return;
		}

		if (groupData && groupData.length > 0) {
			const groupId = groupData[0].id;
			navigate(`/expense/${groupId}`);
		}
	};

	const handleAddTag = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			event.preventDefault();
		}

		if (event.key === " " && inputValue.trim() !== "") {
			event.preventDefault();

			if (tags.length < 10) {
				addTag(inputValue.trim());
				setMemberError(null);
			}
			setInputValue("");
		}
	};

	const handleRemoveTag = (tagToRemove: string) => {
		removeTag(tagToRemove);
	};

	return (
		<StyledContainer>
			<OverlayWrapper width={overlayWidth} minHeight={overlayHeight}>
				<StyledCreateWrapper>
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
										<Tag key={index} colorScheme="blue" size={tagSize} mr={2} mt={2}>
											<TagLabel>{tag}</TagLabel>
											<TagCloseButton onClick={() => handleRemoveTag(tag)} border="none" />
										</Tag>
									))}
								</Box>
								<StyledInput
									id="member"
									value={inputValue}
									onChange={e => setInputValue(e.target.value)}
									onKeyUp={handleAddTag}
									placeholder="모임 멤버를 입력해주세요."
								/>
								<StyledMemberInfo>* 모임멤버 입력 후 스페이스바를 누르면 추가할 수 있습니다😉</StyledMemberInfo>
								{memberError && <StyledErrorMessage>{memberError}</StyledErrorMessage>}
							</StyledInputWrapper>

							<StyledInputWrapper>
								<StyledLabel>모임 날짜를 입력해주세요.</StyledLabel>
								<StyledDateWrapper>
									<StyledInput
										id="startDate"
										type="date"
										min={today}
										{...register("startDate", {
											required: "모임 시작 날짜를 입력해주세요.",
										})}
										placeholder="시작 날짜"
									/>
									<StyledSpan> ~ </StyledSpan>
									<StyledInput
										id="endDate"
										type="date"
										min={today}
										{...register("endDate", {
											required: "모임 종료 날짜를 입력해주세요.",
										})}
										placeholder="종료 날짜"
									/>
								</StyledDateWrapper>
								{(errors.startDate || errors.endDate) && (
									<StyledErrorMessage>
										{errors.startDate?.message || errors.endDate?.message}
									</StyledErrorMessage>
								)}
							</StyledInputWrapper>
						</StyledFormWrapper>

						<FormButton text="생성하기" />
					</StyledForm>
				</StyledCreateWrapper>
			</OverlayWrapper>
		</StyledContainer>
	);
};

export default CreateGroup;

const StyledCreateWrapper = styled.div`
	height: 600px;
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
	justify-content: space-between;
`;

const StyledDateWrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;

	@media (min-width: 768px) {
		align-items: center;
		flex-direction: row;
	}
`;

const StyledSpan = styled.span`
	text-align: center;
`;

const StyledMemberInfo = styled.span`
	margin-top: 5px;
	font-size: 12px;
	color: #a0aec0;
`;
