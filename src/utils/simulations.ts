export function flattenObject(obj: any, parentKey: string = '', separator: string = '.'): Record<string, any> {
  const flattened: Record<string, any> = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = parentKey ? `${parentKey}${separator}${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        Object.assign(flattened, flattenObject(obj[key], newKey, separator));
      } else {
        flattened[newKey] = obj[key];
      }
    }
  }

  return flattened;
}

export function unflattenObject(flattened: Record<string, any>, separator: string = '.'): any {
  const unflattened: any = {};

  for (const flatKey in flattened) {
    if (flattened.hasOwnProperty(flatKey)) {
      const keys = flatKey.split(separator);
      keys.reduce((acc, key, index) => {
        if (index === keys.length - 1) {
          acc[key] = flattened[flatKey];
        } else {
          acc[key] = acc[key] || {};
        }
        return acc[key];
      }, unflattened);
    }
  }

  return unflattened;
}
