import { ByteReader, collectAsciiOccurrences, findAscii, hasAscii, readU32LE, startsWithAscii, toLatin1, toUtf8 } from "./bytes";

const SAVE_CLASS = "/Script/Sparta.SpartaSaveGame";

export type ExtractedSave = Readonly<{
  saveClass: string | null;
  buildHint: string | null;
  earnedAchievementIds: string[];
  bosses: string[];
  prologueComplete: boolean;
  flowerCrown: boolean;
  shells: string[];
  weapons: string[];
  sidearms: string[];
  tarstones: string[];
  slayerSealPresent: boolean;
  mapItems: string[];
  mapPieceReveals: string[];
  landingAreas: string[];
  unlockedLandingAreas: string[];
  cleansedLandingAreas: string[];
  currentSpawnLocation: string | null;
  ngPlusHint: boolean;
}>;

function extractBuildHint(data: Uint8Array): string | null {
  const idx = findAscii(data, "++Sparta");
  if (idx < 0) {
    return null;
  }
  let end = idx;
  while (end < data.length && data[end] !== 0) {
    end += 1;
  }
  return toUtf8(data.subarray(idx, end));
}

function tryReadAchievementMap(data: Uint8Array, start: number, count: number): string[] | null {
  const reader = new ByteReader(data);
  reader.seek(start);
  const ids: string[] = [];
  try {
    for (let i = 0; i < count; i += 1) {
      const key = reader.readFString();
      const value = reader.readBytes(1)[0];
      if (value !== 0 && value !== 1) {
        return null;
      }
      if (!/^\d{3}$/.test(key)) {
        return null;
      }
      if (value === 1) {
        ids.push(key);
      }
    }
  } catch {
    return null;
  }
  return [...new Set(ids)].sort();
}

function extractEarnedAchievements(data: Uint8Array): string[] {
  const nameIdx = findAscii(data, "EarnedAchievements");
  if (nameIdx < 0) {
    return [];
  }
  const window = data.subarray(nameIdx, Math.min(data.length, nameIdx + 512));
  for (let offset = 0; offset + 8 < window.length; offset += 1) {
    const count = readU32LE(window, offset);
    if (count < 1 || count > 64) {
      continue;
    }
    const ids = tryReadAchievementMap(data, nameIdx + offset + 4, count);
    if (ids && ids.length > 0) {
      return ids;
    }
  }
  return [];
}

function extractCurrentSpawn(data: Uint8Array): string | null {
  const idx = findAscii(data, "CurrentSpawnLocation");
  if (idx < 0) {
    return null;
  }
  const tableIdx = findAscii(data, "ST_Core_LandingAreaNames", idx);
  if (tableIdx < 0 || tableIdx - idx > 400) {
    return null;
  }
  let end = tableIdx;
  while (end < data.length && data[end] !== 0) {
    end += 1;
  }
  const reader = new ByteReader(data);
  reader.seek(end + 1);
  try {
    return reader.readFString() || null;
  } catch {
    return null;
  }
}

function namesFromPaths(paths: string[], token: string): string[] {
  const names = new Set<string>();
  for (const path of paths) {
    const match = path.match(new RegExp(`${token}_([A-Za-z0-9]+)`));
    if (match) {
      names.add(match[1]);
    }
  }
  return [...names].sort();
}

function collectLandingAreas(data: Uint8Array): string[] {
  return collectAsciiOccurrences(data, "LandingArea_").filter(
    (name) => !name.includes("/") && !name.includes("BPSO_") && !name.endsWith("_C"),
  );
}

function collectLandingAreasNear(data: Uint8Array, property: string): string[] {
  const index = findAscii(data, property);
  if (index < 0) {
    return [];
  }
  const boundaries = [
    "UnlockedLandingAreas",
    "CleansedLandingAreas",
    "CurrentSpawnLocation",
    "EarnedAchievements",
    "ActiveDarkFormMask",
    "EquipmentUnlockState",
  ]
    .filter((candidate) => candidate !== property)
    .map((candidate) => findAscii(data, candidate, index + property.length))
    .filter((candidate) => candidate > index);
  const end = Math.min(data.length, index + 24_000, ...boundaries);
  return collectLandingAreas(data.subarray(index, end));
}

function collectTarstoneIds(data: Uint8Array): string[] {
  const start = findAscii(data, "TarstoneSaveData");
  if (start < 0) {
    return [];
  }
  const builds = findAscii(data, "TarstoneBuilds", start);
  const slice = data.subarray(start, builds > start ? builds : Math.min(data.length, start + 24_000));
  const ids = new Set<string>();
  for (const path of [
    ...collectAsciiOccurrences(slice, "/Game/Sparta/Core/Tarstones/"),
    ...collectAsciiOccurrences(slice, "/Game/Sparta/Core/Player/Upgrades/"),
  ]) {
    const item = /ID_((?:Melee|Sidearm|Support)_[A-Za-z0-9_]+?)(?:_C)?(?:\.|$)/.exec(path);
    if (item) {
      ids.add(item[1]);
    }
  }
  return [...ids].sort();
}

export function extractSave(data: Uint8Array): ExtractedSave {
  const weaponPaths = collectAsciiOccurrences(data, "/Game/Sparta/Items/Weapons/ID_");
  // CharacterId.Player.Shell.* tags exist for shells the player does not own, so only inventory items count.
  const shellPaths = [
    ...collectAsciiOccurrences(data, "/Game/Sparta/Items/Shells/ID_Shell_"),
    ...collectAsciiOccurrences(data, "InventoryItem_ID_Shell_"),
  ];
  const shellNames = new Set<string>();
  for (const path of shellPaths) {
    const item = /ID_Shell_([A-Za-z0-9]+)/.exec(path);
    if (item) {
      shellNames.add(item[1]);
    }
  }
  const bosses = new Set<string>();
  const assistIdx = findAscii(data, "Sparta_BossAssist");
  if (assistIdx >= 0) {
    const slice = toLatin1(data.subarray(assistIdx, assistIdx + 400));
    for (const key of ["LadyOfTheWoods", "Swordman", "LostChild", "Hexapod", "Droeg", "SirIsaac", "Monolith", "Orrem", "Zmey"]) {
      if (slice.includes(key)) {
        bosses.add(key);
      }
    }
  }
  if (hasAscii(data, "HutchbackDefeated")) {
    bosses.add("Hutchback");
  }
  if (hasAscii(data, "Game.State.BossesDefeated")) {
    for (const key of ["LadyOfTheWoods", "Swordman"]) {
      if (hasAscii(data, key)) {
        bosses.add(key);
      }
    }
  }

  // "ID_Sidearm_*" also matches sidearm tarstones, so only item paths and inventory entries are used.
  const sidearmIds = [
    ...collectAsciiOccurrences(data, "/Game/Sparta/Items/Sidearms/ID_Sidearm_"),
    ...collectAsciiOccurrences(data, "InventoryItem_ID_Sidearm_"),
  ]
    .map((value) => /ID_Sidearm_([A-Za-z0-9_]+?)(?:_C)?(?:\.|$)/.exec(value)?.[1])
    .filter((value): value is string => Boolean(value));

  // Owned stones live in TarstoneLevels. Bare ID_Tarstone_* / item-folder scans hit catalogs or nothing.
  const tarstoneIds = collectTarstoneIds(data);

  return {
    saveClass: hasAscii(data, SAVE_CLASS) ? SAVE_CLASS : null,
    buildHint: extractBuildHint(data),
    earnedAchievementIds: extractEarnedAchievements(data),
    bosses: [...bosses].sort(),
    prologueComplete: hasAscii(data, "CompletedPrologue"),
    flowerCrown: hasAscii(data, "FlowerCrown") || hasAscii(data, "Sparta.Item.Mask.FlowerCrown"),
    shells: [...shellNames].sort(),
    weapons: namesFromPaths(weaponPaths, "ID"),
    sidearms: [...new Set(sidearmIds)].sort(),
    tarstones: [...new Set(tarstoneIds)].sort(),
    slayerSealPresent: hasAscii(data, "ID_Seal_Slayer"),
    mapItems: collectAsciiOccurrences(data, "MapItem_").filter((value) => !value.startsWith("MapPieceReveal")),
    mapPieceReveals: collectAsciiOccurrences(data, "MapPieceReveal_"),
    landingAreas: collectLandingAreas(data),
    unlockedLandingAreas: collectLandingAreasNear(data, "UnlockedLandingAreas"),
    cleansedLandingAreas: collectLandingAreasNear(data, "CleansedLandingAreas"),
    currentSpawnLocation: extractCurrentSpawn(data),
    ngPlusHint: hasAscii(data, "NGPlus") || hasAscii(data, "NewGamePlus"),
  };
}

export function isGvas(data: Uint8Array): boolean {
  return data.length >= 4 && startsWithAscii(data, "GVAS");
}
