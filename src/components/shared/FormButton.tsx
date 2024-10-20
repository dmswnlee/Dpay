import styled from "styled-components";

interface FormButtonProps {
	name: string;
}

const FormButton = ({ name }: FormButtonProps) => {
	return <StyledButton>{name}</StyledButton>;
};

export default FormButton;

const StyledButton = styled.button`
	outline: none;
	border: none;
	width: 100%;
	height: 60px;
	background-color: #3d8bfd;
	border-radius: 5px;
	color: #ffffff;
	font-size: 18px;
	cursor: pointer;
	&:hover {
		filter: brightness(0.8);
	}
`;
