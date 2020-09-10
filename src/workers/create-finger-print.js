import Fingerprint2 from "fingerprintjs2";

export default function createFingerPrint() {
  return new Promise(resolve => {
    Fingerprint2.get(function getFingerPrintCB(components) {
      const values = components.map(function mapFingerPrintComponents(
        component
      ) {
        return component.value;
      });

      const murmur = Fingerprint2.x64hash128(values.join(""), 31);
      resolve(murmur);
    });
  });
}
