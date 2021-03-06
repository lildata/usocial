import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { currentAttestation } from 'usocial';
import { connect } from '../utils/react-context';
import { generateState, validateState, clearQueryParams } from '../utils/oauth2';
import { UserContext, sync, securityParams, addAttestation } from '../app/UserProvider';
import Loading from '../common/Loading';
import Section from '../common/Section';
import DefaultButton from '../common/DefaultButton';
import SectionHeader2 from '../common/SectionHeader2';
import { connectFacebook } from '../api/connect';

function requestCode() {
  const state = generateState();
  const facebookUrl = new URL('https://www.facebook.com/v3.2/dialog/oauth');
  facebookUrl.searchParams.set('client_id', process.env.REACT_APP_FACEBOOK_CLIENT_ID);
  facebookUrl.searchParams.set('redirect_uri', `${process.env.REACT_APP_CLIENT || 'http://localhost:3000'}/dashboard/connect/facebook`);
  facebookUrl.searchParams.set('state', state);
  
  window.location.href = facebookUrl.toString();
}

async function handleCallback(facebookCode, facebookState, uportPush, attestedJwt = null) {
  if (!validateState(facebookState)) {
    throw new Error('State doesn\'t match');
  }

  return connectFacebook(facebookCode, uportPush, attestedJwt);
}

function ConnectFacebook({ location, user }) {
  const urlParams = new URLSearchParams(location.search);
  const urlCode = urlParams.get('code');
  const urlState = urlParams.get('state');

  if (urlCode) {
    clearQueryParams();
    return <CallbackView user={user} facebookCode={urlCode} facebookState={urlState} />;
  }

  return <DefaultView />;
}

const Instructions = styled.p`
  margin-bottom: 2rem;
`;

function DefaultView() {
  const user = useContext(UserContext);
  const [isConnecting, setIsConnecting] = useState(false);

  async function onRequestCode() {
    setIsConnecting(true);

    // Make sure we're working with the latest attestations before adding new ones on top
    await sync(user);

    // Facebook flow
    requestCode();
  }

  return (
    <Section>
      <SectionHeader2>You're about to connect your Facebook account</SectionHeader2>
      <Instructions>
        You will be sent to Facebook to grant uSocial permission to read over your basic data.
        The attestation you will be sent will contain your Facebook ID.
      </Instructions>
      <Instructions>
        Your personal information is never stored on our attestation servers.
      </Instructions>
      {!isConnecting && <DefaultButton type="submit" onClick={onRequestCode}>Connect</DefaultButton>}
      {isConnecting && <Loading text="Connecting" />}
    </Section>
  );
}

function CallbackView({ user, facebookCode, facebookState }) {
  const [success, setSuccess] = useState(false);

  const pushData = {
    did: user.user.did,
    pushToken: user.user.pushToken,
    publicEncKey: user.user.publicEncKey,
  };

  useEffect(() => {
    (async () => {
      const attested = currentAttestation(user.user.verified, securityParams(user));
      const attestedJwt = attested && attested.jwt;
      const attestation = await handleCallback(facebookCode, facebookState, pushData, attestedJwt);
      await addAttestation(user, attestation);
      setSuccess(true);
    })();
  }, []);

  return (
    <Section>
      <SectionHeader2>We're attesting your Facebook identity</SectionHeader2>
      {!success && <Loading text="Hold tight! Your Facebook identity is being verified" />}
      {success && 'Success! Your uPort attestation should show up on your mobile uPort app in few seconds.'}
    </Section>
  );
}

const connected = connect('user', UserContext.Consumer, ConnectFacebook);
const routered = withRouter(connected);

export default routered;
