import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Framework, InsertFramework } from "@shared/schema";

export function useFrameworks() {
  return useQuery<Framework[]>({
    queryKey: ["/api/frameworks"],
  });
}

export function useCreateFramework() {
  return useMutation({
    mutationFn: async (data: InsertFramework) => {
      const res = await apiRequest("POST", "/api/frameworks", data);
      return res.json() as Promise<Framework>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/frameworks"] });
    },
  });
}
