import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ScheduleHeaderProps {
  selectedAssessment: string;
  onAssessmentChange: (value: string) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  userName?: string;
}

export const ScheduleHeader = ({
  selectedAssessment,
  onAssessmentChange,
  searchQuery,
  onSearchChange,
  userName = "Manjunath T",
}: ScheduleHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/admin")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded flex items-center justify-center">
                <div className="text-white font-bold text-sm">S</div>
              </div>
              <div>
                <div className="font-bold text-lg">Saras</div>
                <div className="text-xs text-muted-foreground">TEST & ASSESSMENT</div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">{userName}</span>
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
              MT
            </div>
          </div>
        </div>

        <div className="pb-4">
          <div className="text-sm text-muted-foreground mb-1">Schedules</div>
          <h1 className="text-2xl font-bold mb-4">Schedules</h1>
          
          <div className="flex items-center gap-4">
            <Select value={selectedAssessment} onValueChange={onAssessmentChange}>
              <SelectTrigger className="w-[300px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assessments</SelectItem>
                <SelectItem value="easy-proctor">Easy proctor Test_001</SelectItem>
                <SelectItem value="fullstack">Full Stack Developer Assessment</SelectItem>
                <SelectItem value="datascience">Data Science Fundamentals</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by schedule name"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>

            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create New
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
