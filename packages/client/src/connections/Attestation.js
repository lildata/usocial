import React from 'react';
import BoxList from '../common/BoxList';
import {
  validateAttestation,
  verifyAttestation,
} from '../uport/tools';
import AttestationItem, { Malformed, DidMismatch, Invalid } from './AttestationItem';

function Attestation({ attestation, isInvalid }) {
  if (isInvalid) {
    return <BoxList><Invalid /></BoxList>;
  }
  if (!validateAttestation(attestation)) {
    return <BoxList><Malformed /></BoxList>;
  }
  if (!verifyAttestation(attestation)) {
    return <BoxList><DidMismatch attestation={attestation} /></BoxList>;
  }

  const usocialClaim = attestation.claim.usocialIdentity;
  return (
    <BoxList>
      {Object.entries(usocialClaim).map(([platform, values]) => {
        return values.map((value) => {
          const itemProps = {
            platform,
            value,
            iat: attestation.iat,
            exp: attestation.exp,
            iss: attestation.iss,
            sub: attestation.sub,
            jwt: attestation.jwt,
          };
          return <AttestationItem key={`${platform}-${value}`} {...itemProps}>{platform}</AttestationItem>
        });
      })}
    </BoxList>
  );
}

export default Attestation;