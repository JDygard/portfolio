import styled, { css } from 'styled-components';

const ImageContainer = styled.div`
  grid-area: pic;
  width: ${props => props.theme.profilePicture.width};
  height: ${props => props.theme.profilePicture.height};

  ${props => props.theme.name === "minimalist" && css`
    @keyframes draw {
      to {
        stroke-dashoffset: 0;
      }
    }

    .face_svg__cls-1 {
      animation: draw 4s forwards;
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


function ProfilePicture({ SvgComponent, style }) {
  return (
    <ImageContainer>
      <div style={style} id="profilePicture">
        <SvgComponent alt="Developer's Profile" />
      </div>
    </ImageContainer>
  );
}

export default ProfilePicture;
