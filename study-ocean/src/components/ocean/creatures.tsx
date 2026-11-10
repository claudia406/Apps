import type { PlantSpec, CreatureSpec } from "@/components/ocean/oceanVisual";

const PLANT_COLORS: Record<PlantSpec["kind"], { a: string; b: string }> = {
  seaweed: { a: "#8FB7AD", b: "#4F8F82" },
  kelp: { a: "#A8CFC7", b: "#3C6B5F" },
  coral: { a: "#E4B8C4", b: "#C98FA4" },
  coralBranch: { a: "#F0C9BE", b: "#D59A8A" },
};

export function Plant({ plant }: { plant: PlantSpec }) {
  const colors = PLANT_COLORS[plant.kind];
  const sway = plant.wide ? "sway-wide" : "sway";
  const height = plant.kind === "kelp" ? 56 : plant.kind === "coral" || plant.kind === "coralBranch" ? 20 : 40;

  // 外側のgは配置(translate/scale)専用、内側のgは揺れアニメーション専用にして
  // CSSアニメーションがSVGのtransform属性を上書きしてしまう問題を避ける。
  return (
    <g transform={`translate(${plant.x} 100) scale(${plant.scale})`}>
      <g
        style={{
          transformOrigin: "0px 0px",
          animation: `${sway} ${4.5 + plant.delay}s ease-in-out infinite`,
          animationDelay: `${plant.delay}s`,
        }}
      >
        {plant.kind === "coral" || plant.kind === "coralBranch" ? (
          <CoralGlyph height={height} a={colors.a} b={colors.b} branchy={plant.kind === "coralBranch"} />
        ) : (
          <SeaweedGlyph height={height} a={colors.a} b={colors.b} wide={plant.kind === "kelp"} />
        )}
      </g>
    </g>
  );
}

function SeaweedGlyph({ height, a, b, wide }: { height: number; a: string; b: string; wide: boolean }) {
  const w = wide ? 7 : 4.2;
  return (
    <g>
      <path
        d={`M0,0 C ${-w},-${height * 0.35} ${w},-${height * 0.55} 0,-${height * 0.8} C ${-w * 0.7},-${height * 0.92} ${w * 0.6},-${height} 0,-${height}`}
        stroke={a}
        strokeWidth={wide ? 3.4 : 2.1}
        fill="none"
        strokeLinecap="round"
        opacity={0.95}
      />
      <path
        d={`M${wide ? 3 : 1.6},0 C ${-w * 0.5},-${height * 0.3} ${w * 1.1},-${height * 0.5} ${wide ? 1 : 0.5},-${height * 0.74}`}
        stroke={b}
        strokeWidth={wide ? 2.8 : 1.7}
        fill="none"
        strokeLinecap="round"
        opacity={0.75}
      />
    </g>
  );
}

function CoralGlyph({ height, a, b, branchy }: { height: number; a: string; b: string; branchy: boolean }) {
  return (
    <g>
      <path
        d={`M0,0 C -6,-${height * 0.6} -2,-${height} 0,-${height} C 2,-${height} 6,-${height * 0.6} 0,0 Z`}
        fill={a}
        opacity={0.92}
      />
      {branchy && (
        <>
          <path
            d={`M-1,-${height * 0.3} C -7,-${height * 0.7} -5,-${height * 1.15} -2,-${height * 1.2}`}
            stroke={b}
            strokeWidth={2.2}
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={`M2,-${height * 0.4} C 7,-${height * 0.8} 6,-${height * 1.1} 3,-${height * 1.2}`}
            stroke={b}
            strokeWidth={2.2}
            fill="none"
            strokeLinecap="round"
          />
        </>
      )}
      {Array.from({ length: 4 }).map((_, i) => (
        <circle key={i} cx={(i - 1.5) * 2.4} cy={-height * (0.3 + i * 0.18)} r={1.1} fill={b} opacity={0.55} />
      ))}
    </g>
  );
}

export function Creature({ creature }: { creature: CreatureSpec }) {
  const flip = creature.flipped ? -1 : 1;
  // 外側のgは配置(translate/scale/反転)専用、内側のgは漂う/跳ねるアニメーション専用。
  return (
    <g transform={`translate(${creature.x} ${creature.y}) scale(${creature.scale * flip}, ${creature.scale})`}>
      <g
        style={{
          transformOrigin: "0px 0px",
          animation: creatureAnimation(creature),
          animationDelay: `${creature.delay}s`,
        }}
      >
        {creature.kind === "fish" && <FishGlyph color="#6F9E90" accent="#EAF3F1" />}
        {creature.kind === "fishColorful" && <FishGlyph color="#D59A8A" accent="#F3D9CE" stripes />}
        {creature.kind === "shrimp" && <ShrimpGlyph />}
        {creature.kind === "crab" && <CrabGlyph />}
        {creature.kind === "shell" && <ShellGlyph />}
        {creature.kind === "ray" && <RayGlyph />}
      </g>
    </g>
  );
}

function creatureAnimation(c: CreatureSpec): string {
  switch (c.kind) {
    case "fish":
    case "fishColorful":
      return `drift-right ${9 + c.delay}s ease-in-out infinite alternate`;
    case "ray":
      return `drift-right ${14 + c.delay}s ease-in-out infinite alternate`;
    case "shrimp":
    case "crab":
      return `bob ${3 + c.delay}s ease-in-out infinite`;
    case "shell":
      return `shimmer ${5 + c.delay}s ease-in-out infinite`;
  }
}

function FishGlyph({ color, accent, stripes }: { color: string; accent: string; stripes?: boolean }) {
  return (
    <g>
      <path d="M-7,0 C -4,-4 4,-4 8,0 C 4,4 -4,4 -7,0 Z" fill={color} />
      <path d="M-7,0 L-11,-3.2 L-11,3.2 Z" fill={color} opacity={0.85} />
      {stripes && <path d="M-1,-3.4 L-1,3.4 M2.5,-3.6 L2.5,3.6" stroke={accent} strokeWidth={1} opacity={0.8} />}
      <circle cx={5.2} cy={-0.6} r={0.7} fill={accent} />
    </g>
  );
}

function ShrimpGlyph() {
  return (
    <g>
      {/* 体: 緩やかに弧を描く体節 */}
      <path
        d="M-6,2.6 C -7,-1.4 -3.4,-4.6 1.6,-4.2 C 5,-3.9 6.6,-2 6.2,0.4 C 5.9,2.2 4,2.6 2.6,1.4 C 1.6,2.6 -0.4,2.9 -1.4,1.8 C -2.4,3 -4.6,3.4 -6,2.6 Z"
        fill="#E7A99A"
        opacity={0.94}
      />
      {/* 体節の節目 */}
      <path d="M-3.4,-1.6 C -2.4,0.4 -1.2,1.6 0.4,2.2" stroke="#C97E6C" strokeWidth={0.5} fill="none" opacity={0.6} />
      {/* 尾びれ */}
      <path d="M-6,2.6 L-9.2,1.2 L-8.6,3 L-9.6,4.4 Z" fill="#E7A99A" opacity={0.9} />
      {/* 脚 */}
      <path d="M-2,2.8 L-2.6,5 M0.4,3 L0,5.2 M2.6,2.2 L3,4.4" stroke="#C97E6C" strokeWidth={0.6} strokeLinecap="round" />
      {/* 触角 */}
      <path d="M1.8,-4 C 4,-6.4 6.4,-7.2 9.4,-7" stroke="#C97E6C" strokeWidth={0.6} fill="none" strokeLinecap="round" />
      <path d="M1,-4 C 2.4,-6.8 4.4,-8 7,-8.4" stroke="#C97E6C" strokeWidth={0.5} fill="none" strokeLinecap="round" opacity={0.8} />
      <circle cx={5} cy={-3} r={0.7} fill="#C97E6C" />
    </g>
  );
}

function CrabGlyph() {
  return (
    <g>
      <ellipse cx={0} cy={0} rx={5.4} ry={3.6} fill="#D59A8A" />
      <path d="M-5,-1 L-9,-3.4 M5,-1 L9,-3.4" stroke="#B4584A" strokeWidth={1.1} strokeLinecap="round" />
      <circle cx={-5.4} cy={-3.6} r={0.9} fill="#B4584A" />
      <circle cx={5.4} cy={-3.6} r={0.9} fill="#B4584A" />
      <path d="M-3,3.2 L-4.6,5.4 M0,3.6 L0,5.8 M3,3.2 L4.6,5.4" stroke="#B4584A" strokeWidth={1} strokeLinecap="round" />
    </g>
  );
}

function ShellGlyph() {
  return (
    <g>
      <path
        d="M0,3 C -6,3 -7,-3 0,-6 C 7,-3 6,3 0,3 Z"
        fill="#F0E4D6"
        stroke="#D8C8E4"
        strokeWidth={0.6}
      />
      <path d="M0,-6 L0,3 M-3.4,2.2 L-2,-4.6 M3.4,2.2 L2,-4.6" stroke="#C7A98F" strokeWidth={0.6} opacity={0.7} />
    </g>
  );
}

function RayGlyph() {
  return (
    <g opacity={0.95}>
      <path
        d="M0,-6 C -16,-2 -16,6 0,10 C 16,6 16,-2 0,-6 Z"
        fill="#B8C9E0"
      />
      <path d="M0,10 C -1.5,16 1.5,20 0,26" stroke="#B8C9E0" strokeWidth={1.6} fill="none" strokeLinecap="round" />
      <circle cx={-3} cy={-1} r={0.7} fill="#5B6F8F" />
      <circle cx={3} cy={-1} r={0.7} fill="#5B6F8F" />
    </g>
  );
}
