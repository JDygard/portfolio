import { createGlobalStyle } from 'styled-components';
import { defaultTheme } from './styleTypes';
import montserratRegular from './fonts/minimalist/Montserrat-Regular.otf';
import montserratLight from './fonts/minimalist/Montserrat-Light.otf';
import montserratSemiBold from './fonts/minimalist/Montserrat-SemiBold.otf';
import montserratMedium from './fonts/minimalist/Montserrat-Medium.otf';
import montserratThin from './fonts/minimalist/Montserrat-Thin.otf';

const getTheme = (props) => props.theme?.bodyBackground ? props.theme : defaultTheme;

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
  }


  @font-face {
    font-family: 'Montserrat';
    src: url(${montserratRegular}) format('opentype');
    font-weight: normal;
    font-style: normal;
  }
   @font-face {
    font-family: 'Montserrat-Light';
    src: url(${montserratLight}) format('opentype');
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: 'Montserrat-SemiBold';
    src: url(${montserratSemiBold}) format('opentype');
    font-weight: normal;
    font-style: normal;
  }
  @font-face {
    font-family: 'Montserrat-Medium';
    src: url(${montserratMedium}) format('opentype');
    font-weight: normal;
    font-style: normal;
  }
  @font-face {
    font-family: 'Montserrat-Thin';
    src: url(${montserratThin}) format('opentype');
    font-weight: normal;
    font-style: normal;
  }


  body {
    margin: 0;
    min-height: 100vh;
    background-color: ${props => getTheme(props).bodyBackground};
    color: ${props => getTheme(props).secondaryColor};
    font-family: ${props => getTheme(props).primaryFont};
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  button,
  input,
  select,
  textarea {
    font: inherit;
  }

  button {
    appearance: none;
  }

  img,
  svg {
    max-width: 100%;
  }

  [data-tween-id] {
    transform-origin: top left;
    will-change: transform;
  }
`;
