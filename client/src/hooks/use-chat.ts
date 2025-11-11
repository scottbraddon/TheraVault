import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { ChatMessage } from "@shared/schema";

export function useChatMessages(clientId?: string) {
  return useQuery<ChatMessage[]>({
    queryKey: clientId ? ["/api/chat/messages", clientId] : ["/api/chat/messages"],
    queryFn: async () => {
      const url = clientId ? `/api/chat/messages?clientId=${clientId}` : "/api/chat/messages";
      const res = await fetch(url, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch messages");
      return res.json();
    },
  });
}

export function useSendMessage() {
  return useMutation({
    mutationFn: async ({ message, clientId }: { message: string; clientId?: string }) => {
      const res = await apiRequest("POST", "/api/chat/generate", { message, clientId });
      return res.json() as Promise<ChatMessage>;
    },
    onSuccess: (_data, variables) => {
      const queryKey = variables.clientId
        ? ["/api/chat/messages", variables.clientId]
        : ["/api/chat/messages"];
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
