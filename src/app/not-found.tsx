import Link from "next/link";
import { Container } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="py-24"><Container>
      <div className="mx-auto max-w-xl rounded-[2rem] border border-line bg-white p-10 text-center shadow-xl">
        <p className="font-display text-6xl font-extrabold text-navy">404</p>
        <h1 className="mt-3 font-display text-2xl font-extrabold text-navy">Page not found</h1>
        <p className="mt-2 text-slate">The page moved or never existed. Try a solution page or ask us directly.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/" className="rounded-full bg-navy px-6 py-3 font-bold text-cyan">Home</Link>
          <Link href="/contact" className="rounded-full border border-line px-6 py-3 font-bold text-royal">Contact</Link>
        </div>
      </div>
    </Container></section>
  );
}
