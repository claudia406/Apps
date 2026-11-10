"use client";

import type { OceanState } from "@/lib/types";
import {
  buildBasePlants,
  buildCreatures,
  buildFeaturePlants,
  creatureVisibleAtHealth,
  healthFraction,
  unlockedPlantIds,
} from "@/components/ocean/oceanVisual";
import { Creature, Plant } from "@/components/ocean/creatures";

interface OceanSceneProps {
  state: OceanState;
  className?: string;
}

export default function OceanScene({ state, className }: OceanSceneProps) {
  const frac = healthFraction(state.health);
  const unlockedIds = state.unlocked.map((u) => u.id);

  // 生成コストが小さいため、手動メモ化はせずコンパイラの最適化に委ねる
  const basePlants = buildBasePlants(state.health);
  const featurePlants = buildFeaturePlants(unlockedPlantIds(state));
  const creatures = buildCreatures(unlockedIds, state.finalFormReached);

  const visibleCreatures = creatures.filter((c) => creatureVisibleAtHealth(c.kind, state.health));

  // health が低いほど彩度を落とし、退化の寂しさを表現する
  const saturation = 0.35 + frac * 0.65;
  const brightness = Math.min(1, 0.9 + frac * 0.12);
  const witherOpacity = state.phase === "dormant" ? 0.4 : state.phase === "degenerating" ? 0.18 * (1 - frac) : 0;

  return (
    <div className={className}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMax slice"
        className="w-full h-full"
        role="img"
        aria-label={`現在の海の様子: ${describePhase(state)}`}
      >
        <defs>
          <linearGradient id="water-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--sea-mist)" />
            <stop offset="55%" stopColor="var(--soft-aqua)" />
            <stop offset="100%" stopColor="var(--sage)" />
          </linearGradient>
          <linearGradient id="sand-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--sand)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--sand)" />
          </linearGradient>
          <filter id="ocean-tone">
            <feColorMatrix type="saturate" values={String(saturation)} />
          </filter>
        </defs>

        <rect x="0" y="0" width="100" height="100" fill="url(#water-gradient)" opacity={brightness} />

        {/* 光の粒 */}
        {frac > 0.15 &&
          Array.from({ length: 5 }).map((_, i) => (
            <circle
              key={i}
              cx={10 + i * 19}
              cy={8 + (i % 2) * 10}
              r={0.5 + (i % 3) * 0.25}
              fill="#FFFFFF"
              opacity={0.3 * frac}
              style={{ animation: `shimmer ${4 + i}s ease-in-out infinite`, animationDelay: `${i * 0.6}s` }}
            />
          ))}

        <g filter="url(#ocean-tone)">
          <path d="M0,88 C 18,84 30,92 50,88 C 70,84 82,92 100,88 L100,100 L0,100 Z" fill="url(#sand-gradient)" />

          {basePlants.map((p) => (
            <Plant key={p.id} plant={p} />
          ))}
          {featurePlants.map((p) => (
            <Plant key={p.id} plant={p} />
          ))}
          {visibleCreatures.map((c) => (
            <Creature key={c.id} creature={c} />
          ))}
        </g>

        {witherOpacity > 0 && (
          <rect x="0" y="0" width="100" height="100" fill="#4A3C2F" opacity={witherOpacity} style={{ mixBlendMode: "multiply" }} />
        )}
      </svg>
    </div>
  );
}

function describePhase(state: OceanState): string {
  switch (state.phase) {
    case "growing":
      return `健やかに成長中、連続${state.streakCurrent}日目`;
    case "recovering":
      return "回復中";
    case "degenerating":
      return "少しずつ元気がなくなっている";
    case "dormant":
      return "休眠状態";
  }
}
