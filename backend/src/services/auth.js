import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const TOKEN_EXPIRY = '7d';

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
}

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
      const hashedPassword = await bcrypt.hash(password, 10);
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

      const valid = await bcrypt.compare(password, user.password);

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
