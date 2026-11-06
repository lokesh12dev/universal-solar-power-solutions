import { Container } from "@/components/ui";

export default function Loading() {
  return (
    <section className="py-24" aria-busy="true" aria-label="Loading">
      <Container><div className="mx-auto max-w-xl rounded-[2rem] border border-line bg-white p-10 text-center text-slate animate-pulse">Loading solar content…</div></Container>
    </section>
  );
}
