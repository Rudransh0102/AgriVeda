import React, { ReactNode, useEffect } from "react";
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";
import { claimAnonymousLocalScans, initOfflineDb } from "@/lib/offline/db";
import { syncPendingScanHistory } from "@/lib/offline/sync";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

export function OfflineProvider({ children }: { children: ReactNode }) {
  const net = useNetInfo();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    initOfflineDb().catch(() => {
      // best-effort
    });
  }, []);

  useEffect(() => {
    const online = Boolean(net.isConnected && (net.isInternetReachable ?? true));
    if (!online) return;

    if (user?.id) {
      claimAnonymousLocalScans(user.id)
        .then(() => syncPendingScanHistory(user.id))
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ["diseaseHistory"] });
        })
        .catch(() => {
          // best-effort
        });
    }

    // When we come back online, refetch cached queries so SQLite cache refreshes.
    queryClient.invalidateQueries();
  }, [net.isConnected, net.isInternetReachable, user?.id]);

  // Keep NetInfo subscription alive (some Android devices benefit from it)
  useEffect(() => {
    const unsub = NetInfo.addEventListener(() => {});
    return () => unsub();
  }, []);

  return <>{children}</>;
}
