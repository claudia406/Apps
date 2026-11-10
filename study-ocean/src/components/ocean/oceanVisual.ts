import type { OceanState } from "@/lib/types";
import { UNLOCKS } from "@/lib/oceanContent";

export interface PlantSpec {
  id: string;
  kind: "seaweed" | "kelp" | "coral" | "coralBranch";
  x: number;
  scale: number;
  hueShift: number;
  delay: number;
  wide: boolean;
}

export interface CreatureSpec {
  id: string;
  kind: "fish" | "fishColorful" | "shrimp" | "crab" | "shell" | "ray";
  x: number;
  y: number;
  scale: number;
  delay: number;
  flipped: boolean;
}

import { createSeededRandom, rangeFrom } from "@/components/ocean/seededRandom";

/** health(0-60) を 0..1 に正規化 */
export function healthFraction(health: number): number {
  return Math.max(0, Math.min(1, health / 60));
}

/** 基礎となる植物群(海草・サンゴ)の構成。health に応じて密度・大きさが変わる。 */
export function buildBasePlants(health: number): PlantSpec[] {
  const frac = healthFraction(health);
  const rand = createSeededRandom("study-ocean-plants-v1");
  const count = Math.round(2 + frac * 8); // 2 ~ 10
  const plants: PlantSpec[] = [];
  const kinds: PlantSpec["kind"][] = ["seaweed", "coral", "kelp", "coralBranch"];

  for (let i = 0; i < count; i++) {
    const kind = kinds[i % kinds.length];
    plants.push({
      id: `base-${i}`,
      kind,
      x: 4 + (i / Math.max(1, count - 1)) * 92 + rangeFrom(rand, -3, 3),
      scale: (0.55 + frac * 0.55) * rangeFrom(rand, 0.85, 1.15),
      hueShift: rangeFrom(rand, -6, 6),
      delay: rangeFrom(rand, 0, 2.2),
      wide: i % 3 === 0,
    });
  }
  return plants;
}

/** 解放済みの生き物を画面上の固定位置に配置する(シード固定で毎回同じ配置) */
export function buildCreatures(unlockedIds: string[], finalFormReached: boolean): CreatureSpec[] {
  const rand = createSeededRandom("study-ocean-creatures-v1");
  const specs: CreatureSpec[] = [];

  const kindByUnlock: Record<string, CreatureSpec["kind"] | null> = {
    "fish-small-school": "fish",
    "shrimp-1": "shrimp",
    "coral-branch": null, // 植物として別扱い
    "crab-1": "crab",
    "kelp-tall": null,
    "shell-1": "shell",
    "fish-colorful": "fishColorful",
    "final-ray": "ray",
  };

  for (const id of unlockedIds) {
    const kind = kindByUnlock[id];
    if (!kind) continue;
    const yBand = kind === "crab" || kind === "shell" ? [78, 90] : kind === "ray" ? [18, 32] : [30, 60];
    specs.push({
      id,
      kind,
      x: rangeFrom(rand, 12, 88),
      y: rangeFrom(rand, yBand[0], yBand[1]),
      scale: rangeFrom(rand, 0.85, 1.15),
      delay: rangeFrom(rand, 0, 3),
      flipped: rand() > 0.5,
    });
  }

  if (finalFormReached && !specs.some((s) => s.kind === "ray")) {
    specs.push({ id: "final-ray", kind: "ray", x: 60, y: 22, scale: 1, delay: 0.5, flipped: false });
  }

  return specs;
}

const FEATURE_PLANT_KIND: Record<string, PlantSpec["kind"] | undefined> = {
  "coral-branch": "coralBranch",
  "kelp-tall": "kelp",
};

/** 「生き物」ではなく固定の大型植物として解放されるもの(枝サンゴ・大きな海藻) */
export function buildFeaturePlants(unlockedIds: string[]): PlantSpec[] {
  const rand = createSeededRandom("study-ocean-feature-plants-v1");
  const positions = [18, 82, 32, 68];
  let i = 0;
  const plants: PlantSpec[] = [];
  for (const id of unlockedIds) {
    const kind = FEATURE_PLANT_KIND[id];
    if (!kind) continue;
    plants.push({
      id: `feature-${id}`,
      kind,
      x: positions[i % positions.length] + rangeFrom(rand, -2, 2),
      scale: kind === "kelp" ? 1.35 : 1.15,
      hueShift: 0,
      delay: rangeFrom(rand, 0, 2),
      wide: kind === "kelp",
    });
    i++;
  }
  return plants;
}

export function unlockedPlantIds(state: OceanState): string[] {
  return state.unlocked.filter((u) => ["coral-branch", "kelp-tall"].includes(u.id)).map((u) => u.id);
}

export function creatureVisibleAtHealth(kind: CreatureSpec["kind"], health: number): boolean {
  if (kind === "shell") return true; // 貝殻は枯れても消えない
  if (kind === "ray") return health >= 10;
  return health >= 6;
}

export function nextUnlockLabel(streakCurrent: number): { name: string; daysLeft: number } | null {
  const next = UNLOCKS.find((u) => u.streakDays > streakCurrent);
  if (!next) return null;
  return { name: next.name, daysLeft: next.streakDays - streakCurrent };
}
