import styled from 'styled-components';
import { defaultTheme } from '../styleTypes';

const getTheme = (props) => props.theme?.button ? props.theme : defaultTheme;

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: auto;
  min-height: 34px;
  text-decoration: none;
  background: ${props => getTheme(props).button.background};
  color: ${props => getTheme(props).button.color};
  border: ${props => getTheme(props).button.border};
  border-left: ${props => getTheme(props).button.borderLeft};
  border-right: ${props => getTheme(props).button.borderRight};
  border-radius: ${props => getTheme(props).button.borderRadius};
  padding: ${props => getTheme(props).button.padding};
  margin: ${props => getTheme(props).button.margin};
  font-weight: ${props => getTheme(props).button.fontWeight};
  text-transform: ${props => getTheme(props).button.textTransform};
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;

  &:hover {
    background: ${props => getTheme(props).button.hoverBackground};
    color: ${props => getTheme(props).button.hoverColor};
  }

  &:active {
    transform: translateY(1px);
  }

  &:focus-visible {
    outline: 2px solid ${props => getTheme(props).accentColor};
    outline-offset: 2px;
  }
`;

function Button({ href, children, style, ...props }) {
  const as = href ? 'a' : 'button';

  return (
    <StyledButton
      as={as}
      href={href}
      style={style}
      type={href ? undefined : 'button'}
      {...props}
    >
      {children}
    </StyledButton>
  );
}

export default Button;
