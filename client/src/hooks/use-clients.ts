import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Client, InsertClient } from "@shared/schema";

export function useClients() {
  return useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });
}

export function useClient(id: string) {
  return useQuery<Client>({
    queryKey: ["/api/clients", id],
    enabled: !!id,
  });
}

export function useCreateClient() {
  return useMutation({
    mutationFn: async (data: InsertClient) => {
      const res = await apiRequest("POST", "/api/clients", data);
      return res.json() as Promise<Client>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
    },
  });
}

export function useUpdateClient() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertClient> }) => {
      const res = await apiRequest("PATCH", `/api/clients/${id}`, data);
      return res.json() as Promise<Client>;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      queryClient.invalidateQueries({ queryKey: ["/api/clients", variables.id] });
    },
  });
}
