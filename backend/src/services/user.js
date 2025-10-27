import { GraphQLError } from 'graphql';
import { buildUserWhere } from './filters.js';

function buildUserOrder(orderBy = []) {
  if (!orderBy?.length) return [['id', 'ASC']];
  const mapField = (f) => {
    switch (f) {
      case 'ID':
        return 'id';
      case 'NAME':
        return 'name';
      case 'USERNAME':
        return 'userName';
      case 'CREATED_AT':
        return 'createdAt';
      case 'UPDATED_AT':
        return 'updatedAt';
      default:
        return 'id';
    }
  };
  return orderBy.map(({ field, direction }) => [
    mapField(field),
    direction || 'ASC',
  ]);
}

export function makeUserService({ User, Review, sequelize }) {
  return {
    async get(id, { transaction } = {}) {
      return User.findByPk(id, { transaction });
    },

    async create(data, { transaction } = {}) {
      try {
        return await User.create(data, { transaction });
      } catch (err) {
        if (err?.name === 'SequelizeUniqueConstraintError') {
          throw new GraphQLError('Username already in use', {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }
        throw err;
      }
    },

    async update(data, { transaction } = {}) {
      const user = await User.findByPk(data.id, { transaction });
      if (!user) {
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      Object.assign(user, data);
      try {
        await user.save({ transaction });
      } catch (err) {
        if (err?.name === 'SequelizeUniqueConstraintError') {
          throw new GraphQLError('Username already in use', {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }
        throw err;
      }
      return user;
    },

    async delete(id, { transaction, mongoSession } = {}) {
      const doDelete = async (t) => {
        const user = await User.findByPk(id, { transaction: t });
        if (!user) {
          throw new GraphQLError('User not found', {
            extensions: { code: 'NOT_FOUND' },
          });
        }
        await user.destroy({ transaction: t });
      };

      if (transaction) {
        await doDelete(transaction);
      } else if (sequelize) {
        await sequelize.transaction(async (t) => doDelete(t));
      } else {
        await doDelete(undefined);
      }

      if (Review) {
        try {
          await Review.deleteMany({ userId: id }, { session: mongoSession });
        } catch (e) {}
      }

      return true;
    },
  };
}
