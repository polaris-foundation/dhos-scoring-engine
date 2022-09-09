import ValidationException from './exceptions';

interface LookupTable<T> {
  [key: string]: T;
}
const acvpuMappings: LookupTable<string> = {
  a: 'alert',
  alert: 'alert',
  c: 'confusion',
  confusion: 'confusion',
  v: 'voice',
  voice: 'voice',
  p: 'pain',
  pain: 'pain',
  u: 'unresponsive',
  unresponsive: 'unresponsive',
  undefined: 'undefined'
};
type AcvpuKeys = keyof typeof acvpuMappings;

const normaliseAcvpu = async (acvpuIn: string): Promise<string> => {
  const _acvpIn = acvpuIn.toLowerCase();
  if (_acvpIn in acvpuMappings) {
    return acvpuMappings[_acvpIn];
  }

  throw new ValidationException(`Invalid ACVPU passed in: '${acvpuIn}'`, 'ACVPU was invalid');
};

export default normaliseAcvpu;
