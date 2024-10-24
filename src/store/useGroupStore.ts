import { create } from "zustand";

interface GroupState {
	groupName: string;
	tags: string[];
	startDate: string;
	endDate: string;
	setGroupName: (name: string) => void;
	addTag: (tag: string) => void;
	removeTag: (tag: string) => void;
	setStartDate: (date: string) => void;
	setEndDate: (date: string) => void;
}

export const useGroupStore = create<GroupState>(set => ({
	groupName: "",
	tags: [],
	startDate: "",
	endDate: "",
	setGroupName: name => set({ groupName: name }),
	addTag: tag => set(state => ({ tags: [...state.tags, tag] })),
	removeTag: tagToRemove => set(state => ({ tags: state.tags.filter(tag => tag !== tagToRemove) })),
	setStartDate: date => set({ startDate: date }),
	setEndDate: date => set({ endDate: date }),
}));
