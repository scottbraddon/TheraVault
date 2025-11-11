import { Users, Calendar, FileText, Clock } from "lucide-react";
import { StatsCard } from "@/components/stats-card";
import { OfflineIndicator } from "@/components/offline-indicator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

//todo: remove mock functionality
const recentSessions = [
  {
    id: "1",
    clientName: "Sarah Johnson",
    date: "2024-11-10",
    duration: "50 min",
    status: "completed",
    hasNotes: true,
  },
  {
    id: "2",
    clientName: "Michael Chen",
    date: "2024-11-09",
    duration: "45 min",
    status: "pending-transcription",
    hasNotes: false,
  },
  {
    id: "3",
    clientName: "Emma Williams",
    date: "2024-11-08",
    duration: "60 min",
    status: "completed",
    hasNotes: true,
  },
];

export default function Dashboard() {
  return (
    <div className="p-8 space-y-8 max-w-7xl">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold" data-testid="text-page-title">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your counselling practice</p>
      </div>

      <OfflineIndicator />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Active Clients"
          value={24}
          icon={Users}
          description="+3 this month"
        />
        <StatsCard
          title="Sessions This Week"
          value={12}
          icon={Calendar}
          description="2 scheduled today"
        />
        <StatsCard
          title="Pending Transcriptions"
          value={3}
          icon={FileText}
          description="Ready to process"
        />
        <StatsCard
          title="Total Hours"
          value="127.5"
          icon={Clock}
          description="This month"
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
          <CardTitle>Recent Sessions</CardTitle>
          <Link href="/sessions">
            <Button variant="outline" size="sm" data-testid="button-view-all">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 rounded-lg border hover-elevate active-elevate-2 cursor-pointer"
                data-testid={`card-session-${session.id}`}
                onClick={() => console.log('Navigate to session:', session.id)}
              >
                <div className="space-y-1">
                  <div className="font-medium" data-testid={`text-client-name-${session.id}`}>{session.clientName}</div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="font-mono">{session.date}</span>
                    <span>{session.duration}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {session.status === "completed" ? (
                    <Badge variant="secondary" data-testid={`badge-status-${session.id}`}>
                      <FileText className="h-3 w-3 mr-1" />
                      Notes Complete
                    </Badge>
                  ) : (
                    <Badge variant="outline" data-testid={`badge-status-${session.id}`}>
                      Pending
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
