import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import Button from './Button';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const Modal = styled.div`
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  

  ${props => props.styleType === 'minimalist' && css`
    animation: ${fadeIn} 1s forwards;
    opacity: 0; 
  `}
  `

const StyledPortfolio = styled.div`
  grid-area: portfolio;
  li, ul {
    list-style-type: none;
  }
  display: flex;
  

  ${props => props.styleType === 'minimalist' && css`
    flex-direction: column-reverse;
    align-items: flex-start;
    animation: ${fadeIn} 1s forwards 2.6s !important;
    opacity: 0; 
    max-width: 300px;
    border-bottom: 1px solid #000;
    li, ul {
      list-style-type: none;
      padding-left: 0;
    }
    li {
      margin-left: 10px !important;
    }
    .modalContent {
      width: 50%;
      overflow:scroll;
      height: 100%;
    }
    .modalContent img {
      width: 140%;
    }
    @media screen and (max-width: 768px) {
      .modalContent {
        width: 80%;
      }
    }
    @media screen and (max-width: 480px) {
      .modalContent {
        width: 90%;
      }
    }
    @media screen and (max-width: 320px) {
      .modalContent {
        width: 100%;
      }
    }
    .portfolioItemSummary h1, .portfolioItemSummary h2, .portfolioItemSummary h3 {
      margin-left: 15px;
    }

    .portfolioItemSummary p,
.portfolioItemSummary li {
  text-indent: 2em; /* or whatever distance you desire */
}
  `}

  ${props => props.styleType === 'groovy' && `
    /* groovy specific styles */
  `}

  ${props => props.styleType === 'artsy' && `
    /* artsy specific styles */
  `}
`;

function PortfolioItems({ items, style, styleType, commonPortfolioItems }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  console.log(currentItem)
  const handleItemClick = item => {
    setIsModalOpen(true);
    setCurrentItem(item);
  };

  return (
    <StyledPortfolio styleType={styleType}>
      <div className="portfolioItems">
        <ul>
          {items.map((item, index) => (
            <li key={index} onClick={() => handleItemClick(item)}>
              <Button styleType={styleType} target="_blank" rel="noopener noreferrer">
                {item.name}
              </Button>
            </li>
          ))}
          <h3>Projects</h3>
        </ul>
      </div>

      {isModalOpen && (
        <Modal styleType={styleType} onClick={() => setIsModalOpen(false)}>
          <div className="modalContent portfolioItemSummary"> 
            <currentItem.Content />
          </div>
        </Modal>
      )}
    </StyledPortfolio>
  );
}

export default PortfolioItems;