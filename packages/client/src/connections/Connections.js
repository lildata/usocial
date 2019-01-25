import React from 'react';
import styled from 'styled-components';
import { connect } from '../utils/react-context';
import Section from '../common/Section';
import SectionHeader1 from '../common/SectionHeader1';
import BoxList from '../common/BoxList';
import MaxWidth from '../common/MaxWidth';
import ToolBox from '../common/ToolBox';
import RefreshTool from '../shared/RefreshTool';
import { UserContext } from '../app/UserProvider';
import { spaces } from '../app/theme';
import ConnectionsItem from './ConnectionsItem';

const ConnectionsContainer = styled(MaxWidth)`
  padding: ${spaces.section};
`;

function Connections({ user }) {
  return (
    <ConnectionsContainer>
      <ToolBox>
        <RefreshTool />
      </ToolBox>
      <Section>
        <SectionHeader1 border={false}>Connections</SectionHeader1>
        <BoxList>
          {user.user.verified && user.user.verified.map((verifiedItem) => (
            <ConnectionsItem key={verifiedItem.jwt} verifiedItem={verifiedItem} />
          ))}
        </BoxList>
      </Section>
    </ConnectionsContainer>
  );
}

export default connect('user', UserContext.Consumer, Connections);
