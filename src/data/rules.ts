import type { ExtractedSave } from "../parser/extract";
import type { MapPinKind } from "./pins";
import {
  achievementById,
  checklistItems,
  itemsBySection,
  type ChecklistItem,
} from "./checklist";
import { replaceOnImport, type ChecklistSectionId } from "./sections";

function normalizeName(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

const SAVE_IDS: Readonly<Record<string, readonly string[]>> = {
  "weapon-the-iconoclast": ["HadernsSword"],
  "weapon-axe-and-dagger": ["AxeDagger"],
  "weapon-black-needle": ["BlackNeedle"],
  "weapon-clockwork-scythe": ["ClockworkScythe"],
  "weapon-axatana": ["Axatana"],
  "weapon-great-martyr-s-blade": ["MartyrsBlade"],
  "weapon-veteran-s-battle-axe": ["BattleAxe"],
  "weapon-obsidian-hammer": ["HeavyHammer"],
  "sidearm-naylshotte": ["NailShotgun"],
  "sidearm-forgotten-crossbow": ["Crossbow"],
  "sidearm-troubadour-s-lute": ["Lute_Simple", "Lute"],
  "sidearm-cursed-child": ["CursedChild"],
  "sidearm-caged-hystrix": ["ParasiteGun"],
  "sidearm-triarch-repeater": ["MachineGun"],
  "sidearm-salvaged-trebuchaxe": ["Trebuchaxe"],
  "sidearm-ballistazooka": ["Ballistazooka"],
  "shell-tiel-the-acolyte": ["Tiel"],
  "shell-gragu-the-insatiable": ["Gragu"],
  "shell-eredrim-the-venerable": ["Eredrim"],
  "shell-genessa-the-wayward": ["Genessa"],
  "shell-smert-the-apostate": ["Smert"],
  "boss-magdalena-the-lady-of-the-woods": ["LadyOfTheWoods"],
  "boss-the-lost-child": ["LostChild"],
  "boss-the-nameless-captive": ["Swordman"],
  "boss-sir-isaac-the-scholar-prince": ["SirIsaac"],
  "boss-droeg-the-conquerer": ["Droeg"],
  "boss-hexapod": ["Hexapod"],
  "boss-orrem-the-reclaimed": ["Orrem"],
  "boss-the-monolith": ["Monolith"],
  "boss-zmey-the-unbidden": ["Zmey"],
  ...Object.fromEntries([1, 2, 3, 4, 5].map((n) => [`fragment-map-of-fainweald-${n}`, [`MapItem_Forest_${n}`]])),
  ...Object.fromEntries([1, 2, 3, 4, 5, 6].map((n) => [`fragment-map-of-mammon-${n}`, [`MapItem_City_${n}`]])),
  "tarstone-accursed-stone": ["Sidearm_InflictCurse"],
  "tarstone-acolyte-s-stone": ["Melee_LightHoldAttack"],
  "tarstone-arbiter-s-prize": ["Melee_InflictBleed"],
  "tarstone-auspicious-stone": ["Melee_Generic_CritChance"],
  "tarstone-berserker-s-stone": ["Melee_Generic_Crazed"],
  "tarstone-barrage-stone": ["Sidearm_ClusterBomb"],
  "tarstone-blackblood-stone": ["Sidearm_Boombastic"],
  "tarstone-bulwark-stone": ["Support_OnKill_DamageReduction"],
  "tarstone-captive-s-scabstone": ["Melee_WeaponAbility_SpiralSurge"],
  "tarstone-charged-stone": ["Sidearm_Quickcharge"],
  "tarstone-clerik-s-stone": ["Melee_HeavyAttackFinisher_Critical"],
  "tarstone-clockwork-shardstone": ["Melee_ClockworkGrinder"],
  "tarstone-colossus-stone": ["Melee_WeaponAbility_HeavyStomps"],
  "tarstone-confessor-s-keepsake": ["Sidearm_Deadshot"],
  "tarstone-conqueror-s-reward": ["Melee_WeaponAbility_StormStrike"],
  "tarstone-corroded-stone": ["Sidearm_Corrosion"],
  "tarstone-curseblood-stone": ["Melee_InflictCurse"],
  "tarstone-deadeye-stone": ["Sidearm_Generic_CriticalHitDamage"],
  "tarstone-devout-stone": ["Melee_Generic_ResolveGain"],
  "tarstone-duality-stone": ["Melee_DualWieldProficiency"],
  "tarstone-egon-s-stone": ["Support_DungeonRespawn"],
  "tarstone-emberseed-stone": ["Sidearm_InflictBurn"],
  "tarstone-enfeebling-stone": ["Sidearm_InflictFragile"],
  "tarstone-frostshard-stone": ["Sidearm_InflictFrost"],
  "tarstone-fulminant-stone": ["Sidearm_Bombardment"],
  "tarstone-fusillade-stone": ["Sidearm_QuickShooting"],
  "tarstone-glimpse-stone": ["Support_Glimpse"],
  "tarstone-gloombound-stone": ["Support_GloomBoost"],
  "tarstone-grudge-stone": ["Melee_CriticalFlow"],
  "tarstone-hag-stone": ["Sidearm_InflictPoison"],
  "tarstone-hand-of-rock": ["Sidearm_LuteRiff"],
  "tarstone-headman-s-stone": ["Melee_Generic_CritBonus"],
  "tarstone-hexapod-core": ["Melee_WeaponAbility_Katanas"],
  "tarstone-infested-stone": ["Sidearm_StickyBomb"],
  "tarstone-inflamed-clawstone": ["Melee_InflictBurn"],
  "tarstone-infused-stone": ["Melee_WeaponAbility_HomingThrow"],
  "tarstone-ironpiercer-s-stone": ["Sidearm_PiercingShot"],
  "tarstone-justiciar-s-stone": ["Support_GoldBoost"],
  "tarstone-lost-clotstone": ["Melee_WeaponAbility_WeaponThrow"],
  "tarstone-magdalena-s-memento": ["Melee_WeaponAbility_DeadlyFlurry"],
  "tarstone-marksman-s-stone": ["Sidearm_Generic_CriticalHitChance"],
  "tarstone-monarch-s-vestige": ["Sidearm_InflictPhantom"],
  "tarstone-myriad-stone": ["Sidearm_Scattershot"],
  "tarstone-nightgrasp-stone": ["Melee_InflictPhantom"],
  "tarstone-parasitic-stone": ["Melee_GrantLeechOnKill"],
  "tarstone-pulse-stone": ["Sidearm_AttractionShot"],
  "tarstone-retribution-stone": ["Support_RiposteDamage"],
  "tarstone-rupturing-stone": ["Sidearm_InflictBreakOnCriticalHit"],
  "tarstone-scholar-s-wormstone": ["Melee_WeaponAbility_ClockworkChainsaw"],
  "tarstone-serpent-stone": ["Melee_InflictPoison"],
  "tarstone-shattering-stone": ["Melee_Generic_PoiseBonus"],
  "tarstone-shrike-stone": ["Melee_WeaponAbility_PlummetStrike"],
  "tarstone-shuddering-stone": ["Sidearm_RepulsiveShot"],
  "tarstone-siegebreaker-s-stone": ["Sidearm_Generic_PoiseDamage"],
  "tarstone-solnir-shard": ["Sidearm_Slingshot"],
  "tarstone-spite-stone": ["Sidearm_Generic_Crazed"],
  "tarstone-splitting-stone": ["Sidearm_ConcurrentCrossfire"],
  "tarstone-squall-stone": ["Sidearm_Spiraling"],
  "tarstone-stillblade-s-stone": ["Melee_LightAttackFinisher_Break"],
  "tarstone-strange-remnant": ["Sidearm_ThreadweaverShot"],
  "tarstone-summoning-stone": ["Sidearm_AllySummon"],
  "tarstone-tarred-fragment": ["Sidearm_Tiltshot"],
  "tarstone-thief-s-stone": ["Melee_GrantWarpOnHit"],
  "tarstone-torpor-stone": ["Melee_InflictStasis"],
  "tarstone-tyrant-s-stone": ["Melee_HeavyAttackFinisher_Weak"],
  "tarstone-unstable-stone": ["Sidearm_Chainburst"],
  "tarstone-unwieldly-stone": ["Melee_HeavyHoldAttack"],
  "tarstone-unyielding-stone": ["Melee_Unyielding"],
  "tarstone-viletongue-hedron": ["Sidearm_InflictBleed"],
  "tarstone-volatile-fragment": ["Sidearm_ExplosiveReaction"],
  "tarstone-voltaic-amber": ["Sidearm_InflictLightning"],
  "tarstone-voltaic-crown": ["Melee_InflictLightning"],
  "tarstone-warden-s-stone": ["Melee_InflictFrost"],
  "tarstone-weeping-stone": ["Sidearm_InflictTrauma"],
  "tarstone-wounding-stone": ["Melee_InflictPerforation"],
  "tarstone-wretchcaller-s-stone": ["Melee_InflictTrauma"],
  "tarstone-zealot-s-stone": ["Melee_LightAttackFinisher_Resolve"],
};

const SAVE_VALUES: Readonly<Record<MapPinKind, (save: ExtractedSave) => readonly string[]>> = {
  boss: (save) => save.bosses,
  shell: (save) => save.shells,
  weapon: (save) => save.weapons,
  sidearm: (save) => save.sidearms,
  tarstone: (save) => save.tarstones,
  fragment: (save) => [
    ...save.mapItems,
    ...save.mapPieceReveals.map((value) => value.replace(/^MapPieceReveal_/, "")),
  ],
  beacon: () => [],
};

type DerivedRule =
  | Readonly<{ type: "fromLinkedItems"; skip: readonly string[] }>
  | Readonly<{ type: "sectionComplete"; section: MapPinKind; achievementId: string; fillSection?: boolean }>
  | Readonly<{ type: "anyInSections"; sections: readonly MapPinKind[]; achievementId: string }>
  | Readonly<{ type: "allAchievements"; except: readonly string[]; achievementId: string }>;

const STARTER = "001";
const PLATINUM = "053";

const derivedRules: readonly DerivedRule[] = [
  { type: "fromLinkedItems", skip: [STARTER, PLATINUM] },
  { type: "sectionComplete", section: "beacon", achievementId: "043", fillSection: false },
  { type: "sectionComplete", section: "tarstone", achievementId: "039", fillSection: false },
  { type: "sectionComplete", section: "fragment", achievementId: "045" },
  { type: "sectionComplete", section: "shell", achievementId: "047" },
  { type: "sectionComplete", section: "sidearm", achievementId: "048" },
  { type: "sectionComplete", section: "weapon", achievementId: "049" },
  { type: "anyInSections", sections: ["shell", "weapon", "sidearm"], achievementId: STARTER },
  { type: "allAchievements", except: [PLATINUM], achievementId: PLATINUM },
];

function achievementItemId(id: string): string {
  return `ach-${id}`;
}

function applyDerivedRule(
  rule: DerivedRule,
  checked: Record<string, boolean>,
  ids: Set<string>,
): void {
  const earned = (id: string) => Boolean(checked[id] || ids.has(id));
  if (rule.type === "fromLinkedItems") {
    const skip = new Set(rule.skip);
    for (const item of checklistItems) {
      if (item.kind === "achievement" || !checked[item.id] || !item.achievementId || skip.has(item.achievementId)) {
        continue;
      }
      ids.add(achievementItemId(item.achievementId));
    }
    return;
  }
  if (rule.type === "sectionComplete") {
    const items = itemsBySection[rule.section];
    if (items.length > 0 && items.every((item) => checked[item.id])) {
      ids.add(achievementItemId(rule.achievementId));
    }
    return;
  }
  if (rule.type === "anyInSections") {
    if (rule.sections.every((section) => itemsBySection[section].some((item) => checked[item.id]))) {
      ids.add(achievementItemId(rule.achievementId));
    }
    return;
  }
  const others = itemsBySection.achievements.filter((item) => !rule.except.includes(item.achievementId ?? ""));
  if (others.length > 0 && others.every((item) => earned(item.id))) {
    ids.add(achievementItemId(rule.achievementId));
  }
}

export function derivedAchievementIds(checked: Record<string, boolean>): string[] {
  const ids = new Set<string>();
  for (const rule of derivedRules) {
    applyDerivedRule(rule, checked, ids);
  }
  return [...ids];
}

export function withDerivedChecks(checked: Record<string, boolean>): {
  checked: Record<string, boolean>;
  unlocked: string[];
} {
  const unlocked: string[] = [];
  let next = checked;
  for (const id of derivedAchievementIds(checked)) {
    if (next[id]) {
      continue;
    }
    if (next === checked) {
      next = { ...checked };
    }
    next[id] = true;
    unlocked.push(id);
  }
  return { checked: next, unlocked };
}

export function idsFromSave(save: ExtractedSave): string[] {
  const earned = new Set(save.earnedAchievementIds);
  const buckets = Object.fromEntries(
    (Object.keys(SAVE_VALUES) as MapPinKind[]).map((kind) => [
      kind,
      new Set(SAVE_VALUES[kind](save).map(normalizeName)),
    ]),
  ) as Record<MapPinKind, Set<string>>;

  return checklistItems.filter((item) => itemMatchesSave(item, earned, buckets)).map((item) => item.id);
}

function itemMatchesSave(
  item: ChecklistItem,
  earned: Set<string>,
  buckets: Record<MapPinKind, Set<string>>,
): boolean {
  if (item.kind === "achievement") {
    return item.achievementId !== undefined && earned.has(item.achievementId);
  }
  const kind = item.kind as MapPinKind;
  const fromSave = [item.name, ...(item.aliases ?? []), ...(SAVE_IDS[item.id] ?? [])].some((id) =>
    buckets[kind].has(normalizeName(id)),
  );
  if (fromSave || (item.achievementId !== undefined && earned.has(item.achievementId))) {
    return true;
  }
  return derivedRules.some(
    (rule) =>
      rule.type === "sectionComplete" &&
      rule.section === kind &&
      rule.fillSection !== false &&
      earned.has(rule.achievementId),
  );
}

export function mergeSaveChecks(
  current: Record<string, boolean>,
  found: readonly string[],
): Record<string, boolean> {
  const foundSet = new Set(found);
  const next = { ...current };
  for (const item of checklistItems) {
    if (replaceOnImport(item.section as ChecklistSectionId)) {
      next[item.id] = foundSet.has(item.id);
    } else if (foundSet.has(item.id)) {
      next[item.id] = true;
    }
  }
  return withDerivedChecks(next).checked;
}

export function toastIdsForToggle(id: string, derived: readonly string[]): string[] {
  if (achievementById.has(id) && !derived.includes(id)) {
    return [id, ...derived];
  }
  return [...derived];
}
