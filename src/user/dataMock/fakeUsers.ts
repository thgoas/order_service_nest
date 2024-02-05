import { User } from '../entities/user.entity';

export const fakeUsers: User[] = [
  {
    id: '1',
    name: 'user 1',
    email: 'user1@email.com',
    password: '123456',
    status: true,
    profile_id: '2',
    created_at: new Date(2024, 2, 1),
    updated_at: new Date(2024, 2, 1),
  },
  {
    id: '2',
    name: 'user 2',
    email: 'user2@email.com',
    password: '123456',
    status: true,
    profile_id: '1',
    created_at: new Date(2024, 2, 1),
    updated_at: new Date(2024, 2, 1),
  },
  {
    id: '3',
    name: 'user 3',
    email: 'user3@email.com',
    password: '123456',
    status: true,
    profile_id: '1',
    created_at: new Date(2024, 2, 1),
    updated_at: new Date(2024, 2, 1),
  },
];
