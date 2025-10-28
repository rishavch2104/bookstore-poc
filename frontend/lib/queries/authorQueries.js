import { gql } from '@apollo/client';

export const createAuthorQuery = gql`
  mutation CreateAuthor($input: CreateAuthorInput!) {
    createAuthor(input: $input) {
      id
      name
    }
  }
`;

export const updateAuthorQuery = gql`
  mutation UpdateAuthor($input: UpdateAuthorInput!) {
    updateAuthor(input: $input) {
      id
      name
    }
  }
`;

export const deleteAuthorQuery = gql`
  mutation DeleteAuthor($input: DeleteAuthorInput!) {
    deleteAuthor(input: $input)
  }
`;

export const getAllAuthorsQuery = gql`
  query GetAuthors($limit: Int!, $offset: Int!) {
    authors(limit: $limit, offset: $offset) {
      totalCount
      hasNextPage
      nodes {
        id
        name
      }
    }
  }
`;

export const getAuthorQuery = gql`
  query GetAuthor($id: ID!) {
    author(id: $id) {
      id
      name
      bio
      dateOfBirth
      books {
        id
        title
        description
        publishedDate
      }
    }
  }
`;

export const getAuthorPageQuery = gql`
  query GetAuthorsPageFiltered(
    $limit: Int!
    $offset: Int!
    $filter: AuthorFilter
    $orderBy: [AuthorOrder!]
  ) {
    authors(
      limit: $limit
      offset: $offset
      filter: $filter
      orderBy: $orderBy
    ) {
      totalCount
      hasNextPage
      nodes {
        id
        name
        dateOfBirth
        bio
      }
    }
  }
`;
