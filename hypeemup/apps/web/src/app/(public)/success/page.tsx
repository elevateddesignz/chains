import { apiFetch } from '@/lib/api-client';

interface SuccessPageProps {
  searchParams: { session_id?: string };
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const sessionId = searchParams.session_id;
  const receipt = sessionId
    ? await apiFetch<{ receiptUrl: string }>(`/orders/receipt?sessionId=${sessionId}`)
        .then((data) => data.receiptUrl)
        .catch(() => null)
    : null;

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-white">Thank you!</h1>
      <p className="text-white/70">
        Your order is confirmed. We'll email tracking details as soon as your chain ships.
      </p>
      {receipt ? (
        <a href={receipt} className="text-brand-orange underline">
          View Stripe receipt
        </a>
      ) : null}
    </div>
  );
}
