import gql from 'graphql-tag';

export const commonTypeDefs = gql`
  enum OrderDirection {
    ASC
    DESC
  }
`;
