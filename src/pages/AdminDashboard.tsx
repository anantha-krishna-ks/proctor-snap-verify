import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatCard } from "@/components/admin/StatCard";
import { RecentActivityList } from "@/components/admin/RecentActivityList";
import { dashboardStats, recentActivities } from "@/data/adminMockData";
import { 
  Users, 
  Shield, 
  PenTool, 
  Eye, 
  FileEdit, 
  Database, 
  FileText, 
  CheckCircle2, 
  Activity,
  Clock,
  UserCheck
} from "lucide-react";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      
      <main className="container mx-auto px-6 py-6">
        {/* User Statistics */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-foreground">User Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <StatCard
              title="Total Users"
              value={dashboardStats.totalUsers}
              icon={Users}
              trend={{ value: 12, isPositive: true }}
            />
            <StatCard
              title="Admins"
              value={dashboardStats.totalAdmins}
              icon={Shield}
              description="System administrators"
            />
            <StatCard
              title="Authors"
              value={dashboardStats.totalAuthors}
              icon={PenTool}
              description="Content creators"
            />
            <StatCard
              title="Proctors"
              value={dashboardStats.totalProctors}
              icon={Eye}
              description="Test supervisors"
            />
            <StatCard
              title="Test Authors"
              value={dashboardStats.totalTestAuthors}
              icon={FileEdit}
              description="Assessment creators"
            />
            <StatCard
              title="Markers"
              value={dashboardStats.totalMarkers}
              icon={UserCheck}
              description="Evaluators"
            />
          </div>
        </section>

        {/* Assessment Metrics */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Assessment Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Items Created"
              value={dashboardStats.totalItems}
              icon={Database}
              trend={{ value: 8, isPositive: true }}
            />
            <StatCard
              title="Tests Created"
              value={dashboardStats.totalTests}
              icon={FileText}
              description="Total test assessments"
            />
            <StatCard
              title="Successful Tests Taken"
              value={dashboardStats.successfulTestsTaken.toLocaleString()}
              icon={CheckCircle2}
              trend={{ value: 15, isPositive: true }}
            />
            <StatCard
              title="Active Assessments"
              value={dashboardStats.activeAssessments}
              icon={Activity}
              description="Currently running"
            />
          </div>
        </section>

        {/* Recent Activity & Quick Actions */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentActivityList activities={recentActivities} />
          </div>
          
          <div className="space-y-4">
            <StatCard
              title="Pending Approvals"
              value={dashboardStats.pendingApprovals}
              icon={Clock}
              description="Headshots awaiting review"
              className="bg-warning/5 border-warning/20"
            />
          </div>
        </section>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          Powered by Saras | Copyright © 2025 of Excelsoft Technologies Ltd
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
