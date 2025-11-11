import { useState } from "react";
import { ArrowLeft, User, Calendar, FileText, MessageSquare } from "lucide-react";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatPanel } from "@/components/chat-panel";
import { useClient } from "@/hooks/use-clients";
import { useSessions } from "@/hooks/use-sessions";

export default function ClientDetail() {
  const params = useParams();
  const clientId = params.id as string;
  const [activeTab, setActiveTab] = useState("sessions");
  
  const { data: client, isLoading: isLoadingClient } = useClient(clientId);
  const { data: sessions = [], isLoading: isLoadingSessions } = useSessions(clientId);
  
  if (isLoadingClient) {
    return (
      <div className="p-8 space-y-8 max-w-7xl">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded" />
          <div className="flex items-center gap-4 flex-1">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-6 w-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!client) {
    return (
      <div className="p-8 space-y-8 max-w-7xl">
        <div className="text-center">
          <p className="text-muted-foreground">Client not found</p>
          <Link href="/clients">
            <Button className="mt-4">Back to Clients</Button>
          </Link>
        </div>
      </div>
    );
  }

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
            <h1 className="text-2xl font-semibold" data-testid="text-client-name">{client.name}</h1>
            <div className="flex items-center gap-2">
              <Badge variant={client.status === "active" ? "default" : "secondary"}>
                {client.status}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {sessions.length} sessions
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
          {isLoadingSessions ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No sessions recorded yet</p>
            </div>
          ) : (
            sessions.map((session) => (
              <Card key={session.id} data-testid={`card-session-${session.id}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="font-medium">{session.sessionType}</div>
                      <div className="text-sm text-muted-foreground">
                        <span className="font-mono">{new Date(session.date).toLocaleDateString()}</span>
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
            ))
          )}
        </TabsContent>

        <TabsContent value="notes" className="space-y-4 mt-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Notes feature coming soon</p>
          </div>
        </TabsContent>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {client.email && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{client.email}</p>
                  </div>
                )}
                {client.phone && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{client.phone}</p>
                  </div>
                )}
                {client.firstSession && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">First Session</p>
                    <p className="font-medium font-mono">{new Date(client.firstSession).toLocaleDateString()}</p>
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium capitalize">{client.status}</p>
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
              clientId={clientId}
              contextType="client"
            />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
