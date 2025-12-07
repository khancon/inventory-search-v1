"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

type Props = {
  points: { id: string; name: string; latitude: number; longitude: number }[];
  center?: [number, number];
  zoom?: number;
  height?: string;
};

export function Map({ points, center, zoom = 11, height = "320px" }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) return;
    if (mapRef.current || !containerRef.current) return;
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    mapRef.current = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: center ?? [points[0]?.longitude ?? 0, points[0]?.latitude ?? 0],
      zoom
    });
  }, [center, points, zoom]);

  useEffect(() => {
    if (!mapRef.current || !process.env.NEXT_PUBLIC_MAPBOX_TOKEN) return;
    mapRef.current.on("load", () => {
      points.forEach((p) => {
        new mapboxgl.Marker().setLngLat([p.longitude, p.latitude]).setPopup(new mapboxgl.Popup().setText(p.name)).addTo(mapRef.current!);
      });
    });
  }, [points]);

  if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
    return <p className="text-sm text-slate-500">Add NEXT_PUBLIC_MAPBOX_TOKEN to see the map.</p>;
  }

  return <div ref={containerRef} className="w-full rounded-lg border border-slate-200" style={{ height }} />;
}
