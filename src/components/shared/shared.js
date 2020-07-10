import React from 'react';
import styled from 'styled-components';


// Elements for Jumbotron Styline - start
const JumboContainer = styled.div`
  background: url(${props => props.url});
  background-repeat: no-repeat;
  background-position: 25% 25%;
  background-size: 100%;
  position: relative;
  height: ${props => props.height};
`;

const JumboFirstOverlay = styled.div`
  background: ${props => props.theme.color.landingGradient};
  height: ${props => props.height};
  z-index: 2;
`;

const JumboSecondOverlay = styled.div`
  background: ${props => props.theme.color.darkOverlay};
  height: ${props => props.height};
  z-index: 3;
`;

const RainbowStrip = styled.div`
  background: ${props => props.theme.color.largeBorderGradient};
  width: 100%;
  height: 5px;
  position: absolute;
`;

const JumboTitle = styled.h1`
  color: white;
  font-size: 4em;
  font-family: 'Lato', sans-serif;
  text-align: center;
  font-weight: 200;
`;

const JumboTitleContainer = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Container for mood tags

export const MoodContainer = styled.div`
  display: flex;
  align-items: center;
`;

// Container for any page with a siebar (single track, /music, /checkout)
export const SideBarPageContainer = styled.div`
  height: 100vh;
  display: grid;
  grid-template-columns: ${props => props.division};
  margin-bottom: 6em;
`;


export const Bullet = styled.div`
  width: 0.5em;
  height: 0.5em;
  border-radius: 50%;
  background: ${props => props.theme.color.primaryBlue};
  margin: 0 0.25em 0 0.25em;
`;

export const JumboOverlay = ({ url, height, title }) => {
  return (
    <JumboContainer url={url} height={height}>
      <JumboFirstOverlay height={height}>
        <JumboSecondOverlay height={height}>
          <RainbowStrip />
          {title ? (
            <JumboTitleContainer>
              <JumboTitle>{title}</JumboTitle>
            </JumboTitleContainer>
          ) : (
            ''
          )}
        </JumboSecondOverlay>
      </JumboFirstOverlay>
    </JumboContainer>
  );
};