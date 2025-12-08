import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Settings, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { mockConfigurations } from "@/data/formsMockData";
import type { FormConfiguration, FormItem } from "@/types/forms";
import { toast } from "@/hooks/use-toast";

// Mock available items to add
const availableItems: FormItem[] = [
  { id: "item-1", title: "What is the capital of France?", type: "mcq", marks: 2 },
  { id: "item-2", title: "Explain the theory of relativity", type: "essay", marks: 10 },
  { id: "item-3", title: "The sun rises in the ___", type: "fill-blank", marks: 1 },
  { id: "item-4", title: "Water boils at 100°C", type: "true-false", marks: 1 },
  { id: "item-5", title: "Calculate the area of a circle with radius 5", type: "mcq", marks: 3 },
  { id: "item-6", title: "Describe photosynthesis process", type: "essay", marks: 8 },
];

const CreateForm = () => {
  const navigate = useNavigate();
  const [formName, setFormName] = useState("");
  const [formCode, setFormCode] = useState("");
  const [selectedConfigId, setSelectedConfigId] = useState("default");
  const [selectedItems, setSelectedItems] = useState<FormItem[]>([]);

  const selectedConfig = mockConfigurations.find((c) => c.id === selectedConfigId);

  const handleAddItem = (item: FormItem) => {
    if (!selectedItems.find((i) => i.id === item.id)) {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setSelectedItems(selectedItems.filter((i) => i.id !== itemId));
  };

  const getTotalMarks = () => {
    return selectedItems.reduce((sum, item) => sum + item.marks, 0);
  };

  const getItemTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      mcq: "bg-blue-500/10 text-blue-600",
      essay: "bg-purple-500/10 text-purple-600",
      "fill-blank": "bg-orange-500/10 text-orange-600",
      "true-false": "bg-green-500/10 text-green-600",
    };
    return colors[type] || "bg-muted text-muted-foreground";
  };

  const handleSubmit = () => {
    if (!formName.trim()) {
      toast({ title: "Error", description: "Form name is required", variant: "destructive" });
      return;
    }
    if (!formCode.trim()) {
      toast({ title: "Error", description: "Form code is required", variant: "destructive" });
      return;
    }
    if (selectedItems.length === 0) {
      toast({ title: "Error", description: "Add at least one item", variant: "destructive" });
      return;
    }

    toast({ title: "Success", description: "Form created successfully" });
    navigate("/forms");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/forms")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Create New Form</h1>
                <p className="text-sm text-muted-foreground">
                  Configure your question paper
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate("/forms")}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Save Form</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Form Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Form Details</CardTitle>
                <CardDescription>Basic information about your form</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="formName">Form Name *</Label>
                    <Input
                      id="formName"
                      placeholder="e.g., Mathematics Final Exam"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="formCode">Form Code *</Label>
                    <Input
                      id="formCode"
                      placeholder="e.g., MATH-101"
                      value={formCode}
                      onChange={(e) => setFormCode(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Configuration Selection */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Configuration</CardTitle>
                    <CardDescription>Select exam settings configuration</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/forms/configurations/create")}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Config
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={selectedConfigId} onValueChange={setSelectedConfigId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a configuration" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockConfigurations.map((config) => (
                      <SelectItem key={config.id} value={config.id}>
                        <div className="flex items-center gap-2">
                          {config.name}
                          {config.isDefault && (
                            <Badge variant="secondary" className="text-xs">
                              Default
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedConfig && (
                  <div className="bg-muted/50 rounded-lg p-4 space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Configuration Preview</span>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                      <span>Duration:</span>
                      <span className="text-foreground">{selectedConfig.examRules.duration} min</span>
                      <span>Language:</span>
                      <span className="text-foreground">{selectedConfig.examRules.language}</span>
                      <span>Back Navigation:</span>
                      <span className="text-foreground">
                        {selectedConfig.examRules.allowBackNavigation ? "Allowed" : "Not Allowed"}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Selected Items */}
            <Card>
              <CardHeader>
                <CardTitle>Selected Items ({selectedItems.length})</CardTitle>
                <CardDescription>
                  Total Marks: {getTotalMarks()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedItems.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No items added yet</p>
                    <p className="text-sm">Select items from the panel on the right</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedItems.map((item, index) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 border rounded-lg bg-card hover:bg-muted/50"
                      >
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                        <span className="text-sm font-medium text-muted-foreground w-6">
                          {index + 1}.
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">{item.title}</p>
                        </div>
                        <Badge className={getItemTypeBadge(item.type)}>{item.type}</Badge>
                        <span className="text-sm text-muted-foreground">{item.marks} marks</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Available Items */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Available Items</CardTitle>
                <CardDescription>Click to add items to your form</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {availableItems.map((item) => {
                    const isSelected = selectedItems.find((i) => i.id === item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => !isSelected && handleAddItem(item)}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-muted/50 border-primary/50 opacity-50 cursor-not-allowed"
                            : "hover:bg-muted/50 hover:border-primary/30"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm flex-1">{item.title}</p>
                          <Plus className={`h-4 w-4 shrink-0 ${isSelected ? "invisible" : ""}`} />
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={`text-xs ${getItemTypeBadge(item.type)}`}>
                            {item.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{item.marks} marks</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateForm;
