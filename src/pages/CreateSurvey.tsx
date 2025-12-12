import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, X, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { useToast } from "@/hooks/use-toast";
import { availableSurveyItems } from "@/data/surveyMockData";
import type { SurveyItem } from "@/types/survey";

const CreateSurvey = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [surveyName, setSurveyName] = useState("");
  const [instructions, setInstructions] = useState("");
  const [selectedItems, setSelectedItems] = useState<SurveyItem[]>([]);

  const handleItemToggle = (item: SurveyItem) => {
    setSelectedItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) {
        return prev.filter((i) => i.id !== item.id);
      }
      return [...prev, item];
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setSelectedItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const isItemSelected = (itemId: string) => {
    return selectedItems.some((i) => i.id === itemId);
  };

  const getTypeBadge = (type: SurveyItem['type']) => {
    switch (type) {
      case 'rating':
        return <Badge variant="outline" className="bg-primary/10 text-primary">Rating</Badge>;
      case 'text':
        return <Badge variant="outline" className="bg-success/10 text-success">Text</Badge>;
      case 'multiple-choice':
        return <Badge variant="outline" className="bg-accent/10 text-accent">Multiple Choice</Badge>;
      case 'checkbox':
        return <Badge variant="outline" className="bg-warning/10 text-warning">Checkbox</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const handleSave = (status: 'draft' | 'published') => {
    if (!surveyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a survey name",
        variant: "destructive",
      });
      return;
    }

    if (selectedItems.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one item",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: `Survey ${status === 'published' ? 'published' : 'saved as draft'} successfully`,
    });
    navigate("/surveys");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-1 p-6">
          {/* Title and Actions */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/surveys")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Create Survey</h1>
                <p className="text-sm text-muted-foreground">
                  Build a new feedback survey
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleSave('draft')}>
                Save as Draft
              </Button>
              <Button onClick={() => handleSave('published')}>
                Publish Survey
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Survey Details */}
            <div className="space-y-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Survey Details</CardTitle>
                  <CardDescription>Enter the basic information for your survey</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="surveyName">Survey Name</Label>
                    <Input
                      id="surveyName"
                      placeholder="Enter survey name"
                      value={surveyName}
                      onChange={(e) => setSurveyName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instructions">Instructions</Label>
                    <Textarea
                      id="instructions"
                      placeholder="Enter instructions for respondents..."
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Selected Items */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Selected Items ({selectedItems.length})</CardTitle>
                  <CardDescription>Items that will appear in your survey</CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedItems.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No items selected. Choose items from the list on the right.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {selectedItems.map((item, index) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                        >
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-muted-foreground w-6">
                            {index + 1}.
                          </span>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{item.title}</p>
                          </div>
                          {getTypeBadge(item.type)}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Available Items */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Available Items</CardTitle>
                <CardDescription>Select items to add to your survey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {availableSurveyItems.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        isItemSelected(item.id)
                          ? "bg-primary/5 border-primary"
                          : "hover:bg-muted/50 border-border"
                      }`}
                      onClick={() => handleItemToggle(item)}
                    >
                      <Checkbox
                        checked={isItemSelected(item.id)}
                        onCheckedChange={() => handleItemToggle(item)}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.title}</p>
                      </div>
                      {getTypeBadge(item.type)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-muted-foreground">
            Powered by Saras | Copyright © 2025 of Excelsoft Technologies Ltd{" "}
            <a
              href="https://www.excelsoftcorp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              https://www.excelsoftcorp.com
            </a>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateSurvey;