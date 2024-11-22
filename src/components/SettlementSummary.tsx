import styled from "styled-components";
import OverlayWrapper from "./shared/OverlayWrapper";
import { HiDownload } from "react-icons/hi";
import { useEffect, useRef } from "react";
import { useExpenseStore } from "../store/useExpenseStore";
import { useGroupStore } from "../store/useGroupStore";
import { toPng } from "html-to-image";
import { supabase } from '../supabaseClient';
import { useParams } from 'react-router-dom';
import { useResponsiveOverlay } from '../hooks/useResponsiveOverlay';
import { FormatNumber } from './shared/FormatNumber';
import { CalculateMinimumTransaction } from './CalculateMinimumTransaction';

const SettlementSummary = () => {
	const wrapperElement = useRef<HTMLDivElement>(null);
	const { expenses } = useExpenseStore();
	const { tags } = useGroupStore();
	const members = tags.length > 0 ? tags : [];
	const { groupId } = useParams<{ groupId: string }>();
	const { overlayWidth, overlayHeight } = useResponsiveOverlay(
		{ base: "90vw", md: "50vw", lg: "50vh" }, 
    { base: "0", lg: "50vh" } 
  );

	const totalExpenseAmount = expenses.reduce((prevAmount, curExpense) => prevAmount + Number(curExpense.amount), 0);
	const groupMembersCount = members ? members.length : 0;
	const splitAmount = Math.floor(totalExpenseAmount / groupMembersCount / 10) * 10;

	const minimumTransaction = CalculateMinimumTransaction(expenses, members, splitAmount);

	const saveSettlementResult = async () => {
		try {
			const { data, error } = await supabase
				.from("settlement")
				.upsert(
					[
						{
							group_id: groupId,
							total_expense: totalExpenseAmount,
							amount_per_person: splitAmount,
						},
					],
					{ onConflict: "group_id" }
				);

			if (error) throw error;
			console.log("정산 결과가 저장되었습니다:", data);
		} catch (error) {
			console.error("정산 결과 저장 중 오류 발생:", error);
		}
	};

	useEffect(() => {
		if (totalExpenseAmount > 0 && groupMembersCount > 0) {
			saveSettlementResult();
		}
	}, [totalExpenseAmount, splitAmount]);

	const exportToImage = () => {
		if (wrapperElement.current === null) {
			return;
		}

		toPng(wrapperElement.current, {
			filter: node => node.tagName !== "BUTTON",
		})
			.then(dataURL => {
				const link = document.createElement("a");
				link.href = dataURL;
				link.download = "settlement-summary.png";
				link.click();
			})
			.catch(err => {
				console.error("이미지를 다운로드하는 중 오류가 발생했습니다:", err);
			});
	};

	return (
		<StyledContainer ref={wrapperElement}>
			<OverlayWrapper width={overlayWidth} minHeight={overlayHeight}>
				<StyledSettlementWrapper>
					<StyledTitle>정산 결과</StyledTitle>
					{totalExpenseAmount > 0 && groupMembersCount > 0 && (
						<StyledWrapper>
							<span>멤버 수: {groupMembersCount}명</span>
							<span>총 지출 금액 : {FormatNumber(totalExpenseAmount)}원</span>
							<span>한 사람당 지출 금액 : {FormatNumber(splitAmount)}원</span>
							<StyledDivider></StyledDivider>
							<StyledUl>
								{minimumTransaction.map(({ sender, receiver, amount }, index) => (
									<StyledLi key={`transaction-${index}`}>
										<span>
											{sender}(이)가 {receiver}에게 {FormatNumber(amount)}원 보내기
										</span>
									</StyledLi>
								))}
							</StyledUl>
						</StyledWrapper>
					)}
					<StyledButton data-testid="btn-download" onClick={exportToImage}>
						<HiDownload />
					</StyledButton>
				</StyledSettlementWrapper>
			</OverlayWrapper>
		</StyledContainer>
	);
};

export default SettlementSummary;

const StyledContainer = styled.div`
	margin-top: 20px;
	position: relative;

	@media (min-width: 768px) {
		margin-top: 0;
	}

	@media (min-width: 1024px) {
		margin-top: 20px;
	}
`;

const StyledSettlementWrapper = styled.div`
	padding: 20px;

	@media (min-width: 1024px) {
		padding: 60px;
	}
`;

const StyledTitle = styled.p`
	font-size: 20px;
	text-align: center;

	@media (min-width: 1024px) {
		font-size: 24px;
	}
`;

const StyledWrapper = styled.div`
	display: flex;
	flex-direction: column;
	font-size: 16px;
	gap: 10px;
	margin-top: 20px;

	@media (min-width: 1024px) {
		font-size: 20px;
		gap: 20px;
		margin-top: 30px;
	}
`;

const StyledDivider = styled.div`
	width: 100%;
	height: 1px;
	background-color: #e2e8f0;
`;

const StyledUl = styled.ul`
	padding: 0 20px;
	font-weight: 600;

	list-style-type: disclosure-closed;
	li::marker {
		animation: blinker 1.5s linear infinite;
	}

	@keyframes blinker {
		50% {
			opacity: 0;
		}
	}
`;

const StyledLi = styled.li`
	margin-top: 10px;

	@media (min-width: 1024px) {
		margin-top: 20px;
	}
`;

const StyledButton = styled.button`
	background: none;
	border: none;
	font-size: 20px;
	position: absolute;
	bottom: 15px;
	right: 15px;
	cursor: pointer;

	&:hover,
	&:active {
		background: none;
		color: #3d8bfd;
	}

	@media (min-width: 1024px) {
		font-size: 24px;
	}
`;
