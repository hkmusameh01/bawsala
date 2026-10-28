import type { Challenge } from "@/lib/types";

/** خط القواعد: التصفية، الحد اليومي، البداية، والهدف على محور واحد */
export default function RuleLine({ c }: { c: Challenge }) {
  const t = c.targets[0] ?? 0;
  const ml = c.maxLossPct;
  const dl = c.dailyPct;
  const lo = 100 - ml - 1.5;
  const hi = 100 + Math.max(t, 3) + 1.5;
  const x = (v: number) => ((v - lo) / (hi - lo)) * 100;
  const trail = c.ddType !== "static";

  const Mark = ({ v, color, pos, children }: { v: number; color: string; pos: "up" | "down"; children: React.ReactNode }) => {
    const px = x(v);
    const edge = px < 12 ? " edge-l" : px > 88 ? " edge-r" : "";
    return (
      <>
        <div className="mk" style={{ left: `${px}%`, background: color }} />
        <div className={`lb ${pos}${edge}`} style={{ left: `${px}%` }}>{children}</div>
      </>
    );
  };

  const label = `حد التصفية ${ml}%${dl ? `، الحد اليومي ${dl}%` : ""}${t ? `، الهدف ${t}%` : "، بدون هدف"}`;
  return (
    <div className="rl" role="img" aria-label={label}>
      <div className="track" />
      <div className="dead" style={{ width: `${x(100 - ml)}%` }} />
      {t > 0 && <div className="safe" style={{ left: `${x(100)}%`, width: `${x(100 + t) - x(100)}%` }} />}
      <Mark v={100 - ml} color="var(--loss)" pos="down">التصفية <b>-{ml}%</b>{trail ? " ↗" : ""}</Mark>
      {dl ? <Mark v={100 - dl} color="var(--warn)" pos="up">يومي <b>-{dl}%</b></Mark> : null}
      <Mark v={100} color="var(--ink)" pos="down">البداية</Mark>
      {t > 0 && <Mark v={100 + t} color="var(--gain)" pos="up">الهدف <b>+{t}%</b></Mark>}
    </div>
  );
}
