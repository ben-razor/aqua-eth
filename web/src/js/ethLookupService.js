import { registerEthLookup } from './compiled/ethLookup.js';
import { verifyTypedData } from './compiled/aquaEth';
import { createSuccessInfo, createErrorInfo, result } from './serviceHelpers.js';
import { Fluence, FluencePeer } from "@fluencelabs/fluence";

export function createTypedConnectionObj(peerId, relayPeerId) {
  return {
    domain: {},
    types: { Info: [ { name: "peerId", type: "string" }, { name: "relayPeerId", type: "string" }] },
    value: { peerId, relayPeerId }
  };
}
 
class EthLookup {
  constructor() {
    this.init();
  }
  init() {
    registerEthLookup({
    /**
       * Verify that an ethLookup record was signed by the passed address using
       * EIP-712 signing.
       * 
       * recordJSON is {
       *   peerId: string,
       *   sig: string
       * }
       * 
       * The sig will have signed EIP Document like the following {
       *   domain: {},
       *   types: { Info: [ {peerId }]}
       *   value: { peerId: "..."}
       * }
       * 
       * @param {string} address 
       * @param {JSONString} recordJSON 
       * @returns { info: { success, reason, code, message}, data: address}
       */
      verify: async(address, recordJSON, particle) => {
          let { success, reason, message, code } = createSuccessInfo();
          let data;
          let record;

          if(success) {
            try {
              record = JSON.parse(recordJSON);
            }
            catch(e) {
              success = false;
              reason = 'error-parsing-record';
              data = e;
              console.log(e);
            }
          }

          if(success) {
            if(record.peerId !== particle.initPeerId) {
              success = false;
              reason = 'error-peerid-does-not-match-origin';
              data = {
                reqPeerId: record.peerId,
                initPeerId: particle.initPeerId 
              }
            }
          }

          if(success) {
            try {
              let origPeerId = record.peerId;
              let origRelayId = record.relayPeerId;
              let sig = record.sig;

              let { domain, types, value } = createTypedConnectionObj(origPeerId, origRelayId);
              let domainJSON = JSON.stringify(domain);
              let typesJSON = JSON.stringify(types);
              let valueJSON = JSON.stringify(value);

              let {peerId, relayPeerId }= Fluence.getStatus();
              console.log("R1", domainJSON, typesJSON, valueJSON, sig);
              let res = await verifyTypedData(peerId, relayPeerId, domainJSON, typesJSON, valueJSON, sig);
              console.log("R2");

              if(res.info.success) {
                  data = res.data;

                  console.log('DA', data, address);
                  if(data.toLowerCase() === address.toLowerCase()) {
                    data = recordJSON;
                  }
                  else {
                      success = false;
                      reason = 'error-sig-mismatch';
                  }
              }
              else {
                  ({success, reason, code, message} = res.info);
              }
            }
            catch(e) {
              success = false;
              reason = 'error-verifying-data';
              console.log(e);
            }
          }
          return result(success, reason, code, message, data);
      },
      createHashInput: async function(address, salt) {
        return "verifiedEthAddress:" + address + ":" + salt;
      }
    });

  }
}

export default EthLookup;