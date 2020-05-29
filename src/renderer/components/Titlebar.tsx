import * as React from 'React';
import styled from '@emotion/styled';

import NetworkStatus from './NetworkStatus';

const Toolbar = () => (
  <Container>
    <NetworkStatus />
  </Container>
);

const Container = styled('div')`
  position: sticky;
  top: 0;
  height: 36px;
  padding: 0 0.5rem;
  padding-left: 75px;
  display: grid;
  justify-content: end;
  grid-auto-columns: max-content;
  align-items: center;
  background: #fafafa;
  border-bottom: 1px solid #eee;
  -webkit-app-region: drag;
`;

export default Toolbar;