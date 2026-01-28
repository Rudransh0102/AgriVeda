export async function isOnline(): Promise<boolean> {
  return typeof navigator !== "undefined" ? navigator.onLine : true;
}

export async function syncPendingScanHistory(_userId: number) {
  return { synced: 0 };
}
