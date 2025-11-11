import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Cloud, Download, Shield, Database, Zap } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Landing() {
  const detectPlatform = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.indexOf("win") !== -1) return "windows";
    if (userAgent.indexOf("mac") !== -1) return "mac";
    return "linux";
  };

  const [selectedPlatform, setSelectedPlatform] = useState<string>(detectPlatform());

  const handleDownload = (platform?: string) => {
    const targetPlatform = platform || selectedPlatform;
    setSelectedPlatform(targetPlatform);
    window.location.href = `/api/download/${targetPlatform}`;
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">TheraVault</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Privacy-First Counselling Practice Management
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Manage client records, session notes, and treatment frameworks with complete data sovereignty. 
              All data stays on your machine, encrypted and offline.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto pt-8">
            <Card className="hover-elevate">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Cloud className="h-5 w-5 text-primary" />
                  <CardTitle>Try Cloud Version</CardTitle>
                </div>
                <CardDescription>
                  Test the application instantly in your browser. Great for evaluation and demos.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/dashboard">
                  <Button className="w-full" size="lg" data-testid="button-try-cloud">
                    Launch Cloud App
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover-elevate border-primary/50">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Download className="h-5 w-5 text-primary" />
                  <CardTitle>Download Desktop App</CardTitle>
                </div>
                <CardDescription>
                  Full offline version with local AI and encrypted storage. Recommended for clinical use.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button 
                    className="flex-1" 
                    size="lg" 
                    variant="default" 
                    data-testid="button-download-desktop"
                    onClick={() => handleDownload()}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="lg" variant="outline" data-testid="button-download-platform-selector">
                        ▼
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleDownload("windows")} data-testid="menuitem-download-windows">
                        Windows
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownload("mac")} data-testid="menuitem-download-mac">
                        macOS
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownload("linux")} data-testid="menuitem-download-linux">
                        Linux
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Auto-detects your platform • {selectedPlatform}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 pt-16">
            <div className="space-y-2">
              <Shield className="h-8 w-8 text-primary mx-auto" />
              <h3 className="font-semibold">HIPAA-Like Privacy</h3>
              <p className="text-sm text-muted-foreground">
                All client data encrypted at rest with no cloud synchronization
              </p>
            </div>
            <div className="space-y-2">
              <Database className="h-8 w-8 text-primary mx-auto" />
              <h3 className="font-semibold">Local AI Processing</h3>
              <p className="text-sm text-muted-foreground">
                Session transcription and note generation using local models
              </p>
            </div>
            <div className="space-y-2">
              <Zap className="h-8 w-8 text-primary mx-auto" />
              <h3 className="font-semibold">Offline-First</h3>
              <p className="text-sm text-muted-foreground">
                Works completely offline with no internet required
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t mt-24">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>TheraVault - Privacy-first counselling practice management</p>
        </div>
      </footer>
    </div>
  );
}
