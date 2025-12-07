"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ConsumerHome() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [lat, setLat] = useState<string>("");
  const [lng, setLng] = useState<string>("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (lat) params.set("lat", lat);
    if (lng) params.set("lng", lng);
    router.push(`/consumer/search?${params.toString()}`);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-wide text-brand-600">Find nearby inventory</p>
        <h1 className="text-3xl font-bold text-slate-900">Search products near you</h1>
        <p className="text-slate-600">
          Search across stores and see what&apos;s in stock before you head out.
        </p>
      </header>
      <Card>
        <form className="grid gap-4 md:grid-cols-4" onSubmit={handleSubmit}>
          <div className="md:col-span-2">
            <Label>What are you looking for?</Label>
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. batteries" />
          </div>
          <div>
            <Label>Latitude</Label>
            <Input value={lat} onChange={(e) => setLat(e.target.value)} placeholder="40.7128" />
          </div>
          <div>
            <Label>Longitude</Label>
            <Input value={lng} onChange={(e) => setLng(e.target.value)} placeholder="-74.0060" />
          </div>
          <div className="md:col-span-4">
            <Button type="submit">Search nearby</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
