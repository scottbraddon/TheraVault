import { useState } from "react";
import { Plus, Upload, FileText, Clock, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

//todo: remove mock functionality
const mockSessions = [
  {
    id: "1",
    clientName: "Sarah Johnson",
    date: "2024-11-10",
    duration: 50,
    type: "Individual Therapy",
    status: "completed",
    hasTranscription: true,
    hasNotes: true,
  },
  {
    id: "2",
    clientName: "Michael Chen",
    date: "2024-11-09",
    duration: 45,
    type: "Initial Consultation",
    status: "pending",
    hasTranscription: false,
    hasNotes: false,
  },
];

export default function Sessions() {
  const [activeTab, setActiveTab] = useState("list");
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0]);
      console.log('Audio file selected:', e.target.files[0].name);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold" data-testid="text-page-title">Sessions</h1>
          <p className="text-muted-foreground">Manage session recordings and notes</p>
        </div>
        <Button data-testid="button-new-session" onClick={() => setActiveTab("new")}>
          <Plus className="h-4 w-4 mr-2" />
          New Session
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList data-testid="tabs-sessions">
          <TabsTrigger value="list" data-testid="tab-list">All Sessions</TabsTrigger>
          <TabsTrigger value="new" data-testid="tab-new">New Session</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-6 mt-6">
          {mockSessions.map((session) => (
            <Card key={session.id} data-testid={`card-session-${session.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <CardTitle className="text-lg" data-testid={`text-client-${session.id}`}>
                      {session.clientName}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="font-mono">{session.date}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {session.duration} min
                      </span>
                      <span>{session.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {session.hasTranscription && (
                      <Badge variant="secondary" data-testid={`badge-transcription-${session.id}`}>
                        <Mic className="h-3 w-3 mr-1" />
                        Transcribed
                      </Badge>
                    )}
                    {session.hasNotes && (
                      <Badge variant="default" data-testid={`badge-notes-${session.id}`}>
                        <FileText className="h-3 w-3 mr-1" />
                        Notes
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" data-testid={`button-view-${session.id}`}>
                  View Session
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="new" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Session Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="client">Client</Label>
                  <Select>
                    <SelectTrigger id="client" data-testid="select-client">
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Sarah Johnson</SelectItem>
                      <SelectItem value="2">Michael Chen</SelectItem>
                      <SelectItem value="3">Emma Williams</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    defaultValue="2024-11-11"
                    data-testid="input-date"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="50"
                    data-testid="input-duration"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Session Type</Label>
                  <Select>
                    <SelectTrigger id="type" data-testid="select-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual Therapy</SelectItem>
                      <SelectItem value="initial">Initial Consultation</SelectItem>
                      <SelectItem value="followup">Follow-up</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Session Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Enter session notes..."
                    rows={6}
                    data-testid="textarea-notes"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Audio Recording</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className="border-2 border-dashed rounded-lg p-12 text-center space-y-4 hover-elevate cursor-pointer"
                  onClick={() => document.getElementById('audio-upload')?.click()}
                  data-testid="dropzone-audio"
                >
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                  <div className="space-y-2">
                    <p className="font-medium">Upload Session Recording</p>
                    <p className="text-sm text-muted-foreground">
                      Drop audio file or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supports: MP3, WAV, M4A (max 500MB)
                    </p>
                  </div>
                  {audioFile && (
                    <Badge variant="secondary" className="mt-2">
                      <FileText className="h-3 w-3 mr-1" />
                      {audioFile.name}
                    </Badge>
                  )}
                </div>
                <input
                  id="audio-upload"
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={handleFileChange}
                  data-testid="input-audio"
                />

                {audioFile && (
                  <div className="space-y-2">
                    <Button className="w-full" data-testid="button-transcribe">
                      <Mic className="h-4 w-4 mr-2" />
                      Start Transcription
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Transcription runs locally using faster-whisper
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setActiveTab("list")} data-testid="button-cancel">
              Cancel
            </Button>
            <Button data-testid="button-save">
              Save Session
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
