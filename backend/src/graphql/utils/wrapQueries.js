import { notFoundIfNull } from './resolverWrappers.js';

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export function wrapQueryResolversWithNotFound(
  resolvers,
  fields,
  messageMap = {}
) {
  const wrapped = { ...resolvers, Query: { ...resolvers.Query } };
  for (const field of fields) {
    const base = wrapped.Query[field];
    if (typeof base === 'function') {
      const messageOrFn =
        messageMap[field] ||
        ((args) => `${capitalize(field)} ${args.id ?? ''} not found`.trim());
      wrapped.Query[field] = notFoundIfNull(base, messageOrFn);
    }
  }
  return wrapped;
}
