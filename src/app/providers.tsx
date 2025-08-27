// src/app/providers.tsx
'use client';

import { ApolloProvider } from '@apollo/client';
import apolloClient from './lib/apollo-client';   // <-- import default
import { LanguageProvider } from './lib/lang';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={apolloClient}>
      <LanguageProvider>{children}</LanguageProvider>
    </ApolloProvider>
  );
}
