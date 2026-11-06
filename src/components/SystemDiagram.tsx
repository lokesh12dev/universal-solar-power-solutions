"use client";
import { useState } from "react";
import { Container } from "@/components/ui";
import { Sequence, Step, Reveal } from "@/components/effects";

/* Complete-system diagram — "Beyond the panel. Into a complete energy system."
   Interactive SVG flow with accessible node buttons. Only components relevant
   to the described on-grid/hybrid rooftop system are shown; battery is marked
   optional. Path animation is illustrative — electrons don't travel as light trails. */

const NODES = [
  {
    id: "modules",
    name: "Solar modules",
    text: "Rooftop arrays convert daylight to DC electricity. Position, tilt, and shading decide how much of the sun becomes usable power.",
  },
  {
    id: "mounting",
    name: "Mounting structure",
    text: "Rails and anchors fix the array to sheet, RCC, or ground footings — surveyed for wind load, waterproofing, and maintenance access.",
  },
  {
    id: "inverter",
    name: "Inverter",
    text: "Converts DC to grid-synchronised AC for your building. String sizing follows the array layout and your sanctioned load.",
  },
  {
    id: "protection",
    name: "Electrical protection",
    text: "DC/AC isolators, surge protection, and earthing sit between array, inverter, and distribution board — the safety layer of the design.",
  },
  {
    id: "loads",
    name: "Your building",
    text: "Solar is consumed first by daytime loads. What you don't use flows onward — how much that is worth depends on your tariff and export rules.",
  },
  {
    id: "battery",
    name: "Battery storage (optional)",
    text: "Hybrid systems add batteries for essential loads during outages. kW is instantaneous power; kWh is stored energy — a site study sizes both.",
  },
  {
    id: "grid",
    name: "Grid + monitoring",
    text: "The grid absorbs surplus and covers shortfalls; monitoring shows generation, consumption, and faults so underperformance gets noticed early.",
  },
] as const;

type NodeId = (typeof NODES)[number]["id"];

// Node anchor points on a 640x300 canvas (responsive via viewBox).
const POS: Record<NodeId, { x: number; y: number }> = {
  modules: { x: 90, y: 70 },
  mounting: { x: 90, y: 190 },
  inverter: { x: 260, y: 130 },
  protection: { x: 390, y: 130 },
  loads: { x: 520, y: 60 },
  battery: { x: 520, y: 200 },
  grid: { x: 390, y: 250 },
};

const LINKS: [NodeId, NodeId][] = [
  ["modules", "inverter"],
  ["mounting", "inverter"],
  ["inverter", "protection"],
  ["protection", "loads"],
  ["protection", "battery"],
  ["protection", "grid"],
];

export function SystemDiagram() {
  const [active, setActive] = useState<NodeId>("modules");
  const node = NODES.find((n) => n.id === active)!;
  const linkOn = (a: NodeId, b: NodeId) => a === active || b === active;

  return (
    <section aria-labelledby="sys-title" className="bg-coalsec py-16 text-white sm:py-24">
      <Container>
        <Sequence>
          <Step><p className="inline-flex items-center gap-2 rounded-full border border-goldbright/30 bg-white/5 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-goldpale"><span className="h-1.5 w-1.5 rounded-full bg-goldbright" /> Complete system</p></Step>
          <Step><h2 id="sys-title" className="display-section mt-4 font-extrabold text-white">Beyond the panel.<br />Into a complete energy system.</h2></Step>
          <Step><p className="mt-3 max-w-2xl text-white/65">A solar installation brings together equipment, site conditions, electrical design, and installation planning. Each element needs to work with the others. Select a component to understand its role.</p></Step>
        </Sequence>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          <Reveal className="min-w-0">
            <div className="rounded-[1.6rem] border border-white/10 bg-coal p-4 sm:p-6">
              <svg viewBox="0 0 640 300" className="h-auto w-full" role="img" aria-label={`System flow diagram. Selected component: ${node.name}.`}>
                {LINKS.map(([a, b]) => (
                  <line
                    key={`${a}-${b}`}
                    x1={POS[a].x} y1={POS[a].y} x2={POS[b].x} y2={POS[b].y}
                    stroke={linkOn(a, b) ? "#DDB56B" : "rgba(210,225,240,.22)"}
                    strokeWidth={linkOn(a, b) ? 2.5 : 1.5}
                    strokeDasharray={linkOn(a, b) ? "6 5" : "none"}
                    className={linkOn(a, b) ? "sys-flow" : undefined}
                  />
                ))}
                {(Object.keys(POS) as NodeId[]).map((id) => {
                  const p = POS[id];
                  const is = id === active;
                  const label = NODES.find((n) => n.id === id)!.name.replace(" (optional)", "*");
                  return (
                    <g key={id} opacity={is ? 1 : 0.55} style={{ transition: "opacity .3s ease" }}>
                      <circle cx={p.x} cy={p.y} r={is ? 26 : 20} fill={is ? "#DDB56B" : "#101A27"} stroke={is ? "#F0CF8C" : "rgba(210,225,240,.4)"} strokeWidth="2" />
                      <text x={p.x} y={p.y - 32} textAnchor="middle" fill={is ? "#F0CF8C" : "#A8B2BE"} fontSize="11" fontWeight="700">{label}</text>
                    </g>
                  );
                })}
              </svg>
              <p className="mt-2 text-xs leading-relaxed text-white/45">* Optional — hybrid systems only. Animated dashes illustrate energy flow direction, not literal electron movement.</p>
            </div>
          </Reveal>

          <div>
            <div role="group" aria-label="System components" className="grid gap-2.5">
              {NODES.map((n) => {
                const is = n.id === active;
                return (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => setActive(n.id)}
                    aria-pressed={is}
                    className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition ${is ? "border-goldbright/60 bg-white/[0.07]" : "border-white/10 bg-white/[0.02] hover:border-white/25"}`}
                  >
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${is ? "bg-goldbright" : "bg-white/25"}`} aria-hidden="true" />
                    <span className={`text-[15px] font-bold ${is ? "text-white" : "text-white/70"}`}>{n.name}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-4 rounded-2xl border border-goldbright/30 bg-white/[0.04] p-5" aria-live="polite">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-goldpale">{node.name}</p>
              <p className="mt-2 text-[15px] leading-relaxed text-white/75">{node.text}</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
