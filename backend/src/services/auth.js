import { GraphQLError } from 'graphql';
import { generateToken, hashPassword, isPasswordValid } from './utils.js';

export function makeAuthService({ User }) {
  return {
    async signup(input, { transaction } = {}) {
      const { name, email, password, role } = input;
      const existing = await User.findOne({ where: { email } });
      if (existing) {
        throw new GraphQLError('Email already registered', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }
      const hashedPassword = await hashPassword(password);
      const user = await User.create(
        { email, password: hashedPassword, name, role },
        { transaction }
      );

      const token = generateToken(user);
      return {
        token,
        user,
      };
    },

    async login(input) {
      const { email, password } = input;
      const user = await User.findOne({ where: { email } });

      if (!user) {
        throw new GraphQLError('Invalid email or password', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const valid = await isPasswordValid(password, user.password);

      if (!valid) {
        throw new GraphQLError('Invalid email or password', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const token = generateToken(user);
      return {
        token,
        user,
      };
    },
  };
}
