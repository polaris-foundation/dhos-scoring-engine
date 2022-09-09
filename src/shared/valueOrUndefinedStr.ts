const valueOrUndefinedStr = <T>(value: T | '' | undefined): T | 'undefined' =>
  typeof value === 'undefined' || value === '' ? 'undefined' : value;

export default valueOrUndefinedStr;
