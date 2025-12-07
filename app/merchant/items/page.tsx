"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/merchant/ImageUpload";

type Item = {
  id: string;
  name: string;
  description?: string | null;
  category?: string | null;
  imageUrl?: string | null;
};

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Item>>({});

  async function fetchItems() {
    const res = await fetch("/api/items");
    const data = await res.json();
    setItems(data.items ?? []);
  }

  useEffect(() => {
    fetchItems();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token") ?? ""}`
      },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Failed to create item");
      setLoading(false);
      return;
    }
    setForm({});
    await fetchItems();
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Items</h1>
        <p className="text-slate-600">Create catalog items to use across stores.</p>
      </div>
      <Card title="Add Item">
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleCreate}>
          <div className="space-y-1 sm:col-span-2">
            <Label>Name</Label>
            <Input
              value={form.name ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <Label>Description</Label>
            <Input
              value={form.description ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label>Category</Label>
            <Input
              value={form.category ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label>Image URL</Label>
            <Input
              value={form.imageUrl ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
              placeholder="https://..."
            />
            <ImageUpload onUploaded={(url) => setForm((f) => ({ ...f, imageUrl: url }))} />
          </div>
          {error ? <p className="text-sm text-red-600 sm:col-span-2">{error}</p> : null}
          <div className="sm:col-span-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Create item"}
            </Button>
          </div>
        </form>
      </Card>

      <Card title="Items">
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <div key={item.id} className="rounded-lg border border-slate-200 p-4">
              <p className="text-base font-semibold">{item.name}</p>
              {item.category ? <p className="text-sm text-slate-500">{item.category}</p> : null}
              {item.description ? <p className="mt-1 text-sm text-slate-600">{item.description}</p> : null}
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.name} className="mt-2 h-24 w-full rounded-md object-cover" />
              ) : null}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
