import { schedules } from "@/data/mockData";
import { ScheduleCard } from "@/components/ScheduleCard";
import { Button } from "@/components/ui/button";
import { Plus, LayoutDashboard } from "lucide-react";

const ScheduleDashboard = () => {
  const totalPendingApprovals = schedules.reduce(
    (sum, schedule) => sum + schedule.pendingApprovals,
    0
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Assessment Schedules</h1>
                <p className="text-sm text-muted-foreground">
                  Manage and monitor your assessment schedules
                </p>
              </div>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Schedule
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {totalPendingApprovals > 0 && (
          <div className="mb-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
            <p className="text-sm font-medium">
              {totalPendingApprovals} headshot approval{totalPendingApprovals > 1 ? "s" : ""} pending across all schedules. 
              Click on the badge in any schedule card to review.
            </p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {schedules.map((schedule) => (
            <ScheduleCard key={schedule.id} schedule={schedule} />
          ))}
        </div>

        {schedules.length === 0 && (
          <div className="text-center py-12">
            <LayoutDashboard className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No schedules yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first assessment schedule to get started
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Schedule
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ScheduleDashboard;
