// src/app/lib/apollo-client.ts
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const endpoint =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ?? 'http://localhost:4000/graphql';

const httpLink = new HttpLink({
  uri: endpoint,
  // On Next.js, the global fetch is available
  fetch,
});

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  // We’re on the client (app router “use client”), so no SSR
  ssrMode: false,
  connectToDevTools: process.env.NODE_ENV !== 'production',
});

export default apolloClient;          // <-- default export
export { apolloClient };             // (optional) named export too
