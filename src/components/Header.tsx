import styled from "styled-components";
import logo from "../assets/logo.png";
import { StyledLogo } from "../pages/Login";
import { FaHome } from "react-icons/fa";
import { LuLogIn } from "react-icons/lu";
import { Link } from "react-router-dom";

const Header = () => {
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
						<StyledMenuItem to="/login">
							<LuLogIn />
							<li>Login</li>
						</StyledMenuItem>
					</StyledMenu>
				</div>
			</StyledHeaderWrapper>
		</StyledHeaderContainer>
	);
};

export default Header;

const StyledHeaderContainer = styled.div`
	width: 100vw;
	background-color: #ffffff;
	padding: 10px;
	display: flex;
	justify-content: center;
`;

const StyledHeaderWrapper = styled.div`
	width: 80%;
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
`;
