# Calculator Model — Residential Estimator (`src/lib/calculator.ts`)
Model version: `indicative-v1` (no external yield provider). UI: `src/components/Calculator.tsx`.
Status: simplified illustrative estimate with engineer-editable assumptions — NOT a
bankable assessment. See also `/terms` ("not a quotation, design or savings guarantee").

## Inputs (units explicit)
| Input | Unit | Required? |
|---|---|---|
| monthlyBill | INR/month | yes (or units override) |
| tariff | INR/kWh | yes |
| monthlyUnitsKnown | kWh/month | optional override |
| propertyType | residential/commercial/industrial | yes (informational — does not change math today) |
| roofSqft | sq ft usable | optional |
| systemType | on-grid/hybrid | yes (informational — battery cost excluded) |

## Assumptions (all editable in UI, shown with results)
- `specificYield` = 1500 kWh/kW/year (Chennai benchmark — operator-entered, NOT fetched
  from PVWatts/NSRDB; coverage for Tamil Nadu micro-climates is unvalidated).
- `sqftPerKw` ≈ 100 sq ft/kW. `performanceRatio` = 1.0 (folded into specificYield).
- `tariffEscalation` = 3%/yr — stored, NOT applied to displayed Year-1 savings (known limitation).
- `co2PerKwh` = 0.82 kg/kWh (CEA grid factor family — document source before marketing use).
- `treesPerTonneCo2` = 45.

## Equations
1. `monthlyUnits = monthlyUnitsKnown>0 ? known : (tariff>0 ? bill/tariff : 0)`
2. `annualUnits = monthlyUnits × 12`
3. `rawKw = annualUnits × 0.9 / specificYield` (sizes to ~90% of use; avoids oversizing under export uncertainty)
4. `suggestedKw = clamp(round(rawKw→0.5 kW), 1–500)` (0 when no usage)
5. `annualGeneration = suggestedKw × specificYield`; `roofNeeded = suggestedKw × sqftPerKw`; `roofFits = roof>0 ? roof ≥ roofNeeded : null`
6. `annualSavingsYear1 = annualGeneration × tariff × 0.85` (conservative self-consumption + export-value factor; excludes net-metering caps, shade, tariff changes, hybrid battery cost)
7. `co2AvoidedTpa = annualGeneration × 0.82 / 1000`; `trees = round(co2 × 45)`

## Integrity properties (tested in `tests/calculator.test.mjs`)
- Deterministic pure function; no network, no randomness.
- Hardened: non-finite inputs coerce to safe fallbacks (never NaN/Infinity in outputs); negative assumption factors clamp to 0; finite negatives keep legacy behaviour (documented test #9).
- Savings can never exceed the modelled base: savings = generation × tariff × 0.85 where generation derives from ≤90% of stated use — test asserts this bound.
- Edge cases covered: 0 bill, roof too small/large, absurd values, invalid assumptions.

## Known limits / next model upgrade
- No location-aware yield provider (no PVWatts/NSRDB adapter; Indian-location coverage unverified — do NOT claim it). A `SolarYieldProvider` abstraction is future work, not present.
- No self-consumption/export split, no degradation, no O&M/financing/discount-rate modelling → NO payback/NPV/IRR outputs exist (correctly absent; do not add without a validated model).
- Commercial ROI estimator from the brief is NOT implemented (no validated tariff/demand/export model for C&I) — the planner routes commercial users to human consultation instead. Honest gap, see launch checklist.
