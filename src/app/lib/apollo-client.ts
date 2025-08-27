import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    console.error(
      "[GraphQL errors]",
      graphQLErrors.map(e => ({ message: e.message, path: e.path, extensions: e.extensions }))
    );
  }
  if (networkError) {
    console.error("[Network error]", networkError, "on operation", operation.operationName);
  }
});

const httpLink = new HttpLink({
  uri: "https://graphql-api-brown.vercel.app/api/graphql",
});

const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          findAllBrands: { merge: false },
          findBrandModels: { merge: false },
          findUniqueModel: { merge: false },
        },
      },
    },
  }),
  connectToDevTools: process.env.NODE_ENV === "development",
});

export default client;
