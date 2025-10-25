import { Op } from 'sequelize';
import { assertNoConflicts, assertValidRange } from './utils.js';

export function buildBookWhere(filter = {}) {
  const where = {};
  if (filter.id != null) where.id = { [Op.eq]: filter.id };
  if (filter.title != null) where.title = { [Op.eq]: filter.title };
  if (filter.authorId != null) where.authorId = { [Op.eq]: filter.authorId };

  assertNoConflicts({
    exact: filter.publishedDate,
    from: filter.publishedDateFrom,
    to: filter.publishedDateTo,
    field: 'publishedDate',
  });
  assertValidRange({
    from: filter.publishedDateFrom,
    to: filter.publishedDateTo,
    field: 'publishedDate',
  });

  if (filter.publishedDate != null)
    where.publishedDate = { [Op.eq]: filter.publishedDate };
  const from = filter.publishedDateFrom;
  const to = filter.publishedDateTo;
  if (from != null && to != null) {
    where.publishedDate = { [Op.between]: [from, to] };
  } else if (from != null) {
    where.publishedDate = { [Op.gte]: from };
  } else if (to != null) {
    where.publishedDate = { [Op.lte]: to };
  }

  return where;
}

export function buildAuthorWhere(filter = {}) {
  const where = {};
  if (filter.id != null) where.id = { [Op.eq]: filter.id };
  if (filter.name != null) where.name = { [Op.eq]: filter.name };

  assertNoConflicts({
    exact: filter.dateOfBirth,
    from: filter.dateOfBirthFrom,
    to: filter.dateOfBirthTo,
    field: 'dateOfBirth',
  });
  assertValidRange({
    from: filter.dateOfBirthFrom,
    to: filter.dateOfBirthTo,
    field: 'dateOfBirth',
  });

  if (filter.dateOfBirth != null)
    where.dateOfBirth = { [Op.eq]: filter.dateOfBirth };
  const from = filter.dateOfBirthFrom;
  const to = filter.dateOfBirthTo;
  if (from != null && to != null) {
    where.dateOfBirth = { [Op.between]: [from, to] };
  } else if (from != null) {
    where.dateOfBirth = { [Op.gte]: from };
  } else if (to != null) {
    where.dateOfBirth = { [Op.lte]: to };
  }

  return where;
}

export function buildUserWhere(filter = {}) {
  const where = {};
  if (filter?.id != null) where.id = { [Op.eq]: filter.id };
  if (filter?.name != null) where.name = { [Op.eq]: filter.name };
  if (filter?.userName != null) where.userName = { [Op.eq]: filter.userName };

  const from = filter?.createdAtFrom;
  const to = filter?.createdAtTo;
  if (from != null && to != null)
    where.createdAt = { [Op.between]: [from, to] };
  else if (from != null) where.createdAt = { [Op.gte]: from };
  else if (to != null) where.createdAt = { [Op.lte]: to };

  return where;
}
