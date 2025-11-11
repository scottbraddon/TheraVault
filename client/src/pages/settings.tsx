import { Shield, Database, Cpu, HardDrive, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export default function Settings() {
  //todo: remove mock functionality
  const systemStatus = {
    ollama: true,
    whisper: true,
    database: true,
    encryption: true,
  };

  return (
    <div className="p-8 space-y-8 max-w-4xl">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold" data-testid="text-page-title">Settings</h1>
        <p className="text-muted-foreground">Configure your local CRM environment</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            System Status
          </CardTitle>
          <CardDescription>Local services and dependencies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center gap-3">
                <Cpu className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Ollama (LLM)</div>
                  <div className="text-sm text-muted-foreground">
                    llama3.1:8b model
                  </div>
                </div>
              </div>
              {systemStatus.ollama ? (
                <Badge variant="default" data-testid="badge-ollama-status">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Running
                </Badge>
              ) : (
                <Badge variant="destructive" data-testid="badge-ollama-status">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Not Found
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center gap-3">
                <Cpu className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">faster-whisper</div>
                  <div className="text-sm text-muted-foreground">
                    Audio transcription
                  </div>
                </div>
              </div>
              {systemStatus.whisper ? (
                <Badge variant="default" data-testid="badge-whisper-status">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Installed
                </Badge>
              ) : (
                <Badge variant="destructive" data-testid="badge-whisper-status">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Not Found
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">SQLite Database</div>
                  <div className="text-sm text-muted-foreground">
                    With SQLCipher encryption
                  </div>
                </div>
              </div>
              {systemStatus.database ? (
                <Badge variant="default" data-testid="badge-database-status">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="destructive" data-testid="badge-database-status">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Error
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Storage & Encryption
          </CardTitle>
          <CardDescription>Manage your encrypted workspace</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Database Encryption</Label>
                <p className="text-sm text-muted-foreground">
                  All client data is encrypted at rest
                </p>
              </div>
              <Switch checked disabled data-testid="switch-encryption" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="workspace-path">Workspace Location</Label>
              <div className="flex gap-2">
                <Input
                  id="workspace-path"
                  value="~/.counselsync/workspace"
                  readOnly
                  className="font-mono text-sm"
                  data-testid="input-workspace-path"
                />
                <Button variant="outline" data-testid="button-change-path">
                  Change
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button variant="outline" className="w-full" data-testid="button-backup">
                Export Encrypted Backup
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Configuration</CardTitle>
          <CardDescription>Settings for note generation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="model">LLM Model</Label>
            <Input
              id="model"
              value="llama3.1:8b"
              readOnly
              className="font-mono"
              data-testid="input-model"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="temperature">Temperature</Label>
            <Input
              id="temperature"
              type="number"
              defaultValue="0.7"
              step="0.1"
              min="0"
              max="1"
              data-testid="input-temperature"
            />
            <p className="text-xs text-muted-foreground">
              Controls creativity in AI-generated notes (0 = focused, 1 = creative)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
