import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import Button from './Button';
import { defaultTheme } from '../styleTypes';

const getTheme = (props) => props.theme?.portfolio ? props.theme : defaultTheme;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Modal = styled.div`
  position: fixed;
  z-index: 1000;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: ${props => getTheme(props).modal.overlayBackground};
  opacity: 0;
  animation: ${fadeIn} 0.22s ease forwards;
`;

const ModalContent = styled.div`
  position: relative;
  width: ${props => getTheme(props).modal.contentWidth};
  height: ${props => getTheme(props).modal.contentHeight};
  padding: 32px;
  overflow: auto;
  background: ${props => getTheme(props).modal.contentBackground};
  color: ${props => getTheme(props).modal.contentColor};
  border: ${props => getTheme(props).modal.border};
  border-radius: ${props => getTheme(props).modal.borderRadius};
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.38);

  h1,
  h2,
  h3 {
    color: ${props => getTheme(props).accentColor};
  }

  img {
    max-width: 100%;
    height: auto;
  }

  figure {
    max-width: 100%;
  }

  @media (max-width: 768px) {
    padding: 22px;
  }
`;

const CloseButton = styled.button`
  position: sticky;
  top: 0;
  float: right;
  min-width: 36px;
  min-height: 36px;
  margin: -18px -18px 10px 12px;
  border: ${props => getTheme(props).button.border};
  border-radius: ${props => getTheme(props).button.borderRadius};
  background: ${props => getTheme(props).button.background};
  color: ${props => getTheme(props).button.color};
  cursor: pointer;
  font-weight: 700;

  &:hover {
    background: ${props => getTheme(props).button.hoverBackground};
    color: ${props => getTheme(props).button.hoverColor};
  }

  &:focus-visible {
    outline: 2px solid ${props => getTheme(props).accentColor};
    outline-offset: 2px;
  }
`;

const StyledPortfolio = styled.section`
  grid-area: portfolio;
  justify-self: ${props => getTheme(props).portfolio.justifySelf};
  align-self: ${props => getTheme(props).portfolio.alignSelf};
  display: flex;
  flex-direction: ${props => getTheme(props).portfolio.flexDirection};
  width: 100%;
  max-width: ${props => getTheme(props).portfolio.maxWidth};
  padding: ${props => getTheme(props).section.padding};
  background: ${props => getTheme(props).section.background};
  border: ${props => getTheme(props).section.border};
  border-bottom: ${props => getTheme(props).portfolio.borderBottom};
  border-radius: ${props => getTheme(props).section.borderRadius};
  box-shadow: ${props => getTheme(props).section.boxShadow};
  text-align: ${props => getTheme(props).portfolio.textAlign};
  transition: background-color 0.45s ease, border-color 0.45s ease, border-radius 0.45s ease, box-shadow 0.45s ease, color 0.45s ease;

  h3 {
    margin: 0 0 12px;
    color: ${props => getTheme(props).accentColor};
    font-size: ${props => getTheme(props).portfolio.headingSize};
    font-weight: 700;
    text-transform: ${props => getTheme(props).name === 'minimalist' ? 'none' : 'uppercase'};
  }

  ul {
    display: flex;
    flex-wrap: wrap;
    gap: ${props => getTheme(props).name === 'technical' ? '7px' : '0'};
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    display: ${props => getTheme(props).portfolio.itemDisplay};
  }

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

function PortfolioItems({ items }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  useEffect(() => {
    if (!isModalOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  const handleItemClick = (item) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <StyledPortfolio data-tween-id="projects" aria-labelledby="projects-heading">
      <div className="portfolioItems">
        <h3 id="projects-heading">Projects</h3>
        <ul>
          {items.map((item) => (
            <li key={item.name}>
              <Button onClick={() => handleItemClick(item)}>
                {item.name}
              </Button>
            </li>
          ))}
        </ul>
      </div>

      {isModalOpen && currentItem && (
        <Modal onClick={closeModal} role="presentation">
          <ModalContent
            role="dialog"
            aria-modal="true"
            aria-label={currentItem.name}
            onClick={(event) => event.stopPropagation()}
          >
            <CloseButton type="button" onClick={closeModal} aria-label="Close project">
              X
            </CloseButton>
            <currentItem.Content />
          </ModalContent>
        </Modal>
      )}
    </StyledPortfolio>
  );
}

export default PortfolioItems;
