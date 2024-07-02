import styled from 'styled-components';

const StyledButton = styled.a`
  display: inline-block;
  text-decoration: none;
  transition: background-color 0.3s, color 0.3s;

  /* Default Styles */
  background-color: #ddd;
  color: black;

  ${props => props.styleType === 'minimalist' && `
    background-color: #ececec;
    border-right: 1px solid black;
    border-left: 1px solid black;
    justify-content: center;
    width:auto;
    color: black;
    padding: 5px 16px;
    margin: 5px;
    border-radius: 5px;
    &:hover {
      opacity: 0.8;
      background-color: white;
      pointer: pointer;
    }
  `}

  ${props => props.styleType === 'groovy' && `
    background-color: purple;
    color: gold;
  `}

  ${props => props.styleType === 'artsy' && `
    background-color: pink;
    color: navy;
  `}

`;

function Button({ href, children, style, styleType }) {
  return <StyledButton href={href} style={style} styleType={styleType}>{children}</StyledButton>;
}

export default Button;
