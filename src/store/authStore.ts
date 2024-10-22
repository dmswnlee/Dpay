import { create } from "zustand";
import { supabase } from "../supabaseClient";
import { Session } from '@supabase/supabase-js';

interface AuthState {
  session: Session | null; 
  setSession: (session: Session | null) => void; 
  initializeSession: () => Promise<void>; 
  logout: () => Promise<void>; 
}

const useAuthStore = create<AuthState>((set) => ({
	session: null,
	setSession: session => set({ session }),
	initializeSession: async () => {
		const { data } = await supabase.auth.getSession();
		set({ session: data.session });

		supabase.auth.onAuthStateChange((_event, session) => {
			set({ session });
		});

	},

	logout: async () => {
		await supabase.auth.signOut();
		set({ session: null });
	},
}));

export default useAuthStore;
