import Link from "next/link";
import { Card } from "@/components/ui/card";

const links = [
  { href: "/merchant/items", title: "Items", desc: "Create and manage items" },
  { href: "/merchant/inventory", title: "Inventory", desc: "Update stock levels per store" },
  { href: "/merchant/store", title: "Store Settings", desc: "Location, address, hours" }
];

export default function MerchantDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-wide text-brand-600">Merchant Portal</p>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600">Manage your store, items, and live inventory.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card title={link.title} description={link.desc} />
          </Link>
        ))}
      </div>
    </div>
  );
}
