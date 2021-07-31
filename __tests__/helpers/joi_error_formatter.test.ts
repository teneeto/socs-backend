import { Joi } from 'celebrate';
import joiErrorFormatter from '@helpers/joi_error_formatter';

describe('TEST JOI ERROR FORMATTER METHOD', () => {
  test("test when joi validation errors are meet on the app and how it's errors are converted and sent to app APIError for reporting", () => {
    // define validation for all the env vars
    const userInfo = Joi.object({
      full_name: Joi.string().alphanum().min(3).max(30).required(),
      password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
      email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'net'] }
      })
    })
      .unknown()
      .required();

    const user = {
      full_name: 'John Doe',
      password: 'password',
      email: 'password'
    };

    const { error } = userInfo.validate(user, { abortEarly: false });

    const response = joiErrorFormatter(new Map(Object.entries(error)));

    expect(response).not.toBeNull();
    expect(response.email).toBeTruthy();
    expect(response.full_name).toBeTruthy();
    expect(response).toMatchObject({
      full_name: /full_name/,
      email: /email/
    });
  });
});
