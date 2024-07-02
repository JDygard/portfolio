import styled, { css } from 'styled-components';

const ImageContainer = styled.div`
  grid-area: pic;
  width: ${props => props.theme.profilePicture.width};
  height: ${props => props.theme.profilePicture.height};

  ${props => props.theme.name === "minimalist" && css`
  overflow: visible;
    @keyframes draw {
      to {
        stroke-dashoffset: 0;
      }
    }
    display:block;
    
    .face_svg__cls-1 {
      animation: draw 4s forwards;
      transform: scale(1.2);
      transform-origin: top;
    }
    
    .face_svg__cls-1:nth-child(1) {
      animation-delay: 0s;
    }
    
    .face_svg__cls-1:nth-child(2) {
      animation-delay: 1s;
    }
    
    .face_svg__cls-1:nth-child(3) {
      animation-delay: 2s;
    }
  `}

  svg {
    width: ${props => props.theme.profilePicture.svgWidth};
    height: ${props => props.theme.profilePicture.svgHeight};
  }
`;


function ProfilePicture({ SvgComponent, style, styleType }) {
  return (
    <ImageContainer styleType={styleType} >
      <div style={style} id="profilePicture">
        <SvgComponent alt="Developer's Profile" />
      </div>
    </ImageContainer>
  );
}

export default ProfilePicture;
