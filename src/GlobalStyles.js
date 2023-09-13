import { createGlobalStyle } from 'styled-components';
import montserratRegular from './fonts/minimalist/Montserrat-Regular.otf';
import montserratLight from './fonts/minimalist/Montserrat-Light.otf';
import montserratSemiBold from './fonts/minimalist/Montserrat-SemiBold.otf';
import montserratMedium from './fonts/minimalist/Montserrat-Medium.otf';
import montserratThin from './fonts/minimalist/Montserrat-Thin.otf';
export const GlobalStyles = createGlobalStyle`

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
    transition: all 0.3s ease;

    ${({ styleType }) => {
      if (styleType === "minimalist") {
        return `
          background-color: #fbf8f2;
          color: #505564;
        `;
      } else if (styleType === "groovy") {
        return `
          background-color: purple;
          color: gold;
        `;
      } else if (styleType === "artsy") {
        return `
          background-color: pink;
          color: navy;
        `;
      }
    }}
  }
`;
