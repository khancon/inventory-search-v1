"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Store = { id: string; name: string };
type Item = { id: string; name: string };
type InventoryRow = { id: string; storeId: string; itemId: string; quantity: number; item: Item };

export default function InventoryPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [inventory, setInventory] = useState<InventoryRow[]>([]);
  const [form, setForm] = useState<{ storeId?: string; itemId?: string; quantity?: number }>({});
  const [error, setError] = useState<string | null>(null);

  const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("access_token") ?? ""}`,
    "Content-Type": "application/json"
  });

  async function fetchStores() {
    const res = await fetch("/api/stores", { headers: authHeader() });
    const data = await res.json();
    setStores(data.stores ?? []);
  }

  async function fetchItems() {
    const res = await fetch("/api/items");
    const data = await res.json();
    setItems(data.items ?? []);
  }

  async function fetchInventory(storeId?: string) {
    const res = await fetch(`/api/inventory${storeId ? `?storeId=${storeId}` : ""}`, {
      headers: authHeader()
    });
    const data = await res.json();
    setInventory(data.inventory ?? []);
  }

  useEffect(() => {
    fetchStores();
    fetchItems();
  }, []);

  useEffect(() => {
    fetchInventory(form.storeId);
  }, [form.storeId]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.storeId || !form.itemId || form.quantity === undefined) {
      setError("Store, item, and quantity are required");
      return;
    }
    const res = await fetch("/api/inventory", {
      method: "POST",
      headers: authHeader(),
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Failed to save");
      return;
    }
    setForm((f) => ({ ...f, itemId: undefined, quantity: undefined }));
    fetchInventory(form.storeId);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Inventory</h1>
        <p className="text-slate-600">Attach items to a store and set stock quantities.</p>
      </div>

      <Card title="Add / Update Inventory">
        <form className="grid gap-4 md:grid-cols-4" onSubmit={handleSave}>
          <div className="space-y-1 md:col-span-1">
            <Label>Store</Label>
            <select
              className="w-full rounded-md border border-slate-200 px-3 py-2"
              value={form.storeId ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, storeId: e.target.value }))}
            >
              <option value="">Select store</option>
              {stores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1 md:col-span-1">
            <Label>Item</Label>
            <select
              className="w-full rounded-md border border-slate-200 px-3 py-2"
              value={form.itemId ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, itemId: e.target.value }))}
            >
              <option value="">Select item</option>
              {items.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1 md:col-span-1">
            <Label>Quantity</Label>
            <Input
              type="number"
              min={0}
              value={form.quantity ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, quantity: Number(e.target.value) }))}
            />
          </div>
          <div className="flex items-end md:col-span-1">
            <Button type="submit" className="w-full">
              Save
            </Button>
          </div>
          {error ? <p className="text-sm text-red-600 md:col-span-4">{error}</p> : null}
        </form>
      </Card>

      <Card title="Current Inventory">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-600">
                <th className="px-3 py-2">Item</th>
                <th className="px-3 py-2">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((row) => (
                <tr key={row.id} className="border-t border-slate-100">
                  <td className="px-3 py-2 font-medium text-slate-900">{row.item.name}</td>
                  <td className="px-3 py-2">{row.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
