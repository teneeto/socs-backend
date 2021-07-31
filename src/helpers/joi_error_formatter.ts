import { ValidationError } from '@hapi/joi';
import Joi from 'joi';

/**
 *
 * @description Returns a custom error object with descriptive messages.
 * @function JoiErrorFormatter
 * @property {Array}
 * @property {Map<string, Joi.Root.ValidationError>} - Array of Joi validation errors.
 * @returns {Record<string | number, string>}
 */

export default function JoiErrorFormatter(
  errors: Map<string, ValidationError>
): Record<string | number, string> {
  return [...errors.keys()].reduce<Record<string | number, string>>(
    (acc, path) => {
      const details =
        errors.get(path)?.details ||
        ((errors.get(path) as unknown) as Joi.ValidationErrorItem[]);

      if (details) {
        for (let index = 0; index < details.length; index++) {
          const error = details[index];
          const key = error.path[0] || 'error';
          acc[key] = error.message.replace(/"/g, '');
        }
      }

      return acc;
    },
    {}
  );
}
