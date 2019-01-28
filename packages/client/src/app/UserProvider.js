import React, { createContext } from 'react';
import { useLocalStorage } from '../utils/react-context';
import { requestDisclosure, signout as uportSignout } from '../uport'

const UserContext = createContext();

function UserProvider(props) {
  const [user, setUser] = useLocalStorage('user', {});

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {props.children}
    </UserContext.Provider>
  );
}

/**
 * Actions
 */
async function refresh(context) {
  const data = await requestDisclosure();
  context.setUser(data);
}

async function signout(context) {
  uportSignout();
  context.setUser({});
  window.sessionStorage.clear();
}

async function pushAttestation(context, attestation) {
  context.setUser({
    ...context.user,
    verified: context.user.verified.concat(attestation),
  });
}

// TODO verify DID
function getLastAttestation(context) {
  const verified = context.user.verified;
  return verified.length > 0 && verified[verified.length - 1];
}

export {
  UserContext,
  refresh,
  signout,
  pushAttestation,
  getLastAttestation,
};
export default UserProvider;
