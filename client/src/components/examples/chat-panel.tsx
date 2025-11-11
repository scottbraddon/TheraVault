import { ChatPanel } from "../chat-panel";

export default function ChatPanelExample() {
  const mockMessages = [
    {
      id: "1",
      role: "user" as const,
      content: "What therapeutic approach would work best for anxiety?",
      timestamp: new Date(),
    },
    {
      id: "2",
      role: "assistant" as const,
      content: "Based on evidence-based practices, I recommend Cognitive Behavioral Therapy (CBT) for anxiety. CBT helps identify and reframe anxious thoughts while building coping strategies.",
      timestamp: new Date(),
    },
  ];

  return (
    <div className="h-[600px] max-w-2xl border rounded-lg">
      <ChatPanel 
        title="AI Clinical Assistant"
        initialMessages={mockMessages}
        contextType="global"
      />
    </div>
  );
}
