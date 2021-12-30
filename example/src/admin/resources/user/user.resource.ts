import { ResourceWithOptions } from 'adminjs';
import { User } from './user.entity';

export const createUserResource = (): ResourceWithOptions => ({
  resource: User,
  options: {
    navigation: {
      icon: 'User',
      name: 'Users',
    },
  },
});
