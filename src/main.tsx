import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./UI/RootLayout.tsx";
import Home from "./pages/Home.tsx";
import Signup from "./pages/Signup.tsx";
import Login from "./pages/Login.tsx";
import CreateGroup from "./pages/CreateGroup.tsx";
import ExpenseMain from "./pages/ExpenseMain.tsx";
import MyPage from "./pages/MyPage.tsx";
import NotFound from "./components/NotFound.tsx";

const router = createBrowserRouter([
	{
		path: "/",
		element: <RootLayout />,
		children: [
			{ index: true, element: <Home /> },
			{ path: "signup", element: <Signup /> },
			{ path: "login", element: <Login /> },
			{ path: "create", element: <CreateGroup /> },
			{ path: "expense", element: <ExpenseMain /> },
			{ path: "mypage", element: <MyPage /> },
			{ path: "*", element: <NotFound /> },
		],
	},
]);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>,
);
