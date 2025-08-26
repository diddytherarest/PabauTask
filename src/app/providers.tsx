'use client';

import { ApolloProvider } from '@apollo/client/react';
import client from './lib/apollo-client';
import { LanguageProvider } from '././lib/lang';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </LanguageProvider>
  );
}
