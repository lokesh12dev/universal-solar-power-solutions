"use client";
import { Container } from "@/components/ui";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="py-24"><Container>
      <div className="mx-auto max-w-xl rounded-[2rem] border border-line bg-white p-10 text-center shadow-xl">
        <h1 className="font-display text-2xl font-extrabold text-navy">Something went wrong</h1>
        <p className="mt-2 text-slate">Please retry. If it persists, call us directly — your enquiry matters.</p>
        <button type="button" onClick={reset} className="mt-6 rounded-full bg-navy px-6 py-3 font-bold text-cyan">Try again</button>
      </div>
    </Container></section>
  );
}
