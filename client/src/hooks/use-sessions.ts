import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Session, InsertSession } from "@shared/schema";

export function useSessions() {
  return useQuery<Session[]>({
    queryKey: ["/api/sessions"],
  });
}

export function useClientSessions(clientId: string) {
  return useQuery<Session[]>({
    queryKey: ["/api/clients", clientId, "sessions"],
    enabled: !!clientId,
  });
}

export function useCreateSession() {
  return useMutation({
    mutationFn: async (data: InsertSession) => {
      const res = await apiRequest("POST", "/api/sessions", data);
      return res.json() as Promise<Session>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
    },
  });
}
