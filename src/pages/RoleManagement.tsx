import { useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { usePrivileges } from "@/hooks/usePrivileges";
import { AVAILABLE_PRIVILEGES, Role } from "@/types/privileges";
import { Plus, Pencil, Trash2, Shield } from "lucide-react";
import { toast } from "sonner";

const RoleManagement = () => {
  const { roles, createRole, updateRole, deleteRole } = usePrivileges();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    privileges: [] as string[],
  });

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

  const privilegesByCategory = AVAILABLE_PRIVILEGES.reduce((acc, priv) => {
    if (!acc[priv.category]) acc[priv.category] = [];
    acc[priv.category].push(priv);
    return acc;
  }, {} as Record<string, typeof AVAILABLE_PRIVILEGES>);

  const RoleForm = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Role Name</label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter role name"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter role description"
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Privileges</label>
        <div className="space-y-4 max-h-96 overflow-y-auto border rounded-md p-4">
          {Object.entries(privilegesByCategory).map(([category, privs]) => (
            <div key={category}>
              <h4 className="font-medium text-sm mb-2 capitalize">
                {category.replace(/_/g, " ")}
              </h4>
              <div className="space-y-2 ml-2">
                {privs.map((priv) => (
                  <div key={priv.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={priv.id}
                      checked={formData.privileges.includes(priv.id)}
                      onCheckedChange={() => togglePrivilege(priv.id)}
                    />
                    <label
                      htmlFor={priv.id}
                      className="text-sm cursor-pointer flex-1"
                    >
                      {priv.name}
                      <span className="text-muted-foreground ml-2">
                        - {priv.description}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => {
            setIsCreateOpen(false);
            setEditingRole(null);
            resetForm();
          }}
        >
          Cancel
        </Button>
        <Button onClick={editingRole ? handleUpdate : handleCreate}>
          {editingRole ? "Update" : "Create"} Role
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="container mx-auto px-6 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Role Management</h2>
            <p className="text-muted-foreground">
              Create and manage custom roles with specific privileges
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setEditingRole(null); }}>
                <Plus className="mr-2 h-4 w-4" />
                Create Role
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Role</DialogTitle>
                <DialogDescription>
                  Define a custom role with specific privileges for your organization
                </DialogDescription>
              </DialogHeader>
              <RoleForm />
            </DialogContent>
          </Dialog>
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

        <Dialog open={!!editingRole} onOpenChange={(open) => !open && setEditingRole(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Role</DialogTitle>
              <DialogDescription>
                Update role privileges and information
              </DialogDescription>
            </DialogHeader>
            <RoleForm />
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default RoleManagement;
