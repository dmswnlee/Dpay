import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import LoadingSpinner from "./shared/LoadingSpinner";
import { Navigate, Outlet } from "react-router-dom";

const RequireAuth = () => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

	useEffect(() => {
		const checkAuth = async () => {
			const { data } = await supabase.auth.getSession();
			setIsAuthenticated(!!data.session);
		};
		checkAuth();
	}, []);

	if (isAuthenticated === null) return <LoadingSpinner />;

	return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default RequireAuth;
