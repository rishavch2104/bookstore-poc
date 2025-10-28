import {
  ValidationError,
  UniqueConstraintError,
  ForeignKeyConstraintError,
  DatabaseError,
} from 'sequelize';
import { GraphQLError } from 'graphql';

export function formatError(formattedError, error) {
  const original = error.originalError;
  console.log(original);
  const toGQLError = (message, code, extra = {}) =>
    new GraphQLError(message, {
      nodes: error.nodes,
      source: error.source,
      positions: error.positions,
      path: error.path,
      originalError: error.originalError,
      extensions: { ...formattedError.extensions, code, ...extra },
    });

  if (original instanceof ValidationError) {
    const details = original.errors?.map((e) => e.message) ?? [];
    return toGQLError('Validation failed', 'BAD_USER_INPUT', { details });
  }

  if (original instanceof UniqueConstraintError) {
    const fields = Object.keys(original.fields ?? {});
    return toGQLError('Unique constraint violated', 'CONFLICT', { fields });
  }

  if (original instanceof ForeignKeyConstraintError) {
    return toGQLError(
      'Invalid reference or restricted operation',
      'BAD_USER_INPUT',
      {
        table: original.table,
        fields: original.fields,
        index: original.index,
      }
    );
  }

  if (original instanceof DatabaseError) {
    return toGQLError('Database error', 'INTERNAL_SERVER_ERROR');
  }

  return formattedError;
}
