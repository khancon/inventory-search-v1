"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";

type Item = {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
};

export default function ItemDetailPage() {
  const params = useParams<{ id: string }>();
  const itemId = params.id;
  const [item, setItem] = useState<Item | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/items/${itemId}`);
      const data = await res.json();
      setItem(data.item);
    }
    load();
  }, [itemId]);

  if (!item) return <p className="text-slate-600">Loading item...</p>;

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="h-32 w-32 rounded-md object-cover" />
        ) : null}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{item.name}</h1>
          {item.description ? <p className="text-slate-600">{item.description}</p> : null}
        </div>
      </div>
      <Card description="Nearby inventory coming via search results. Use the search page to find stores carrying this item." />
    </div>
  );
}
