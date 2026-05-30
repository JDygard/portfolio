import React, { useCallback, useLayoutEffect, useRef } from 'react';
import styled from 'styled-components';
// Components
import TitleBar from './components/TitleBar';
import ProfilePicture from './components/ProfilePicture';
import PersonalDetails from './components/PersonalDetails';
import PortfolioItems from './components/PortfolioItems';
import ContactLinks from './components/ContactLinks';
import Skills from './components/Skills';
// Content
import { skillsCommon, minimalistContent, professionalContent, technicalContent } from './helpers/content';
import { GlobalStyles } from './GlobalStyles';
import { defaultTheme, getPortfolioStyle, portfolioStyles } from './styleTypes';
import { ThemeProvider } from 'styled-components';

const contentByStyle = {
  minimalist: minimalistContent,
  professional: professionalContent,
  technical: technicalContent,
};

const TWEEN_DURATION = 720;
const getTheme = (props) => props.theme?.content ? props.theme : defaultTheme;

const captureTweenRects = (root) => {
  if (!root) {
    return {};
  }

  return Array.from(root.querySelectorAll('[data-tween-id]')).reduce((rects, element) => {
    rects[element.dataset.tweenId] = element.getBoundingClientRect();
    return rects;
  }, {});
};

const Content = styled.main`
  min-height: ${props => getTheme(props).content.minHeight};
  width: min(100%, ${props => getTheme(props).content.maxWidth});
  box-sizing: border-box;
  transition: background-color 0.3s ease, color 0.3s ease;
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: ${props => getTheme(props).content.gap};
  row-gap: ${props => getTheme(props).content.rowGap};
  align-items: ${props => getTheme(props).content.alignItems};
  margin: 0 auto;
  padding: ${props => getTheme(props).content.padding};
  background-color: ${props => getTheme(props).primaryColor};
  color: ${props => getTheme(props).secondaryColor};
  background-image: ${props => getTheme(props).background};
  background-size: ${props => getTheme(props).content.backgroundSize};
  font-family: ${props => getTheme(props).primaryFont};
  grid-template-areas: ${props => getTheme(props).gridTemplate};
  position: relative;
  overflow: ${props => getTheme(props).content.overflow};

  figure {
    margin-right: 15px;
  }

  figcaption {
    font-size: 0.8rem;
    color: ${props => getTheme(props).mutedColor};
    text-align: center;
  }

  a {
    color: inherit;
  }

  h1,
  h2,
  h3,
  p {
    margin-top: 0;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-areas: ${props => getTheme(props).mobileGridTemplate};
    padding: 82px 18px 32px;
    min-height: auto;
    gap: 18px;
  }
`;


function PortfolioContent({ styleType, onSelectStyle }) {
  const selectedStyle = getPortfolioStyle(styleType);
  const profileContent = contentByStyle[selectedStyle.id] || minimalistContent;
  const contentRef = useRef(null);
  const previousRectsRef = useRef(null);
  const activeTweensRef = useRef(new Map());

  const handleSelectStyle = useCallback((nextStyle) => {
    if (nextStyle === selectedStyle.id) {
      return;
    }

    previousRectsRef.current = captureTweenRects(contentRef.current);
    onSelectStyle(nextStyle);
  }, [onSelectStyle, selectedStyle.id]);

  useLayoutEffect(() => {
    const previousRects = previousRectsRef.current;

    if (!previousRects || !contentRef.current) {
      return;
    }

    previousRectsRef.current = null;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const elements = Array.from(contentRef.current.querySelectorAll('[data-tween-id]'));

    elements.forEach((element) => {
      const previousRect = previousRects[element.dataset.tweenId];

      if (!previousRect) {
        return;
      }

      const activeTween = activeTweensRef.current.get(element);
      if (activeTween) {
        activeTween.cancel();
      }

      const nextRect = element.getBoundingClientRect();
      const deltaX = previousRect.left - nextRect.left;
      const deltaY = previousRect.top - nextRect.top;
      const scaleX = previousRect.width && nextRect.width ? previousRect.width / nextRect.width : 1;
      const scaleY = previousRect.height && nextRect.height ? previousRect.height / nextRect.height : 1;
      const moved = Math.abs(deltaX) > 0.5 || Math.abs(deltaY) > 0.5;
      const resized = Math.abs(scaleX - 1) > 0.01 || Math.abs(scaleY - 1) > 0.01;

      if (!moved && !resized) {
        return;
      }

      element.style.transformOrigin = 'top left';

      const tween = element.animate([
        { transform: `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})` },
        { transform: 'translate(0, 0) scale(1, 1)' },
      ], {
        duration: TWEEN_DURATION,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        fill: 'both',
      });

      activeTweensRef.current.set(element, tween);

      tween.onfinish = () => {
        activeTweensRef.current.delete(element);
      };

      tween.oncancel = () => {
        activeTweensRef.current.delete(element);
      };
    });
  }, [styleType]);

  return (
    <ThemeProvider theme={selectedStyle.theme}>
      <GlobalStyles />
      <div>
        <TitleBar styles={portfolioStyles} styleType={selectedStyle.id} onSelect={handleSelectStyle} />
        <Content ref={contentRef}>
          <ProfilePicture SvgComponent={profileContent.SvgComponent} />

          <PersonalDetails
            name={profileContent.personalDetails.name}
            role={profileContent.personalDetails.role}
            about={profileContent.personalDetails.about}
          />

          <Skills skillSet={skillsCommon} />

          <ContactLinks links={profileContent.contactLinks} />

          <PortfolioItems items={profileContent.portfolioItems} />
        </Content>
      </div>
    </ThemeProvider>
  );
}

export default PortfolioContent;
