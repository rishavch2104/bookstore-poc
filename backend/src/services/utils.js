import { GraphQLError } from 'graphql';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const TOKEN_EXPIRY = '7d';
export function assertNoConflicts({ exact, from, to, field }) {
  if (exact != null && (from != null || to != null)) {
    throw new GraphQLError(
      `Provide either '${field}' OR '${field}From'/'${field}To', not both.`,
      {
        extensions: { code: 'BAD_USER_INPUT' },
      }
    );
  }
}

export function assertValidRange({ from, to, field }) {
  if (from != null && to != null) {
    const f = new Date(from);
    const t = new Date(to);
    if (Number.isNaN(f.getTime()) || Number.isNaN(t.getTime())) {
      throw new GraphQLError(
        `'${field}From' and '${field}To' must be valid dates.`,
        {
          extensions: { code: 'BAD_USER_INPUT' },
        }
      );
    }
    if (f > t) {
      throw new GraphQLError(
        `'${field}From' must be less than or equal to '${field}To'.`,
        {
          extensions: { code: 'BAD_USER_INPUT' },
        }
      );
    }
  }
}

export function isAdmin(user) {
  if (!user) {
    throw new GraphQLError('Authentication required', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }

  if (user.role !== 'admin') {
    throw new GraphQLError('Only admins can perform this action', {
      extensions: { code: 'FORBIDDEN' },
    });
  }
}
export function isLoggedIn(user) {
  if (!user) {
    throw new GraphQLError('Authentication required', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }
}

export function generateToken(user) {
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

export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

export async function isPasswordValid(password, toComparePassword) {
  return await bcrypt.compare(password, toComparePassword);
}
