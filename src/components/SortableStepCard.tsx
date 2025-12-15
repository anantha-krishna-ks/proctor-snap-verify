import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronDown,
  ChevronRight,
  X,
  GripVertical,
  Shield,
  Camera,
  Globe,
  Mic,
  Monitor,
  PlayCircle,
  ClipboardList,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import type { Form } from "@/types/forms";
import type { Survey } from "@/types/survey";

interface TestSequenceStep {
  id: string;
  type: "system-check" | "form" | "survey" | "agreement";
  name: string;
  order: number;
  config?: {
    popBlocker?: boolean;
    camera?: boolean;
    browser?: boolean;
    microphone?: boolean;
    screenShare?: boolean;
  };
  formIds?: string[];
  formSelectionMode?: "in-order" | "random";
  surveyId?: string;
  agreementText?: string;
}

interface SortableStepCardProps {
  step: TestSequenceStep;
  isExpanded: boolean;
  onToggleExpand: (stepId: string) => void;
  onRemoveStep: (stepId: string) => void;
  onUpdateSystemCheckConfig: (stepId: string, key: string, value: boolean) => void;
  onUpdateFormIds: (stepId: string, formId: string, checked: boolean) => void;
  onUpdateFormSelectionMode: (stepId: string, mode: "in-order" | "random") => void;
  forms: Form[];
  surveys: Survey[];
}

const getStepIcon = (type: string) => {
  switch (type) {
    case "system-check":
      return <Monitor className="h-5 w-5 text-primary" />;
    case "form":
      return <PlayCircle className="h-5 w-5 text-primary" />;
    case "survey":
      return <ClipboardList className="h-5 w-5 text-primary" />;
    case "agreement":
      return <FileText className="h-5 w-5 text-primary" />;
    default:
      return <FileText className="h-5 w-5 text-primary" />;
  }
};

export const SortableStepCard = ({
  step,
  isExpanded,
  onToggleExpand,
  onRemoveStep,
  onUpdateSystemCheckConfig,
  onUpdateFormIds,
  onUpdateFormSelectionMode,
  forms,
  surveys,
}: SortableStepCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : ("auto" as const),
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card className="border border-border">
        <CardHeader className="py-3 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                {...listeners}
                className="cursor-grab active:cursor-grabbing touch-none"
              >
                <GripVertical className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              </div>
              <Badge variant="outline" className="text-xs font-mono">
                Step {step.order}
              </Badge>
              {getStepIcon(step.type)}
              <CardTitle className="text-base font-medium">{step.name}</CardTitle>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onToggleExpand(step.id)}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
              {step.type !== "system-check" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => onRemoveStep(step.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        {isExpanded && (
          <CardContent className="pt-0 pb-4 px-4">
            {step.type === "system-check" && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pl-8">
                <div className="flex items-center justify-between space-x-2 p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor={`pop-blocker-${step.id}`} className="text-sm">
                      Pop Blocker
                    </Label>
                  </div>
                  <Switch
                    id={`pop-blocker-${step.id}`}
                    checked={step.config?.popBlocker || false}
                    onCheckedChange={(checked) => onUpdateSystemCheckConfig(step.id, "popBlocker", checked)}
                  />
                </div>
                <div className="flex items-center justify-between space-x-2 p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Camera className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor={`camera-${step.id}`} className="text-sm">
                      Camera
                    </Label>
                  </div>
                  <Switch
                    id={`camera-${step.id}`}
                    checked={step.config?.camera || false}
                    onCheckedChange={(checked) => onUpdateSystemCheckConfig(step.id, "camera", checked)}
                  />
                </div>
                <div className="flex items-center justify-between space-x-2 p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor={`browser-${step.id}`} className="text-sm">
                      Browser
                    </Label>
                  </div>
                  <Switch
                    id={`browser-${step.id}`}
                    checked={step.config?.browser || false}
                    onCheckedChange={(checked) => onUpdateSystemCheckConfig(step.id, "browser", checked)}
                  />
                </div>
                <div className="flex items-center justify-between space-x-2 p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Mic className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor={`microphone-${step.id}`} className="text-sm">
                      Microphone
                    </Label>
                  </div>
                  <Switch
                    id={`microphone-${step.id}`}
                    checked={step.config?.microphone || false}
                    onCheckedChange={(checked) => onUpdateSystemCheckConfig(step.id, "microphone", checked)}
                  />
                </div>
                <div className="flex items-center justify-between space-x-2 p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor={`screen-share-${step.id}`} className="text-sm">
                      Screen Share
                    </Label>
                  </div>
                  <Switch
                    id={`screen-share-${step.id}`}
                    checked={step.config?.screenShare || false}
                    onCheckedChange={(checked) => onUpdateSystemCheckConfig(step.id, "screenShare", checked)}
                  />
                </div>
              </div>
            )}

            {step.type === "form" && (
              <div className="pl-8 space-y-3">
                {(step.formIds?.length || 0) > 1 && (
                  <div className="flex items-center gap-3 mb-3">
                    <Label className="text-sm text-muted-foreground">Form Selection Order:</Label>
                    <Select
                      value={step.formSelectionMode || "in-order"}
                      onValueChange={(value: "in-order" | "random") => onUpdateFormSelectionMode(step.id, value)}
                    >
                      <SelectTrigger className="w-40 bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="in-order">In Order</SelectItem>
                        <SelectItem value="random">Random</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <Label className="text-sm text-muted-foreground">
                  Select forms to include in this step
                </Label>
                <div className="border border-border rounded-lg max-h-[200px] overflow-y-auto">
                  {forms.map((form) => (
                    <div
                      key={form.id}
                      className="flex items-center gap-3 p-3 border-b border-border last:border-b-0 hover:bg-muted/50"
                    >
                      <Checkbox
                        id={`form-${step.id}-${form.id}`}
                        checked={step.formIds?.includes(form.id) || false}
                        onCheckedChange={(checked) => onUpdateFormIds(step.id, form.id, !!checked)}
                      />
                      <div className="flex items-center gap-2 flex-1">
                        <PlayCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">{form.name}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {form.model}
                      </Badge>
                    </div>
                  ))}
                </div>
                {(step.formIds?.length || 0) > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {step.formIds?.length} form{(step.formIds?.length || 0) > 1 ? "s" : ""} selected
                    {(step.formIds?.length || 0) > 1 && ` • ${step.formSelectionMode === "random" ? "Random" : "Sequential"} order`}
                  </p>
                )}
              </div>
            )}

            {step.type === "survey" && (
              <div className="pl-8 space-y-3">
                <Label className="text-sm text-muted-foreground">Select a survey for this step</Label>
                <Select>
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="Choose a survey" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {surveys.map((survey) => (
                      <SelectItem key={survey.id} value={survey.id}>
                        {survey.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {step.type === "agreement" && (
              <div className="pl-8 space-y-3">
                <Label className="text-sm text-muted-foreground">Agreement Text</Label>
                <textarea
                  className="w-full min-h-[120px] p-3 rounded-md border border-border bg-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter the agreement text that candidates must accept before proceeding..."
                />
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
};
