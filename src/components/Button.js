import styled from 'styled-components';

const StyledButton = styled.a`
  display: inline-block;
  padding: 8px 16px;
  margin: 5px;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s, color 0.3s;

  /* Default Styles */
  background-color: #ddd;
  color: black;

  ${props => props.styleType === 'minimalist' && `
    background-color: white;
    border: 1px solid black;
    color: black;
  `}

  ${props => props.styleType === 'groovy' && `
    background-color: purple;
    color: gold;
  `}

  ${props => props.styleType === 'artsy' && `
    background-color: pink;
    color: navy;
  `}

  &:hover {
    opacity: 0.8;
  }
`;

function Button({ href, children, style, styleType }) {
  return <StyledButton href={href} style={style} styleType={styleType}>{children}</StyledButton>;
}

export default Button;
