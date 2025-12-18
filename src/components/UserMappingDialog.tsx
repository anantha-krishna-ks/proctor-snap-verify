import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Users, UserPlus, X } from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserGroup {
  id: string;
  name: string;
  description: string;
  userCount: number;
  users: User[];
}

// Mock data
const mockUsers: User[] = [
  { id: "u1", name: "John Smith", email: "john.smith@example.com" },
  { id: "u2", name: "Sarah Johnson", email: "sarah.j@example.com" },
  { id: "u3", name: "Michael Brown", email: "m.brown@example.com" },
  { id: "u4", name: "Emily Davis", email: "emily.d@example.com" },
  { id: "u5", name: "James Wilson", email: "j.wilson@example.com" },
  { id: "u6", name: "Lisa Anderson", email: "l.anderson@example.com" },
  { id: "u7", name: "Robert Taylor", email: "r.taylor@example.com" },
  { id: "u8", name: "Jennifer Martinez", email: "j.martinez@example.com" },
];

const mockGroups: UserGroup[] = [
  {
    id: "g1",
    name: "Batch 2024 - Section A",
    description: "First year students from Section A",
    userCount: 25,
    users: mockUsers.slice(0, 4),
  },
  {
    id: "g2",
    name: "Batch 2024 - Section B",
    description: "First year students from Section B",
    userCount: 30,
    users: mockUsers.slice(2, 6),
  },
  {
    id: "g3",
    name: "Advanced Learners",
    description: "Students in advanced learning program",
    userCount: 15,
    users: mockUsers.slice(4, 8),
  },
  {
    id: "g4",
    name: "Remedial Group",
    description: "Students requiring additional support",
    userCount: 10,
    users: mockUsers.slice(0, 3),
  },
];

interface UserMappingDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  scheduleName: string;
}

export const UserMappingDialog = ({
  open,
  onClose,
  onConfirm,
  scheduleName,
}: UserMappingDialogProps) => {
  const [activeTab, setActiveTab] = useState<"users" | "groups">("users");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroups = mockGroups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleToggleGroup = (groupId: string) => {
    setSelectedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleSelectAllUsers = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((u) => u.id));
    }
  };

  const handleConfirm = () => {
    const userCount = selectedUsers.length;
    const groupCount = selectedGroups.length;
    const groupUsers = selectedGroups.reduce((acc, groupId) => {
      const group = mockGroups.find((g) => g.id === groupId);
      return acc + (group?.userCount || 0);
    }, 0);

    if (userCount === 0 && groupCount === 0) {
      toast.error("Please select at least one user or group");
      return;
    }

    const totalMapped = userCount + groupUsers;
    toast.success(`Successfully mapped ${totalMapped} users to the schedule`);
    onConfirm();
  };

  const handleSkip = () => {
    toast.info("You can map users later from the schedule details");
    onClose();
  };

  const getTotalSelectedCount = () => {
    const directUsers = selectedUsers.length;
    const groupUsers = selectedGroups.reduce((acc, groupId) => {
      const group = mockGroups.find((g) => g.id === groupId);
      return acc + (group?.userCount || 0);
    }, 0);
    return directUsers + groupUsers;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Map Users to Schedule
          </DialogTitle>
          <DialogDescription>
            Add users or groups to "{scheduleName}"
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "users" | "groups")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Individual Users
              {selectedUsers.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {selectedUsers.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Groups
              {selectedGroups.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {selectedGroups.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${activeTab === "users" ? "users" : "groups"}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <TabsContent value="users" className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm text-muted-foreground">
                {filteredUsers.length} users available
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectAllUsers}
              >
                {selectedUsers.length === filteredUsers.length ? "Deselect All" : "Select All"}
              </Button>
            </div>
            <ScrollArea className="h-[300px] border rounded-md">
              <div className="p-2 space-y-1">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors ${
                      selectedUsers.includes(user.id)
                        ? "bg-primary/10 border border-primary/20"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => handleToggleUser(user.id)}
                  >
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={() => handleToggleUser(user.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                ))}
                {filteredUsers.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No users found
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="groups" className="mt-4">
            <div className="mb-3">
              <Label className="text-sm text-muted-foreground">
                {filteredGroups.length} groups available
              </Label>
            </div>
            <ScrollArea className="h-[300px] border rounded-md">
              <div className="p-2 space-y-2">
                {filteredGroups.map((group) => (
                  <div
                    key={group.id}
                    className={`flex items-start gap-3 p-3 rounded-md cursor-pointer transition-colors ${
                      selectedGroups.includes(group.id)
                        ? "bg-primary/10 border border-primary/20"
                        : "hover:bg-muted border border-transparent"
                    }`}
                    onClick={() => handleToggleGroup(group.id)}
                  >
                    <Checkbox
                      checked={selectedGroups.includes(group.id)}
                      onCheckedChange={() => handleToggleGroup(group.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{group.name}</p>
                        <Badge variant="outline" className="text-xs">
                          {group.userCount} users
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {group.description}
                      </p>
                    </div>
                  </div>
                ))}
                {filteredGroups.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No groups found
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {/* Selection Summary */}
        {(selectedUsers.length > 0 || selectedGroups.length > 0) && (
          <div className="bg-muted/50 rounded-md p-3 mt-2">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="font-medium">{getTotalSelectedCount()}</span>
                <span className="text-muted-foreground"> users will be mapped</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedUsers([]);
                  setSelectedGroups([]);
                }}
              >
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            </div>
            {selectedGroups.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedGroups.map((groupId) => {
                  const group = mockGroups.find((g) => g.id === groupId);
                  return (
                    <Badge key={groupId} variant="secondary" className="text-xs">
                      {group?.name}
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleSkip}>
            Skip for Now
          </Button>
          <Button onClick={handleConfirm}>
            <Users className="h-4 w-4 mr-2" />
            Map Selected Users
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
