import React from 'react';
import styled from 'styled-components';
import NeatList from '../common/NeatList';
import NeatLink from '../common/NeatLink';
import { colors, spaces } from '../app/theme';

const SidenavContainer = styled.div`
  position: fixed;
  top: 0;
  width: 200px;
  background-color: ${colors.backgroundDark};
  color: ${colors.textContrast};
  height: 100%;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  width: 100%;
  background-color: ${colors.backgroundDark};
`;

const Logo = styled.span`
  display: inline-block;
  color: ${colors.textContrast};
  font-weight: 600;
  font-size: 2.6rem;
`;

const Network = styled.span`
  display: block;
  margin-top: 0.5rem;
  padding: ${spaces.default};
`;

const SidenavContent = styled(NeatList)`
  padding: 0 ${spaces.default} ${spaces.default} ${spaces.default};
`;

const NetworkIcon = styled.i`
`;

const Level0Item = styled.h4`
  color: #bac8ff;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 1rem;

  &:not(:first-of-type) {
    margin-top: 1.5rem;
  }
`;

const Level1Item = styled.li`
  padding: 0.5rem 1rem;

  &:hover {
    background-color: #c1d8f0;
    border-radius: 5px;
    color: #333;
  }
`;

const Level1Link = styled(NeatLink)`
  color: ${colors.textContrast};
`;

function Sidenav() {
  return (
    <SidenavContainer>
      <LogoContainer>
        <Logo>uSocial</Logo>
      </LogoContainer>
      <Network>
        <NetworkIcon className="fab fa-connectdevelop" aria-hidden="true"></NetworkIcon>{' '}
        Rinkeby
      </Network>
      <SidenavContent>
        <Level0Item>Manage</Level0Item>
        <NeatList>
          <Level1Link to="/dashboard"><Level1Item>All connections</Level1Item></Level1Link>
          <Level1Item>Integrate</Level1Item>
        </NeatList>
        <Level0Item>Account</Level0Item>
        <NeatList>
          <Level1Item>Profile</Level1Item>
          <Level1Item>Network</Level1Item>
        </NeatList>
      </SidenavContent>
    </SidenavContainer>
  );
}

export default Sidenav;
