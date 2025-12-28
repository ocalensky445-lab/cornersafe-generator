// stockage simple en mémoire (MVP)
let dailySlips = null;
let lastGenerated = null;

export function getDailySlips() {
  return dailySlips;
}

export function setDailySlips(slips) {
  dailySlips = slips;
  lastGenerated = new Date().toISOString();
}

export function getLastGenerated() {
  return lastGenerated;
}
