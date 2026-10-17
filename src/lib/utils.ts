export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
export const telHref = (p: string) => `tel:${p.replace(/[\s-]/g, "")}`;
export const waHref = (p: string, msg: string) =>
  `https://wa.me/${p.replace(/[^0-9]/g, "").replace(/^91(?=\d{10}$)/, "91")}?text=${encodeURIComponent(msg)}`;
