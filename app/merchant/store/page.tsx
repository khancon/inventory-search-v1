"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Store = {
  id: string;
  name: string;
  description?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
  latitude: number;
  longitude: number;
};

export default function StorePage() {
  const [store, setStore] = useState<Store | null>(null);
  const [form, setForm] = useState<Partial<Store>>({
    latitude: 0,
    longitude: 0
  });
  const [error, setError] = useState<string | null>(null);

  const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("access_token") ?? ""}`,
    "Content-Type": "application/json"
  });

  async function fetchStore() {
    const res = await fetch("/api/stores", { headers: authHeader() });
    const data = await res.json();
    const firstStore = data.stores?.[0];
    if (firstStore) {
      setStore(firstStore);
      setForm(firstStore);
    }
  }

  useEffect(() => {
    fetchStore();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const method = store ? "PUT" : "POST";
    const url = store ? `/api/stores/${store.id}` : "/api/stores";

    const res = await fetch(url, {
      method,
      headers: authHeader(),
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Save failed");
      return;
    }
    setStore(data.store);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Store Settings</h1>
        <p className="text-slate-600">Manage store profile, address, and coordinates.</p>
      </div>

      <Card title="Store Details">
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <div className="space-y-1 md:col-span-2">
            <Label>Name</Label>
            <Input
              value={form.name ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-1 md:col-span-2">
            <Label>Description</Label>
            <Input
              value={form.description ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label>Address</Label>
            <Input
              value={form.address ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label>City</Label>
            <Input
              value={form.city ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label>State</Label>
            <Input
              value={form.state ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label>Postal Code</Label>
            <Input
              value={form.postalCode ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, postalCode: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label>Country</Label>
            <Input
              value={form.country ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label>Latitude</Label>
            <Input
              type="number"
              step="any"
              value={form.latitude ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, latitude: Number(e.target.value) }))}
              required
            />
          </div>
          <div className="space-y-1">
            <Label>Longitude</Label>
            <Input
              type="number"
              step="any"
              value={form.longitude ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, longitude: Number(e.target.value) }))}
              required
            />
          </div>
          {error ? <p className="text-sm text-red-600 md:col-span-2">{error}</p> : null}
          <div className="md:col-span-2">
            <Button type="submit">{store ? "Update store" : "Create store"}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
