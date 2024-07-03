import _ from 'lodash';

/**
 * A utility class for converting object keys between different case styles.
 */
export class CaseConverter {
  /**
   * Converts a snake_case string to camelCase.
   *
   * @param s - The snake_case string to convert.
   * @returns The camelCase string.
   */
  static snakeToCamel(s: string): string {
    return s.replace(/(_\w)/g, (matches) => matches[1].toUpperCase());
  }

  /**
   * Recursively converts all keys in an object or array from snake_case to camelCase.
   *
   * @param obj - The object or array with snake_case keys.
   * @returns The new object or array with camelCase keys.
   */
  static convertKeysToCamelCase(obj: any): any {
    if (obj === null || obj === undefined) {
      return obj;
    }
    if (Array.isArray(obj)) {
      return obj.map((v) => CaseConverter.convertKeysToCamelCase(v));
    } else if (obj !== null && obj.constructor === Object) {
      const newObj: any = {};
      Object.keys(obj).forEach((key) => {
        const newKey = _.camelCase(key);
        newObj[newKey] = CaseConverter.convertKeysToCamelCase(obj[key]);
      });
      return newObj;
    }
    return obj;
  }
}
