"use client";

export function saveBlankWoPage(contractId: string, blankWoId: number) {
  const key = `blankWoPages_${contractId}`;
  const existing = getBlankWoPages(contractId);
  if (!existing.includes(blankWoId)) {
    existing.push(blankWoId);
    localStorage.setItem(key, JSON.stringify(existing));
  }
}

export function getBlankWoPages(contractId: string): number[] {
  const key = `blankWoPages_${contractId}`;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
}

export function clearBlankWoPages(contractId: string) {
  localStorage.removeItem(`blankWoPages_${contractId}`);
}
