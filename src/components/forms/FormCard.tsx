import { motion } from "framer-motion";
import { 
  Clock, 
  Users, 
  TrendingUp, 
  BarChart3,
  Copy,
  Pencil,
  Archive,
  Calendar,
  MoreVertical,
  Shield,
  Eye,
  Navigation,
  FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { FormTemplate, ExposureStatus, FormType } from "@/types/formTemplates";

interface FormCardProps {
  form: FormTemplate;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onSchedule: (id: string) => void;
  onRetire: (id: string) => void;
  index: number;
}

const getStatusColor = (status: ExposureStatus) => {
  switch (status) {
    case "new": return "bg-info/10 text-info border-info/20";
    case "active": return "bg-success/10 text-success border-success/20";
    case "flagged": return "bg-warning/10 text-warning border-warning/20";
    case "retired": return "bg-muted text-muted-foreground border-border";
    default: return "bg-muted text-muted-foreground border-border";
  }
};

const getTypeColor = (type: FormType) => {
  switch (type) {
    case "test": return "bg-primary/10 text-primary";
    case "survey": return "bg-accent/10 text-accent";
    case "quiz": return "bg-success/10 text-success";
    case "practice": return "bg-warning/10 text-warning";
    default: return "bg-muted text-muted-foreground";
  }
};

const getNavigationLabel = (style: string) => {
  switch (style) {
    case "forward-only": return "Forward Only";
    case "free": return "Free Navigation";
    case "section-locked": return "Section Locked";
    default: return style;
  }
};

export const FormCard = ({
  form,
  onView,
  onEdit,
  onDuplicate,
  onSchedule,
  onRetire,
  index,
}: FormCardProps) => {
  const { metadata, preferences, exposure, status, blueprint } = form;
  const totalItems = blueprint.reduce((sum, rule) => sum + rule.count, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group"
    >
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:border-primary/30">
        {/* Header */}
        <div className="p-5 pb-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className={cn("text-xs font-medium capitalize", getTypeColor(metadata.type))}>
                  {metadata.type}
                </Badge>
                <Badge variant="outline" className={cn("text-xs border", getStatusColor(status))}>
                  {status}
                </Badge>
              </div>
              <h3 
                className="font-semibold text-foreground text-lg leading-tight truncate cursor-pointer hover:text-primary transition-colors"
                onClick={() => onView(form.id)}
              >
                {metadata.title}
              </h3>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-popover">
                <DropdownMenuItem onClick={() => onView(form.id)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(form.id)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDuplicate(form.id)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onSchedule(form.id)}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onRetire(form.id)} className="text-destructive">
                  <Archive className="h-4 w-4 mr-2" />
                  Retire
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Subject & Grade */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <span className="font-medium text-foreground">{metadata.subject}</span>
            {metadata.grade && (
              <>
                <span>•</span>
                <span>{metadata.grade}</span>
              </>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {metadata.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs bg-secondary text-secondary-foreground rounded-md"
              >
                {tag}
              </span>
            ))}
            {metadata.tags.length > 4 && (
              <span className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded-md">
                +{metadata.tags.length - 4}
              </span>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground font-medium">{preferences.duration}m</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground font-medium">{totalItems} items</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Navigation className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground font-medium text-xs">{getNavigationLabel(preferences.navigationStyle).split(' ')[0]}</span>
            </div>
          </div>

          {/* Preferences Icons */}
          <div className="flex items-center gap-2">
            {preferences.proctoring.enabled && (
              <div className="flex items-center gap-1 px-2 py-1 bg-primary/5 rounded-md" title="Proctoring Enabled">
                <Shield className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs text-primary">Proctored</span>
              </div>
            )}
            {preferences.anonymity && (
              <div className="flex items-center gap-1 px-2 py-1 bg-accent/5 rounded-md" title="Anonymous">
                <Eye className="h-3.5 w-3.5 text-accent" />
                <span className="text-xs text-accent">Anonymous</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer - Exposure Stats */}
        <div className="px-5 py-3 bg-muted/30 border-t border-border">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground mb-0.5">
                <Users className="h-3.5 w-3.5" />
              </div>
              <p className="text-sm font-semibold text-foreground">{exposure.totalCandidates.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Candidates</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground mb-0.5">
                <TrendingUp className="h-3.5 w-3.5" />
              </div>
              <p className="text-sm font-semibold text-foreground">{exposure.avgScore > 0 ? `${exposure.avgScore}%` : '—'}</p>
              <p className="text-xs text-muted-foreground">Avg Score</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground mb-0.5">
                <BarChart3 className="h-3.5 w-3.5" />
              </div>
              <p className="text-sm font-semibold text-foreground">{exposure.reliability > 0 ? exposure.reliability.toFixed(2) : '—'}</p>
              <p className="text-xs text-muted-foreground">Reliability</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
