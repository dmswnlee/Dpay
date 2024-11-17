import { create } from "zustand";
import { supabase } from "../supabaseClient";
import { Session } from '@supabase/supabase-js';

interface AuthState {
  session: Session | null; 
	isSessionInitialized: boolean;
  setSession: (session: Session | null) => void; 
  initializeSession: () => Promise<void>; 
  logout: () => Promise<void>; 
}

const useAuthStore = create<AuthState>((set) => ({
	session: null,
	isSessionInitialized: false,
	setSession: session => set({ session }),
	initializeSession: async () => {
		const { data } = await supabase.auth.getSession();
		set({ session: data.session, isSessionInitialized: true });

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
