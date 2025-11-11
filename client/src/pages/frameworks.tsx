import { useState } from "react";
import { Plus, Upload, FileText, Tag, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

//todo: remove mock functionality
const mockFrameworks = [
  {
    id: "1",
    name: "Cognitive Behavioral Therapy (CBT)",
    description: "Evidence-based approach for treating anxiety, depression, and other mental health conditions",
    tags: ["CBT", "Anxiety", "Depression"],
    templateStructure: "1. Problem identification\n2. Thought records\n3. Behavioral experiments\n4. Homework assignments",
    uploadedFiles: ["cbt-manual.pdf", "thought-record-template.pdf"],
  },
  {
    id: "2",
    name: "Dialectical Behavior Therapy (DBT)",
    description: "Focuses on emotional regulation, distress tolerance, and interpersonal effectiveness",
    tags: ["DBT", "Emotion Regulation", "BPD"],
    templateStructure: "1. Mindfulness practice\n2. Skills training\n3. Phone coaching\n4. Diary cards",
    uploadedFiles: ["dbt-workbook.pdf"],
  },
];

export default function Frameworks() {
  const [frameworks] = useState(mockFrameworks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="p-8 space-y-8 max-w-7xl">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold" data-testid="text-page-title">Treatment Frameworks</h1>
          <p className="text-muted-foreground">Manage therapeutic frameworks and treatment templates</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-framework">
              <Plus className="h-4 w-4 mr-2" />
              Add Framework
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Treatment Framework</DialogTitle>
              <DialogDescription>
                Upload framework documents and define treatment plan templates
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 mt-4">
              <div className="space-y-2">
                <Label htmlFor="framework-name">Framework Name</Label>
                <Input
                  id="framework-name"
                  placeholder="e.g., Cognitive Behavioral Therapy"
                  data-testid="input-framework-name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief overview of the framework and its applications..."
                  rows={3}
                  data-testid="textarea-description"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  placeholder="e.g., CBT, Anxiety, Depression (comma-separated)"
                  data-testid="input-tags"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="template">Treatment Plan Template</Label>
                <Textarea
                  id="template"
                  placeholder="Define the structure for treatment plans using this framework..."
                  rows={6}
                  className="font-mono text-sm"
                  data-testid="textarea-template"
                />
              </div>

              <div className="space-y-2">
                <Label>Framework Documents</Label>
                <div
                  className="border-2 border-dashed rounded-lg p-8 text-center space-y-3 hover-elevate cursor-pointer"
                  onClick={() => document.getElementById('framework-upload')?.click()}
                  data-testid="dropzone-framework"
                >
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Upload Framework Files</p>
                    <p className="text-xs text-muted-foreground">
                      PDF, Markdown, or text files
                    </p>
                  </div>
                </div>
                <input
                  id="framework-upload"
                  type="file"
                  multiple
                  accept=".pdf,.md,.txt"
                  className="hidden"
                  data-testid="input-framework-files"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} data-testid="button-cancel">
                  Cancel
                </Button>
                <Button onClick={() => {
                  console.log('Framework saved');
                  setIsDialogOpen(false);
                }} data-testid="button-save-framework">
                  Save Framework
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {frameworks.map((framework) => (
          <Card key={framework.id} data-testid={`card-framework-${framework.id}`}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    {framework.name}
                  </CardTitle>
                  <CardDescription>{framework.description}</CardDescription>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {framework.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" data-testid={`badge-tag-${tag}`}>
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="template">
                <TabsList className="w-full">
                  <TabsTrigger value="template" className="flex-1">Template</TabsTrigger>
                  <TabsTrigger value="files" className="flex-1">Files</TabsTrigger>
                </TabsList>
                
                <TabsContent value="template" className="mt-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <pre className="text-sm whitespace-pre-wrap font-mono">
                      {framework.templateStructure}
                    </pre>
                  </div>
                </TabsContent>
                
                <TabsContent value="files" className="mt-4">
                  <div className="space-y-2">
                    {framework.uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 rounded border hover-elevate"
                      >
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{file}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex gap-2 mt-4 pt-4 border-t">
                <Button variant="outline" size="sm" className="flex-1" data-testid={`button-edit-${framework.id}`}>
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1" data-testid={`button-view-${framework.id}`}>
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
