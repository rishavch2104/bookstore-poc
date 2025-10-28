export const authResolvers = {
  Mutation: {
    signup: (_, { input }, { services }) => services.auth.signup(input),

    login: (_, { input }, { services }) => services.auth.login(input),
  },
};
