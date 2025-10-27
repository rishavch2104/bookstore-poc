import { GraphQLError } from 'graphql';

export const notFoundIfNull = (resolver, messageOrFn) => {
  return async (parent, args, ctx, info) => {
    const result = await resolver(parent, args, ctx, info);
    if (result == null) {
      const msg =
        typeof messageOrFn === 'function'
          ? messageOrFn(args)
          : messageOrFn || 'Not found';
      throw new GraphQLError(msg, { extensions: { code: 'NOT_FOUND' } });
    }
    return result;
  };
};
