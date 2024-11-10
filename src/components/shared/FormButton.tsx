import styled from "styled-components";

interface FormButtonProps {
	text: string;
	onClick?: () => void;
}

const FormButton = ({ text, onClick }: FormButtonProps) => {
	return <StyledButton onClick={onClick}>{text}</StyledButton>;
};

export default FormButton;

const StyledButton = styled.button`
	outline: none;
	border: none;
	width: 100%;
	height: 40px;
	background-color: #3d8bfd;
	border-radius: 5px;
	color: #ffffff;
	font-size: 14px;
	cursor: pointer;
	&:hover {
		filter: brightness(0.8);
	}

	@media (min-width: 768px) {
		height: 60px;
		font-size: 18px;
	}
`;
