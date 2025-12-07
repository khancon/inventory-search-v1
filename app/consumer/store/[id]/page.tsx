"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";

type Store = {
  id: string;
  name: string;
  description?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
};

type InventoryRow = {
  id: string;
  quantity: number;
  item: { id: string; name: string; description?: string | null; imageUrl?: string | null };
};

export default function StoreDetailPage() {
  const params = useParams<{ id: string }>();
  const storeId = params.id;
  const [store, setStore] = useState<Store | null>(null);
  const [inventory, setInventory] = useState<InventoryRow[]>([]);

  useEffect(() => {
    async function load() {
      const storeRes = await fetch(`/api/stores/${storeId}`);
      const storeData = await storeRes.json();
      setStore(storeData.store);

      const invRes = await fetch(`/api/inventory?storeId=${storeId}`);
      const invData = await invRes.json();
      setInventory(invData.inventory ?? []);
    }
    load();
  }, [storeId]);

  if (!store) return <p className="text-slate-600">Loading store...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{store.name}</h1>
        {store.description ? <p className="text-slate-600">{store.description}</p> : null}
        <p className="text-sm text-slate-500">
          {[store.address, store.city, store.state, store.postalCode, store.country].filter(Boolean).join(", ")}
        </p>
      </div>

      <Card title="Available items">
        <div className="grid gap-3 sm:grid-cols-2">
          {inventory.map((row) => (
            <div key={row.id} className="rounded-lg border border-slate-200 p-4">
              <p className="text-base font-semibold">{row.item.name}</p>
              {row.item.description ? <p className="text-sm text-slate-600">{row.item.description}</p> : null}
              <p className="text-sm text-slate-500">In stock: {row.quantity}</p>
              {row.item.imageUrl ? (
                <img src={row.item.imageUrl} alt={row.item.name} className="mt-2 h-20 w-full rounded-md object-cover" />
              ) : null}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
