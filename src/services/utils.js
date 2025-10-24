import { GraphQLError } from 'graphql';
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
