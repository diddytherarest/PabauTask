import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "https://graphql-api-brown.vercel.app/api/graphql",
  }),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          brands: { merge: false },
          models: { merge: false },
          guitar: { merge: false },
        },
      },
    },
  }),

});

export default client;
