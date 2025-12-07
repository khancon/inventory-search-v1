"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Map } from "@/components/consumer/Map";

type SearchResult = {
  id: string;
  quantity: number;
  distanceKm: number | null;
  item: { id: string; name: string; description?: string | null; imageUrl?: string | null };
  store: { id: string; name: string; latitude: number; longitude: number; address?: string | null };
};

export default function SearchPage() {
  const params = useSearchParams();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function run() {
      setLoading(true);
      const query = params.toString();
      const res = await fetch(`/api/search?${query}`);
      const data = await res.json();
      setResults(data.results ?? []);
      setLoading(false);
    }
    run();
  }, [params]);

  const storeMarkers = useMemo(() => {
    const byId = new Map<string, { id: string; name: string; latitude: number; longitude: number }>();
    results.forEach((r) => byId.set(r.store.id, { id: r.store.id, name: r.store.name, latitude: r.store.latitude, longitude: r.store.longitude }));
    return Array.from(byId.values());
  }, [results]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Results</h1>
        {loading ? <p className="text-slate-600">Searching...</p> : <p className="text-slate-600">{results.length} results</p>}
      </div>

      <Card title="Map">
        <Map points={storeMarkers} />
      </Card>

      <Card title="Matches">
        <div className="space-y-4">
          {results.map((r) => (
            <div key={r.id} className="rounded-lg border border-slate-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-slate-900">{r.item.name}</p>
                  {r.item.description ? <p className="text-sm text-slate-600">{r.item.description}</p> : null}
                  <p className="text-sm text-slate-500">In stock: {r.quantity}</p>
                  <Link className="text-sm text-brand-600" href={`/consumer/store/${r.store.id}`}>
                    {r.store.name}
                  </Link>
                  <p className="text-sm text-slate-500">
                    {r.store.address ?? ""} {r.distanceKm ? `• ${r.distanceKm.toFixed(1)} km away` : ""}
                  </p>
                </div>
                {r.item.imageUrl ? (
                  <img
                    src={r.item.imageUrl}
                    alt={r.item.name}
                    className="h-20 w-20 rounded-md object-cover"
                  />
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
