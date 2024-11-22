import { Expense, Transaction } from '../types/expense';
import { Member } from '../types/group';

export const CalculateMinimumTransaction = (
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