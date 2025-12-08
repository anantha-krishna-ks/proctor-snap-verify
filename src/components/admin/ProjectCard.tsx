import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderOpen, FileText, Calendar, MoreHorizontal, Image } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import type { Project } from "@/data/projectMockData";

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(`/admin/products/${project.id}/${path}`);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
      {/* Image Section */}
      <div className="h-40 bg-muted flex items-center justify-center relative">
        {project.image ? (
          <img
            src={project.image}
            alt={project.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <Image className="h-12 w-12 mb-2" />
            <span className="text-sm">IMAGE NOT FOUND</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground truncate">Code: {project.code}</p>
            <h3 className="font-semibold text-foreground truncate" title={project.name}>
              {project.name}
            </h3>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleNavigate("items")}>
                View Items
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNavigate("tests")}>
                View Tests
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/schedules")}>
                View Schedules
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNavigate("blueprints")}>
                View Blueprints
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Stats Section */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-1.5">
            <FolderOpen className="h-4 w-4" />
            <span>{project.itemCount}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FileText className="h-4 w-4" />
            <span>{project.testCount}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>{project.scheduleCount}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
