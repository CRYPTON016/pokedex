import PokemonDetailClient from "./client";

// Generate static params for all Pokemon (1-1025)
export function generateStaticParams() {
  return Array.from({ length: 1025 }, (_, i) => ({
    id: String(i + 1),
  }));
}

export default async function PokemonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PokemonDetailClient id={id} />;
}
