import { useState } from "react";
import { ArrowLeft, User, Calendar, FileText, MessageSquare } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChatPanel } from "@/components/chat-panel";

//todo: remove mock functionality
const mockClient = {
  id: "1",
  name: "Sarah Johnson",
  email: "sarah.j@example.com",
  phone: "(555) 123-4567",
  status: "active",
  firstSession: "2024-03-15",
  totalSessions: 8,
  lastSession: "2024-11-10",
};

const mockSessions = [
  {
    id: "1",
    date: "2024-11-10",
    duration: 50,
    type: "Individual Therapy",
    status: "completed",
  },
  {
    id: "2",
    date: "2024-11-03",
    duration: 50,
    type: "Individual Therapy",
    status: "completed",
  },
];

const mockNotes = [
  {
    id: "1",
    sessionDate: "2024-11-10",
    content: "Client showed significant progress in managing anxiety symptoms. Continued work on cognitive restructuring techniques. Homework: practice thought records daily.",
    createdBy: "AI-Generated",
  },
];

export default function ClientDetail() {
  const [activeTab, setActiveTab] = useState("sessions");

  return (
    <div className="p-8 space-y-8 max-w-7xl">
      <div className="flex items-center gap-4">
        <Link href="/clients">
          <Button variant="ghost" size="icon" data-testid="button-back">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex items-center gap-4 flex-1">
          <Avatar className="h-16 w-16">
            <AvatarFallback>
              <User className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold" data-testid="text-client-name">{mockClient.name}</h1>
            <div className="flex items-center gap-2">
              <Badge variant={mockClient.status === "active" ? "default" : "secondary"}>
                {mockClient.status}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {mockClient.totalSessions} sessions
              </span>
            </div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList data-testid="tabs-client-detail">
          <TabsTrigger value="sessions" data-testid="tab-sessions">
            <Calendar className="h-4 w-4 mr-2" />
            Sessions
          </TabsTrigger>
          <TabsTrigger value="notes" data-testid="tab-notes">
            <FileText className="h-4 w-4 mr-2" />
            Notes
          </TabsTrigger>
          <TabsTrigger value="profile" data-testid="tab-profile">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="chat" data-testid="tab-chat">
            <MessageSquare className="h-4 w-4 mr-2" />
            AI Chat
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-4 mt-6">
          {mockSessions.map((session) => (
            <Card key={session.id} data-testid={`card-session-${session.id}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-medium">{session.type}</div>
                    <div className="text-sm text-muted-foreground">
                      <span className="font-mono">{session.date}</span>
                      <span className="mx-2">•</span>
                      <span>{session.duration} minutes</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="notes" className="space-y-4 mt-6">
          {mockNotes.map((note) => (
            <Card key={note.id} data-testid={`card-note-${note.id}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Session: {note.sessionDate}</CardTitle>
                  <Badge variant="secondary">{note.createdBy}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{note.content}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{mockClient.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{mockClient.phone}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">First Session</p>
                  <p className="font-medium font-mono">{mockClient.firstSession}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Last Session</p>
                  <p className="font-medium font-mono">{mockClient.lastSession}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="mt-6">
          <Card className="h-[600px]">
            <ChatPanel
              title="AI Clinical Assistant"
              placeholder="Ask about this client's treatment..."
              clientId={mockClient.id}
              contextType="client"
            />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
