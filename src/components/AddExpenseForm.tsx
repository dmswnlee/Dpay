import styled from "styled-components";
import { StyledErrorMessage, StyledInputWrapper } from "../pages/Signup";
import FormButton from "./shared/FormButton";
import OverlayWrapper from "./shared/OverlayWrapper";
import { useGroupStore } from "../store/useGroupStore";
import { useForm } from "react-hook-form";
import { useExpenseStore } from "../store/useExpenseStore";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useBreakpointValue } from "@chakra-ui/react";

interface AddExpenseData {
	date: string;
	desc: string;
	memo: string;
	amount: number;
	member: string;
}

const AddExpenseForm = () => {
	const { tags, startDate, setStartDate, setTags } = useGroupStore();
	const { groupId } = useParams();
	const { addExpense } = useExpenseStore();

	const overlayHeight = useBreakpointValue({ base: "0", lg: "50vh" });
	const overlayWidth = useBreakpointValue({ base: "90vw", md: "50vw", lg: "50vh" });

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<AddExpenseData>({
		mode: "onChange",
	});

	useEffect(() => {
		const fetchGroupInfo = async () => {
			if (groupId) {
				const { data, error } = await supabase.from("groups").select("start_date, tags").eq("id", groupId).single();

				if (error) {
					console.error("그룹 정보를 가져오는 중 오류가 발생했습니다:", error.message);
					return;
				}

				if (data) {
					setStartDate(data.start_date);
					setTags(data.tags || []);
				}
			}
		};

		fetchGroupInfo();
	}, [groupId, setStartDate, setTags]);

	const onSubmit = async (data: AddExpenseData) => {
		const { error } = await supabase.from("expenses").insert([
			{
				group_id: groupId,
				date: data.date,
				desc: data.desc,
				memo: data.memo,
				amount: data.amount,
				member: data.member,
			},
		]);

		if (error) {
			console.error("비용 저장 중 오류가 발생했습니다:", error.message);
			return;
		}

		addExpense(data);
	};

	return (
		<OverlayWrapper width={overlayWidth} minHeight={overlayHeight}>
			<StyledExpenseWrapper>
				<StyledForm onSubmit={handleSubmit(onSubmit)}>
					<StyledFormWrapper>
						<StyledInputWrapper>
							<StyledExpenseInput
								id="date"
								type="date"
								defaultValue={startDate}
								{...register("date", {
									required: "날짜를 입력해주세요.",
								})}
							/>
							{errors.date && <StyledErrorMessage>{errors.date.message}</StyledErrorMessage>}
						</StyledInputWrapper>

						<StyledInputWrapper>
							<StyledExpenseInput
								id="desc"
								{...register("desc", {
									required: "비용 내용을 입력해주세요.",
									maxLength: {
										value: 30,
										message: "비용 내용은 최대 30글자까지 입력 가능합니다.",
									},
								})}
								placeholder="비용에 대한 설명을 입력해주세요."
							/>
							{errors.desc && <StyledErrorMessage>{errors.desc.message}</StyledErrorMessage>}
						</StyledInputWrapper>

						<StyledInputWrapper>
							<StyledExpenseInput
								id="memo"
								{...register("memo", {
									maxLength: {
										value: 30,
										message: "메모는 최대 30글자까지 입력 가능합니다.",
									},
								})}
								placeholder="메모를 입력해주세요."
							/>
							{errors.memo && <StyledErrorMessage>{errors.memo.message}</StyledErrorMessage>}
						</StyledInputWrapper>

						<StyledInputWrapper>
							<StyledPaneWrapper>
								<StyledWrapper>
									<StyledAmountInput
										id="amount"
										type="number"
										{...register("amount", {
											required: "1원 이상의 금액을 입력해주세요.",
											min: {
												value: 1,
												message: "금액은 최소 1원 이상이어야 합니다.",
											},
										})}
										placeholder="비용을 입력해주세요."
									/>
									{errors.amount && <StyledErrorMessage>{errors.amount.message}</StyledErrorMessage>}
								</StyledWrapper>
								<StyledWrapper>
									<StyledMemberSelect
										defaultValue=""
										{...register("member", {
											required: "결제자를 선택해주세요.",
										})}>
										<option value="" disabled>
											누가 결제 했나요?
										</option>
										{tags.map((tag, index) => (
											<option key={index} value={tag}>
												{tag}
											</option>
										))}
									</StyledMemberSelect>
									{errors.member && <StyledErrorMessage>{errors.member.message}</StyledErrorMessage>}
								</StyledWrapper>
							</StyledPaneWrapper>
						</StyledInputWrapper>
					</StyledFormWrapper>

					<FormButton text="추가하기" />
				</StyledForm>
			</StyledExpenseWrapper>
		</OverlayWrapper>
	);
};

export default AddExpenseForm;

const StyledExpenseWrapper = styled.div`
	padding: 20px;

	@media (min-width: 1024px) {
		padding: 60px;
	}
`;

const StyledFormWrapper = styled.div`
	height: 100%;
	display: flex;
	flex-direction: column;
	gap: 10px;

	@media (min-width: 1024px) {
		gap: 30px;
	}
`;

const StyledForm = styled.form`
	display: flex;
	flex-direction: column;
	gap: 10px;

	@media (min-width: 1024px) {
		gap: 30px;
		justify-content: space-between;
	}
`;

const StyledExpenseInput = styled.input`
	outline: none;
	border: 1px solid #e2e8f0;
	border-radius: 5px;
	padding: 10px;
	font-size: 14px;

	@media (min-width: 1024px) {
		padding: 20px;
		font-size: 18px;
	}
`;

const StyledPaneWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	gap: 5px;

	@media (min-width: 1024px) {
		gap: 20px;
	}
`;

const StyledAmountInput = styled.input`
	outline: none;
	border: 1px solid #e2e8f0;
	border-radius: 5px;
	padding: 10px;
	font-size: 14px;

	@media (min-width: 1024px) {
		padding: 20px;
		font-size: 18px;
		margin-top: 15px;
	}
`;

const StyledMemberSelect = styled.select`
	border: 1px solid #e2e8f0;
	border-radius: 5px;
	padding: 10px;
	font-size: 14px;

	@media (min-width: 1024px) {
		padding: 20px;
		font-size: 18px;
		margin-top: 15px;
	}
`;

const StyledWrapper = styled.div`
	width: 50%;
	display: flex;
	flex-direction: column;
`;
