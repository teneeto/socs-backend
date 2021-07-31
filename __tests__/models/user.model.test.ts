import User from '@models/user.model';
import { QueryBuilder } from 'objection';
import { users as dummy_users } from '@seeds/dummy.json';

const query = QueryBuilder.forClass(User);

describe('TEST USER MODEL', () => {
  test('test getting all users on the database with user model', async () => {
    const users = await query.resolve(dummy_users);
    expect(users).not.toBeNull();
    expect(users.length).toBe(dummy_users.length);
    expect(users).toEqual(
      expect.arrayContaining([expect.objectContaining({ first_name: 'John' })])
    );
  });
});
