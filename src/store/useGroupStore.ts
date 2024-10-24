import { create } from "zustand";

interface GroupState {
	groupName: string;
  tags: string[];
  date: string;
  setGroupName: (name: string) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  setDate: (date: string) => void;
}

export const useGroupStore = create<GroupState>(set => ({
	groupName: "",
  tags: [],
  date: "",
  setGroupName: (name) => set({ groupName: name }),
  addTag: (tag) => set((state) => ({ tags: [...state.tags, tag] })),
  removeTag: (tagToRemove) =>
    set((state) => ({ tags: state.tags.filter((tag) => tag !== tagToRemove) })),
  setDate: (date) => set({ date }),
}));
