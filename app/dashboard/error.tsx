'use client';

export default function Error({ error }: { error: Error }) {
  return (
    <div className="p-8 text-center text-red-600">
      <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
      <p>{error.message || 'An unexpected error occurred.'}</p>
    </div>
  );
}
