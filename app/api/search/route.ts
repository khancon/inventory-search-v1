import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { searchSchema } from "@/lib/validators";

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const parsed = searchSchema.safeParse({
    query: searchParams.get("query") ?? undefined,
    lat: searchParams.get("lat") ? Number(searchParams.get("lat")) : undefined,
    lng: searchParams.get("lng") ? Number(searchParams.get("lng")) : undefined,
    radiusKm: searchParams.get("radiusKm") ? Number(searchParams.get("radiusKm")) : undefined,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined
  });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { query, lat, lng, radiusKm = 20, limit = 25 } = parsed.data;

  const inventory = await prisma.inventory.findMany({
    where: {
      quantity: { gt: 0 },
      item: query
        ? {
            name: { contains: query, mode: "insensitive" }
          }
        : undefined
    },
    include: {
      item: true,
      store: true
    },
    take: 200
  });

  const enriched = inventory
    .map((row) => {
      const distanceKm =
        lat !== undefined && lng !== undefined
          ? haversineKm(lat, lng, row.store.latitude, row.store.longitude)
          : null;
      return { ...row, distanceKm };
    })
    .filter((row) => (row.distanceKm === null ? true : row.distanceKm <= radiusKm))
    .sort((a, b) => {
      if (a.distanceKm === null || b.distanceKm === null) return 0;
      return a.distanceKm - b.distanceKm;
    })
    .slice(0, limit);

  return NextResponse.json({ results: enriched });
}
