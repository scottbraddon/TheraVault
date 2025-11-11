import { ChatPanel } from "../chat-panel";

export default function ChatPanelExample() {
  return (
    <div className="h-[600px] max-w-2xl border rounded-lg">
      <ChatPanel 
        title="AI Clinical Assistant"
        contextType="global"
      />
    </div>
  );
}
