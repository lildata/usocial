import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { connect } from '../utils/react-context';
import { generateState, validateState, clearQueryParams } from '../utils/oauth';
import { UserContext } from '../app/UserProvider';
import Section from '../common/Section';
import DefaultButton from '../common/DefaultButton';
import SectionHeader2 from '../common/SectionHeader2';
import { connectGoogle } from '../api/connect';

function requestCode() {
  const state = generateState();
  const googleUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  googleUrl.searchParams.set('client_id', process.env.REACT_APP_GOOGLE_CLIENT_ID);
  googleUrl.searchParams.set('redirect_uri', `${process.env.REACT_APP_CLIENT || 'http://localhost:3000'}/dashboard/connect/google`);
  googleUrl.searchParams.set('state', state);
  googleUrl.searchParams.set('response_type', 'code');
  googleUrl.searchParams.set('scope', 'profile');
  
  window.location.href = googleUrl.toString();
}

async function handleCallback(googleCode, googleState, uportPush) {
  if (!validateState(googleState)) {
    throw new Error('State doesn\'t match');
  }

  return connectGoogle(googleCode, uportPush);
}

function ConnectGoogle({ location, history, user }) {
  const urlParams = new URLSearchParams(location.search);
  const urlCode = urlParams.get('code');
  const urlState = urlParams.get('state');

  if (urlCode) {
    clearQueryParams();
    return <CallbackView user={user} googleCode={urlCode} googleState={urlState} />;
  }

  return <DefaultView />;
}

const Instructions = styled.p`
  margin-bottom: 2rem;
`;

function DefaultView() {
  return (
    <Section>
      <SectionHeader2>You're about to connect your Google account</SectionHeader2>
      <Instructions>
        You will be sent to Google to grant uSocial permission to read over your basic data.
        The attestation you will be sent will contain your Google ID.
      </Instructions>
      <Instructions>
        Your personal information is never stored on our attestation servers.
      </Instructions>
      <DefaultButton type="submit" onClick={requestCode}>Connect</DefaultButton>
    </Section>
  );
}

function CallbackView({ user, googleCode, googleState }) {
  const [success, setSuccess] = useState(false);

  const pushData = {
    did: user.user.did,
    pushToken: user.user.pushToken,
    publicEncKey: user.user.publicEncKey,
  };

  useEffect(() => {
    (async () => {
      await handleCallback(googleCode, googleState, pushData);
      setSuccess(true);
    })();
  }, []);

  return (
    <Section>
      <SectionHeader2>We're attesting your Google identity</SectionHeader2>
      {!success && 'Hold tight! Your Google identity is being verified...'}
      {success && 'Success! Your uPort attestation should show up on your mobile uPort app in few seconds.'}
    </Section>
  );
}

const connected = connect('user', UserContext.Consumer, ConnectGoogle);
const routered = withRouter(connected);

export default routered;
