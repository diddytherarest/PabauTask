// src/lib/apollo-client.ts
import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

// Read endpoint from env (falls back to localhost)
const GRAPHQL_URI =
  (process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || '').trim() ||
  'http://localhost:8080/graphql';

// Helpful console log so you can confirm what the app is using
if (typeof window !== 'undefined') {
  // eslint-disable-next-line no-console
  console.log('[Apollo] Using GraphQL endpoint:', GRAPHQL_URI);
}

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors?.length) {
    
    console.warn(
      `[GraphQL errors] ${operation.operationName || 'anonymous'}:`,
      graphQLErrors.map((e) => e.message)
    );
  }
  if (networkError) {
    
    console.warn('[Network error]', networkError);
  }
});

const httpLink = new HttpLink({
  uri: GRAPHQL_URI,
 
  fetchOptions: {
    mode: 'cors',
  },
});

export const apolloClient = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache(),
});
