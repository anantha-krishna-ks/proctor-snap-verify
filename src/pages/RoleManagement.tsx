import { useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePrivileges } from "@/hooks/usePrivileges";
import { AVAILABLE_PRIVILEGES, Role } from "@/types/privileges";
import { mockUsers } from "@/data/adminMockData";
import { Plus, Pencil, Trash2, Shield, UserPlus, X } from "lucide-react";
import { toast } from "sonner";

interface RoleFormProps {
  formData: {
    name: string;
    description: string;
    privileges: string[];
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    description: string;
    privileges: string[];
  }>>;
  isEditing: boolean;
  privilegesByCategory: Record<string, typeof AVAILABLE_PRIVILEGES>;
}

const RoleForm = ({ formData, setFormData, isEditing, privilegesByCategory }: RoleFormProps) => {
  const togglePrivilege = (privilegeId: string) => {
    setFormData(prev => ({
      ...prev,
      privileges: prev.privileges.includes(privilegeId)
        ? prev.privileges.filter(p => p !== privilegeId)
        : [...prev.privileges, privilegeId],
    }));
  };

  return (
    <div className="space-y-6 py-4">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">
            Basic information
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium block mb-1">
                Role name <span className="text-destructive">*</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Senior Marker, Content Reviewer"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Short description of this role"
                rows={3}
                className="resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-muted-foreground">
            Privileges
          </h3>
          <span className="text-xs text-muted-foreground">
            {formData.privileges.length} selected
          </span>
        </div>
        <ScrollArea className="h-[320px] border rounded-md p-3">
          <div className="space-y-4">
            {Object.entries(privilegesByCategory).map(([category, privs]) => (
              <div key={category} className="space-y-2">
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {category.replace(/_/g, " ")}
                </div>
                <div className="space-y-2 pl-1">
                  {privs.map((priv) => (
                    <div
                      key={priv.id}
                      className="flex items-start gap-2 rounded-md px-1 py-1.5 hover:bg-muted/60 transition-colors"
                    >
                      <Checkbox
                        id={`${isEditing ? "edit" : "create"}-${priv.id}`}
                        checked={formData.privileges.includes(priv.id)}
                        onCheckedChange={() => togglePrivilege(priv.id)}
                        className="mt-0.5"
                      />
                      <label
                        htmlFor={`${isEditing ? "edit" : "create"}-${priv.id}`}
                        className="text-sm cursor-pointer leading-tight flex-1"
                      >
                        <div className="font-medium">{priv.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {priv.description}
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

const RoleManagement = () => {
  const { roles, createRole, updateRole, deleteRole, userRoles, assignRole, removeRole, getUserRoles } = usePrivileges();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    privileges: [] as string[],
  });
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleCreate = () => {
    if (!formData.name.trim()) {
      toast.error("Role name is required");
      return;
    }
    createRole({
      name: formData.name,
      description: formData.description,
      privileges: formData.privileges,
      isSystemRole: false,
    });
    toast.success("Role created successfully");
    setIsCreateOpen(false);
    resetForm();
  };

  const handleUpdate = () => {
    if (!editingRole) return;
    updateRole(editingRole.id, {
      name: formData.name,
      description: formData.description,
      privileges: formData.privileges,
    });
    toast.success("Role updated successfully");
    setEditingRole(null);
    resetForm();
  };

  const handleDelete = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (role?.isSystemRole) {
      toast.error("Cannot delete system roles");
      return;
    }
    deleteRole(roleId);
    toast.success("Role deleted successfully");
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", privileges: [] });
  };

  const openEdit = (role: Role) => {
    if (role.isSystemRole) {
      toast.error("Cannot edit system roles");
      return;
    }
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      privileges: role.privileges,
    });
  };

  const togglePrivilege = (privilegeId: string) => {
    setFormData(prev => ({
      ...prev,
      privileges: prev.privileges.includes(privilegeId)
        ? prev.privileges.filter(p => p !== privilegeId)
        : [...prev.privileges, privilegeId],
    }));
  };

  const handleAssignRole = () => {
    if (!selectedUserId || !selectedRoleId) {
      toast.error("Please select both user and role");
      return;
    }
    assignRole(selectedUserId, selectedRoleId);
    toast.success("Role assigned successfully");
    setSelectedUserId("");
    setSelectedRoleId("");
  };

  const handleRemoveRole = (userId: string, roleId: string) => {
    removeRole(userId, roleId);
    toast.success("Role removed successfully");
  };

  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const privilegesByCategory = AVAILABLE_PRIVILEGES.reduce((acc, priv) => {
    if (!acc[priv.category]) acc[priv.category] = [];
    acc[priv.category].push(priv);
    return acc;
  }, {} as Record<string, typeof AVAILABLE_PRIVILEGES>);

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="container mx-auto px-6 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Role & User Management</h2>
          <p className="text-muted-foreground">
            Create roles, manage privileges, and assign users to roles
          </p>
        </div>

        <Tabs defaultValue="roles" className="w-full">
          <TabsList>
            <TabsTrigger value="roles">Roles & Privileges</TabsTrigger>
            <TabsTrigger value="assignments">User Assignments</TabsTrigger>
          </TabsList>

          <TabsContent value="roles" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-muted-foreground">
                Manage roles and their privileges
              </p>
              <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <SheetTrigger asChild>
                  <Button onClick={() => { resetForm(); setEditingRole(null); }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Role
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:w-[640px] sm:max-w-[640px] overflow-y-auto">
                  <SheetHeader className="pb-2">
                    <SheetTitle>Create role</SheetTitle>
                    <SheetDescription>
                      Configure a reusable role and assign granular privileges.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-2">
                    <RoleForm
                      formData={formData}
                      setFormData={setFormData}
                      isEditing={false}
                      privilegesByCategory={privilegesByCategory}
                    />
                  </div>
                  <SheetFooter className="mt-4 flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsCreateOpen(false);
                        resetForm();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleCreate}>Create role</Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {roles.map((role) => (
                <Card key={role.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          {role.name}
                          {role.isSystemRole && (
                            <Badge variant="secondary">
                              <Shield className="h-3 w-3 mr-1" />
                              System
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>{role.description}</CardDescription>
                      </div>
                      {!role.isSystemRole && (
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEdit(role)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(role.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm font-medium">
                        Privileges ({role.privileges.length})
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {role.privileges.slice(0, 5).map((privId) => {
                          const priv = AVAILABLE_PRIVILEGES.find(p => p.id === privId);
                          return priv ? (
                            <Badge key={privId} variant="outline" className="text-xs">
                              {priv.name}
                            </Badge>
                          ) : null;
                        })}
                        {role.privileges.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{role.privileges.length - 5} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="assignments" className="mt-6">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Assign Role to User</CardTitle>
                <CardDescription>
                  Select a user and assign them a role
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">User</label>
                    <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a user" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockUsers.map((user) => (
                          <SelectItem key={user.id} value={user.email}>
                            {user.name} ({user.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">Role</label>
                    <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAssignRole}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Assign Role
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current User Assignments</CardTitle>
                <CardDescription>
                  View and manage role assignments for all users
                </CardDescription>
                <div className="mt-4">
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Organization</TableHead>
                      <TableHead>Assigned Roles</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => {
                      const assignedRoles = getUserRoles(user.email);
                      return (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.organization}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {assignedRoles.length > 0 ? (
                                assignedRoles.map((role) => (
                                  <Badge key={role.id} variant="secondary" className="gap-1">
                                    {role.name}
                                    <button
                                      onClick={() => handleRemoveRole(user.email, role.id)}
                                      className="ml-1 hover:text-destructive"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-muted-foreground text-sm">No roles assigned</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedUserId(user.email);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                            >
                              <UserPlus className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Sheet open={!!editingRole} onOpenChange={(open) => !open && setEditingRole(null)}>
          <SheetContent className="w-full sm:w-[640px] sm:max-w-[640px] overflow-y-auto">
            <SheetHeader className="pb-2">
              <SheetTitle>Edit role</SheetTitle>
              <SheetDescription>
                Update role details and adjust privileges.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-2">
              <RoleForm
                formData={formData}
                setFormData={setFormData}
                isEditing={true}
                privilegesByCategory={privilegesByCategory}
              />
            </div>
            <SheetFooter className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setEditingRole(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdate}>Update role</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </main>
    </div>
  );
};

export default RoleManagement;
