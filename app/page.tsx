import Link from "next/link";

const cards = [
  {
    title: "Merchant Portal",
    description: "Manage stores, items, inventory, and media uploads.",
    href: "/merchant/dashboard"
  },
  {
    title: "Consumer Search",
    description: "Find products in nearby stores with live inventory.",
    href: "/consumer/home"
  }
];

export default function HomePage() {
  return (
    <main className="space-y-10">
      <header className="space-y-4">
        <p className="text-sm uppercase tracking-wide text-brand-600">Inventory + Local Search</p>
        <h1 className="text-3xl font-bold text-slate-900">Connect shoppers to nearby inventory</h1>
        <p className="text-slate-600">
          Merchants keep their stock fresh; consumers discover items available around them. Built
          with Next.js, Supabase, Prisma, and Mapbox.
        </p>
      </header>
      <section className="grid gap-6 md:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <h2 className="text-xl font-semibold">{card.title}</h2>
            <p className="mt-2 text-slate-600">{card.description}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
