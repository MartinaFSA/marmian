import Link from "next/link";
import { getCampaign } from "@/data/campaigns";
import { getOngByLegacyId } from "@/lib/organizations";

export default async function IniciativaPage({
  searchParams,
}: {
  searchParams: Promise<{ campaign?: string }>;
}) {
  const { campaign: campaignId } = await searchParams;
  const campaign = campaignId ? getCampaign(Number(campaignId)) : undefined;

  if (!campaign) {
    return (
      <main className="mx-auto flex max-w-2xl flex-col gap-4 p-6 md:p-10">
        <h1 className="text-3xl font-bold tracking-tight">Iniciativa</h1>
        <p className="text-neutral-600">No encontramos la iniciativa pedida.</p>
        <Link href="/" className="text-blue-600 underline-offset-2 hover:underline">
          ← Volver
        </Link>
      </main>
    );
  }

  const ong = await getOngByLegacyId(campaign.ongId);

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6 md:p-10">
      <Link href="/" className="text-sm text-blue-600 underline-offset-2 hover:underline">
        ← Volver
      </Link>

      <header className="flex flex-col gap-2">
        {ong && (
          <p className="text-sm uppercase tracking-wide text-neutral-500">
            {ong.name}
          </p>
        )}
        <h1 className="text-4xl font-bold tracking-tight">{campaign.title}</h1>
        {ong && (
          <p className="text-sm text-neutral-600">
            <span className="font-bold">Alcance:</span> {ong.scope}
          </p>
        )}
      </header>

      <p className="text-lg leading-relaxed text-neutral-800">
        {campaign.description}
      </p>
    </main>
  );
}
