import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Settings, Trash2, GripVertical, ChevronDown, ChevronUp, Layers, GitBranch } from "lucide-react";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { mockConfigurations } from "@/data/formsMockData";
import type { FormItem, FormSection, FormBlueprint, FormConfiguration } from "@/types/forms";
import { toast } from "@/hooks/use-toast";
import AddItemsSheet from "@/components/AddItemsSheet";
import AddBlueprintSheet from "@/components/AddBlueprintSheet";
import CreateConfigurationSheet from "@/components/CreateConfigurationSheet";
import ItemBranchingDialog from "@/components/ItemBranchingDialog";
import BranchingFlowPreview from "@/components/BranchingFlowPreview";

const CreateForm = () => {
  const navigate = useNavigate();
  const [formName, setFormName] = useState("");
  const [formCode, setFormCode] = useState("");
  const [configurations, setConfigurations] = useState<FormConfiguration[]>(mockConfigurations);
  const [selectedConfigId, setSelectedConfigId] = useState("default");
  const [sections, setSections] = useState<FormSection[]>([
    { id: "section-1", name: "Section 1", items: [] }
  ]);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [showAddItems, setShowAddItems] = useState(false);
  const [showAddBlueprint, setShowAddBlueprint] = useState(false);
  const [showConfigSheet, setShowConfigSheet] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(["section-1"]);
  const [branchingItem, setBranchingItem] = useState<{ item: FormItem; sectionId: string } | null>(null);

  const selectedConfig = configurations.find((c) => c.id === selectedConfigId);

  const handleConfigurationCreated = (config: FormConfiguration) => {
    setConfigurations([...configurations, config]);
    setSelectedConfigId(config.id);
    toast({ title: "Configuration Created", description: `"${config.name}" has been created and selected` });
  };

  const handleAddSection = () => {
    const newSection: FormSection = {
      id: `section-${Date.now()}`,
      name: `Section ${sections.length + 1}`,
      items: [],
    };
    setSections([...sections, newSection]);
    setExpandedSections([...expandedSections, newSection.id]);
  };

  const handleRemoveSection = (sectionId: string) => {
    if (sections.length === 1) {
      toast({ title: "Error", description: "At least one section is required", variant: "destructive" });
      return;
    }
    setSections(sections.filter((s) => s.id !== sectionId));
    setExpandedSections(expandedSections.filter((id) => id !== sectionId));
  };

  const handleUpdateSectionName = (sectionId: string, name: string) => {
    setSections(sections.map((s) => s.id === sectionId ? { ...s, name } : s));
  };

  const handleOpenAddItems = (sectionId: string) => {
    setActiveSectionId(sectionId);
    setShowAddItems(true);
  };

  const handleOpenAddBlueprint = (sectionId: string) => {
    setActiveSectionId(sectionId);
    setShowAddBlueprint(true);
  };

  const handleAddItemsToSection = (items: FormItem[]) => {
    if (!activeSectionId) return;
    setSections(sections.map((section) => {
      if (section.id === activeSectionId) {
        const existingIds = section.items.map((i) => i.id);
        const newItems = items.filter((item) => !existingIds.includes(item.id));
        return { ...section, items: [...section.items, ...newItems] };
      }
      return section;
    }));
  };

  const handleApplyBlueprint = (blueprint: FormBlueprint) => {
    toast({ 
      title: "Blueprint Applied", 
      description: `Applied "${blueprint.name}" - items will be auto-selected based on rules` 
    });
    // In a real implementation, this would query items based on blueprint rules
  };

  const handleRemoveItem = (sectionId: string, itemId: string) => {
    setSections(sections.map((section) => {
      if (section.id === sectionId) {
        return { ...section, items: section.items.filter((i) => i.id !== itemId) };
      }
      return section;
    }));
  };

  const handleUpdateItem = (sectionId: string, updatedItem: FormItem) => {
    setSections(sections.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          items: section.items.map((i) => (i.id === updatedItem.id ? updatedItem : i)),
        };
      }
      return section;
    }));
  };

  const handleOpenBranching = (item: FormItem, sectionId: string) => {
    setBranchingItem({ item, sectionId });
  };

  const handleSaveBranching = (updatedItem: FormItem) => {
    if (branchingItem) {
      handleUpdateItem(branchingItem.sectionId, updatedItem);
      toast({
        title: updatedItem.hasBranching ? "Branching Updated" : "Branching Removed",
        description: updatedItem.hasBranching
          ? "Navigation rules have been saved"
          : "Branching has been removed from this item",
      });
    }
  };

  // Get all items across all sections for branching targets
  const getAllItemsFlat = () => {
    const result: { sectionId: string; item: FormItem; index: number }[] = [];
    let globalIndex = 0;
    sections.forEach((section) => {
      section.items.forEach((item) => {
        result.push({ sectionId: section.id, item, index: globalIndex });
        globalIndex++;
      });
    });
    return result;
  };

  const toggleSectionExpanded = (sectionId: string) => {
    setExpandedSections(
      expandedSections.includes(sectionId)
        ? expandedSections.filter((id) => id !== sectionId)
        : [...expandedSections, sectionId]
    );
  };

  const getTotalItems = () => sections.reduce((sum, s) => sum + s.items.length, 0);
  const getTotalMarks = () => sections.reduce((sum, s) => sum + s.items.reduce((iSum, i) => iSum + i.marks, 0), 0);

  const getAllExistingItemIds = () => sections.flatMap((s) => s.items.map((i) => i.id));

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
    if (getTotalItems() === 0) {
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
        <div className="max-w-4xl mx-auto space-y-6">
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
                  onClick={() => setShowConfigSheet(true)}
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
                <SelectContent className="bg-popover">
                  {configurations.map((config) => (
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

          {/* Branching Flow Preview */}
          {sections.some(s => s.items.some(i => i.hasBranching)) && (
            <BranchingFlowPreview sections={sections} />
          )}

          {/* Sections */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Sections & Items</CardTitle>
                  <CardDescription>
                    {getTotalItems()} items • {getTotalMarks()} total marks
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleAddSection}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {sections.map((section) => (
                <Collapsible
                  key={section.id}
                  open={expandedSections.includes(section.id)}
                  onOpenChange={() => toggleSectionExpanded(section.id)}
                >
                  <div className="border rounded-lg">
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50">
                        <div className="flex items-center gap-3">
                          {expandedSections.includes(section.id) ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                          <Input
                            value={section.name}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleUpdateSectionName(section.id, e.target.value);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="h-8 w-48 font-medium"
                          />
                          <Badge variant="secondary">
                            {section.items.length} items
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveSection(section.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <Separator />
                      <div className="p-4 space-y-3">
                        {/* Add buttons */}
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenAddItems(section.id)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Items
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenAddBlueprint(section.id)}
                          >
                            <Layers className="h-4 w-4 mr-2" />
                            Add Rule/Blueprint
                          </Button>
                        </div>

                        {/* Items list */}
                        {section.items.length === 0 ? (
                          <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
                            <p className="text-sm">No items in this section</p>
                            <p className="text-xs">Click "Add Items" to get started</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {section.items.map((item, index) => (
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
                                {item.hasBranching && (
                                  <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">
                                    <GitBranch className="h-3 w-3 mr-1" />
                                    Branching
                                  </Badge>
                                )}
                                <span className="text-sm text-muted-foreground">{item.marks} marks</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 text-xs"
                                  onClick={() => handleOpenBranching(item, section.id)}
                                >
                                  <GitBranch className="h-3 w-3 mr-1" />
                                  {item.hasBranching ? "Edit" : "Add"} Branching
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive"
                                  onClick={() => handleRemoveItem(section.id, item.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Sheets */}
      <AddItemsSheet
        open={showAddItems}
        onOpenChange={setShowAddItems}
        existingItemIds={getAllExistingItemIds()}
        onAddItems={handleAddItemsToSection}
      />
      <AddBlueprintSheet
        open={showAddBlueprint}
        onOpenChange={setShowAddBlueprint}
        onApplyBlueprint={handleApplyBlueprint}
      />
      <CreateConfigurationSheet
        open={showConfigSheet}
        onOpenChange={setShowConfigSheet}
        onConfigurationCreated={handleConfigurationCreated}
      />

      {/* Branching Dialog */}
      {branchingItem && (
        <ItemBranchingDialog
          open={!!branchingItem}
          onOpenChange={(open) => !open && setBranchingItem(null)}
          item={branchingItem.item}
          sections={sections}
          currentSectionId={branchingItem.sectionId}
          allItems={getAllItemsFlat()}
          onSaveBranching={handleSaveBranching}
        />
      )}
    </div>
  );
};

export default CreateForm;
