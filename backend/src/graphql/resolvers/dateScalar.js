import { GraphQLScalarType, Kind } from 'graphql';

function isValidDateParts(y, m, d) {
  const dt = new Date(Date.UTC(y, m - 1, d));
  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === m - 1 &&
    dt.getUTCDate() === d
  );
}

function parseYYYYMMDD(value) {
  if (typeof value !== 'string') {
    throw new TypeError(`Date must be a string in YYYY-MM-DD format`);
  }

  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    throw new TypeError(`Invalid Date format: "${value}". Use YYYY-MM-DD`);
  }

  const [, ys, ms, ds] = match;
  const y = Number(ys);
  const m = Number(ms);
  const d = Number(ds);

  if (!isValidDateParts(y, m, d)) {
    throw new TypeError(`Invalid calendar date: "${value}"`);
  }

  return new Date(Date.UTC(y, m - 1, d)); // stored as UTC
}

function formatDateUTC(date) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export const DateScalar = new GraphQLScalarType({
  name: 'Date',
  description:
    'Date (no time). Accepts and returns strings in YYYY-MM-DD format.',
  serialize(value) {
    if (value instanceof Date) {
      return formatDateUTC(value);
    }
    if (typeof value === 'string') {
      return formatDateUTC(parseYYYYMMDD(value));
    }
    throw new TypeError(`Date cannot be serialized from type: ${typeof value}`);
  },
  parseValue(value) {
    return parseYYYYMMDD(value);
  },
  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      throw new TypeError(`Date literal must be a string in YYYY-MM-DD format`);
    }
    return parseYYYYMMDD(ast.value);
  },
});
