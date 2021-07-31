import APIError from '@helpers/APIErrors';
import httpStatus from 'http-status';

describe('TEST CUSTOM API ERROR CONSTRUCTOR CLASS', () => {
  test('test error response constructed by the custom api class', () => {
    const error = new APIError({
      payload: {},
      message: 'APIError test',
      status: httpStatus.BAD_REQUEST,
      errors: new Error('Testing APIError class')
    });

    expect(error).toBeTruthy();
    expect(error).not.toBeNull();
    expect(error.status).toBe(400);
    expect(error.errors).not.toBeNull();
    expect(error.message).not.toBeNull();
    expect(error.message).toMatch(/APIError/);
    expect(error.errors).toMatchObject({ message: /APIError/ });
  });
});
