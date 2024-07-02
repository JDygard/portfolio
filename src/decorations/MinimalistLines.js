import React from 'react';
import styled, { keyframes } from 'styled-components';

const drawIn = keyframes`
  to {
    stroke-dashoffset: 0;
    opacity: 1;
  }
`;

const StyledLine = styled.line`
  stroke-dasharray: 20;
  stroke-dashoffset: 20;
  opacity: 0;
  animation: ${drawIn} 2s forwards 2s;
`;

const MinimalistLines = (props) => {
    const { x1, y1, x2, y2 } = props;
  
    return (
      <svg style={{position: "absolute", overflow: "visible"}} width="400" height="10" xmlns="http://www.w3.org/2000/svg">
        <StyledLine x1={x1} y1={y1} x2={x2} y2={y2} stroke="black" strokeWidth="2"/>
      </svg>
    );
  };
  

export default MinimalistLines;
