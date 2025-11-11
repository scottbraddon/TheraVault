import { useState } from "react";
import { Plus, Search, User } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useClients } from "@/hooks/use-clients";

export default function Clients() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: clients, isLoading } = useClients();

  const filteredClients = (clients || []).filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold" data-testid="text-page-title">Clients</h1>
          <p className="text-muted-foreground">Manage your client records</p>
        </div>
        <Button data-testid="button-new-client" onClick={() => console.log('Create new client')}>
          <Plus className="h-4 w-4 mr-2" />
          New Client
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search clients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          data-testid="input-search"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No clients found. Create your first client to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <Link key={client.id} href={`/clients/${client.id}`}>
              <Card
                className="hover-elevate active-elevate-2 cursor-pointer"
                data-testid={`card-client-${client.id}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>
                        <User className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-medium" data-testid={`text-client-name-${client.id}`}>{client.name}</h3>
                        <Badge
                          variant={client.status === "active" ? "default" : "secondary"}
                          data-testid={`badge-status-${client.id}`}
                        >
                          {client.status}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        {client.firstSession && (
                          <div>First session: <span className="font-mono">{new Date(client.firstSession).toLocaleDateString()}</span></div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
