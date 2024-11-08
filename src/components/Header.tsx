import styled from "styled-components";
import logo from "../assets/logo.png";
import { StyledLogo } from "../pages/Login";
import { FaHome } from "react-icons/fa";
import { LuLogIn, LuLogOut } from "react-icons/lu";
import { FaRegCircleUser } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { useEffect } from "react";

const Header = () => {
	const { session, initializeSession, logout } = useAuthStore();
	const navigate = useNavigate();

	useEffect(() => {
		initializeSession();
	}, [initializeSession]);

	const handleLogout = async () => {
		await logout();
		navigate("/");
	};

	return (
		<StyledHeaderContainer>
			<StyledHeaderWrapper>
				<Link to="/">
					<StyledLogo src={logo} alt="로고" />
				</Link>
				<div>
					<StyledMenu>
						<StyledMenuItem to="/">
							<FaHome />
							<li>Home</li>
						</StyledMenuItem>
						{session ? (
							<>
								<StyledLogout onClick={handleLogout}>
									<LuLogOut />
									<li>Logout</li>
								</StyledLogout>
								<StyledMenuItem to="/mypage">
									<FaRegCircleUser />
									<li>MyPage</li>
								</StyledMenuItem>
							</>
						) : (
							<StyledMenuItem to="/login">
								<LuLogIn />
								<li>Login</li>
							</StyledMenuItem>
						)}
					</StyledMenu>
				</div>
			</StyledHeaderWrapper>
		</StyledHeaderContainer>
	);
};

export default Header;

const StyledHeaderContainer = styled.div`
	width: 100%;
	background-color: #ffffff;
	padding: 20px;
	display: flex;
	justify-content: center;
`;

const StyledHeaderWrapper = styled.div`
	width: 100%;
	max-width: 1400px;
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const StyledMenu = styled.ul`
	list-style: none;
	display: flex;
	gap: 20px;
	font-size: 20px;
`;

const StyledMenuItem = styled(Link)`
	text-decoration: none;
	color: inherit;
	display: flex;
	align-items: center;
	gap: 10px;
	cursor: pointer;
	li {
		display: none;
	}

	li {
		@media (min-width: 1024px) {
			display: block;
		}
	}
`;

const StyledLogout = styled.div`
	display: flex;
	align-items: center;
	gap: 10px;
	cursor: pointer;
	li {
		display: none;
	}

	li {
		@media (min-width: 1024px) {
			display: block;
		}
	}
`;
