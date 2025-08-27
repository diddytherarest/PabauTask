import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { GET_BRANDS } from '@/app/graphql/queries';
import { useI18n } from '@/app/lib/lang';

type Brand = { id: string; name: string };

export default function BrandsIndexRedirect() {
  const router = useRouter();
  const { t } = useI18n();
  const { data, loading } = useQuery(GET_BRANDS, { fetchPolicy: 'no-cache' });

  useEffect(() => {
    const first: Brand | undefined = data?.findAllBrands?.[0];
    if (first?.id) router.replace(`/brands/${first.id}`);
  }, [data, router]);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">{t('loading_brands') ?? 'Loading brands…'}</h1>
    </main>
  );
}
