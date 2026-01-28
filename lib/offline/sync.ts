import NetInfo from "@react-native-community/netinfo";
import { listPendingLocalScans } from "./db";

export async function isOnline(): Promise<boolean> {
  const state = await NetInfo.fetch();
  return Boolean(state.isConnected && (state.isInternetReachable ?? true));
}

export async function syncPendingScanHistory(_userId: number) {
  // No-op without a server; keep scans local
  if (!(await isOnline())) return { synced: 0 };
  const pending = await listPendingLocalScans(_userId);
  return { synced: 0, pending: pending.length } as any;
}
