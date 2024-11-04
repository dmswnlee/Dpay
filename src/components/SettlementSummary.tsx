import styled from "styled-components";
import OverlayWrapper from "./shared/OverlayWrapper";
import { HiDownload } from "react-icons/hi";
import { useRef } from "react";
import { useExpenseStore } from "../store/useExpenseStore";
import { useGroupStore } from "../store/useGroupStore";
import { toPng } from "html-to-image";

interface Expense {
	member: string;
	amount: number;
}

type Member = string;

interface Transaction {
	receiver: string;
	sender: string;
	amount: number;
}

export const calculateMinimumTransaction = (
	expenses: Expense[],
	members: Member[],
	amountPerson: number,
): Transaction[] => {
	const minTransactions: Transaction[] = [];

	if (amountPerson === 0) {
		return minTransactions;
	}

	const membersToPay: Record<Member, number> = {};
	members.forEach(member => {
		membersToPay[member] = amountPerson;
	});

	expenses.forEach(({ member, amount }) => {
		membersToPay[member] -= amount;
	});

	const sortedMembersToPay = Object.keys(membersToPay)
		.map(member => ({
			member: member,
			amount: membersToPay[member],
		}))
		.sort((a, b) => a.amount - b.amount);

	var left = 0;
	var right = sortedMembersToPay.length - 1;
	while (left < right) {
		while (left < right && sortedMembersToPay[left].amount === 0) {
			left++;
		}
		while (left > right && sortedMembersToPay[right].amount === 0) {
			right--;
		}

		const toReceive = sortedMembersToPay[left];
		const toSend = sortedMembersToPay[right];
		const amountToReceive = Math.abs(toReceive.amount);
		const amountToSend = Math.abs(toSend.amount);

		if (amountToSend > amountToReceive) {
			minTransactions.push({
				receiver: toReceive.member,
				sender: toSend.member,
				amount: Math.floor(amountToReceive / 10) * 10,
			});
			toReceive.amount = 0;
			toSend.amount -= amountToReceive;
			left++;
		} else {
			minTransactions.push({
				receiver: toReceive.member,
				sender: toSend.member,
				amount: Math.floor(amountToSend / 10) * 10,
			});
			toSend.amount = 0;
			toReceive.amount += amountToSend;
			right--;
		}
	}

	return minTransactions;
};

const SettlementSummary = () => {
	const wrapperElement = useRef<HTMLDivElement>(null);
	const { expenses } = useExpenseStore();
	const { tags } = useGroupStore();
	const members = tags.length > 0 ? tags : [];

	const totalExpenseAmount =
		Math.floor(expenses.reduce((prevAmount, curExpense) => prevAmount + curExpense.amount, 0) / 10) * 10;
	const groupMembersCount = members ? members.length : 0;
	const splitAmount = Math.floor(totalExpenseAmount / groupMembersCount / 10) * 10;

	const minimumTransaction = calculateMinimumTransaction(expenses, members, splitAmount);

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
			<OverlayWrapper minHeight="50vh">
				<StyledTitle>정산 결과</StyledTitle>
				{totalExpenseAmount > 0 && groupMembersCount > 0 && (
					<StyledWrapper>
						<span>멤버 수: {groupMembersCount}명</span>
						<span>총 지출 금액 : {totalExpenseAmount}원</span>
						<span>한 사람당 지출 금액 : {splitAmount}원</span>
						<StyledDivider></StyledDivider>
						<StyledUl>
							{minimumTransaction.map(({ sender, receiver, amount }, index) => (
								<StyledLi key={`transaction-${index}`}>
									<span>
										{sender}(이)가 {receiver}에게 {amount}원 보내기
									</span>
								</StyledLi>
							))}
						</StyledUl>
					</StyledWrapper>
				)}
				<StyledButton data-testid="btn-download" onClick={exportToImage}>
					<HiDownload />
				</StyledButton>
			</OverlayWrapper>
		</StyledContainer>
	);
};

export default SettlementSummary;

const StyledContainer = styled.div`
	margin-top: 20px;
	position: relative;
`;

const StyledWrapper = styled.div`
	display: flex;
	flex-direction: column;
	font-size: 20px;
	gap: 20px;
	margin-top: 30px;
`;

const StyledTitle = styled.p`
	margin: 0;
	font-size: 24px;
	text-align: center;
`;

const StyledButton = styled.button`
	background: none;
	border: none;
	font-size: 25px;
	position: absolute;
	bottom: 15px;
	right: 15px;
	cursor: pointer;

	&:hover,
	&:active {
		background: none;
		color: #3d8bfd;
	}
`;

const StyledDivider = styled.div`
	width: 100%;
	height: 1px;
	background-color: #e2e8f0;
`;

const StyledUl = styled.ul`
	padding: 0 20px;
	margin: 0;
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
	margin-top: 20px;
`;
