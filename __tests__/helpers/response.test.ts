import Response from '@helpers/response';

describe('TEST API RESPONSE METHOD', () => {
  test('test when a request is received and the response payload is constructed', () => {
    const response = Response({
      statusCode: 200,
      message: 'successful check',
      payload: { message: 'successful test flight' }
    });

    expect(response).toBeTruthy();
    expect(response).not.toBeNull();
    expect(response.token).toBeNull();
    expect(response.errors).toBeNull();
    expect(response.statusCode).toBe(200);
    expect(response.payload).toBeTruthy();
    expect(response.message).toMatch(/check/);
  });
});
