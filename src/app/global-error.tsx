'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <h1>Erro Global</h1>
        <button onClick={() => reset()}>Tentar Novamente</button>
      </body>
    </html>
  );
}
