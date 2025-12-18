import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Users, UserPlus, X, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const listItemVariants = {
  initial: { opacity: 0, x: -20, height: 0 },
  animate: { opacity: 1, x: 0, height: "auto" },
  exit: { opacity: 0, x: 20, height: 0 },
};

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

// Mock data - available users to add
const availableUsers: User[] = [
  { id: "u1", name: "John Smith", email: "john.smith@example.com" },
  { id: "u2", name: "Sarah Johnson", email: "sarah.j@example.com" },
  { id: "u3", name: "Michael Brown", email: "m.brown@example.com" },
  { id: "u4", name: "Emily Davis", email: "emily.d@example.com" },
  { id: "u5", name: "James Wilson", email: "j.wilson@example.com" },
  { id: "u6", name: "Lisa Anderson", email: "l.anderson@example.com" },
  { id: "u7", name: "Robert Taylor", email: "r.taylor@example.com" },
  { id: "u8", name: "Jennifer Martinez", email: "j.martinez@example.com" },
  { id: "u9", name: "David Lee", email: "d.lee@example.com" },
  { id: "u10", name: "Amanda White", email: "a.white@example.com" },
];

const availableGroups: UserGroup[] = [
  {
    id: "g1",
    name: "Batch 2024 - Section A",
    description: "First year students from Section A",
    userCount: 25,
    users: availableUsers.slice(0, 4),
  },
  {
    id: "g2",
    name: "Batch 2024 - Section B",
    description: "First year students from Section B",
    userCount: 30,
    users: availableUsers.slice(2, 6),
  },
  {
    id: "g3",
    name: "Advanced Learners",
    description: "Students in advanced learning program",
    userCount: 15,
    users: availableUsers.slice(4, 8),
  },
];

export interface MappedUser {
  id: string;
  name: string;
  email: string;
  addedVia: "direct" | "group";
  groupName?: string;
}

interface ScheduleUserMappingDialogProps {
  open: boolean;
  onClose: () => void;
  scheduleName: string;
  scheduleId: string;
  initialMappedUsers?: MappedUser[];
}

export const ScheduleUserMappingDialog = ({
  open,
  onClose,
  scheduleName,
  scheduleId,
  initialMappedUsers = [],
}: ScheduleUserMappingDialogProps) => {
  const [activeTab, setActiveTab] = useState<"mapped" | "add">("mapped");
  const [searchQuery, setSearchQuery] = useState("");
  const [mappedUsers, setMappedUsers] = useState<MappedUser[]>(initialMappedUsers);
  const [selectedUsersToAdd, setSelectedUsersToAdd] = useState<string[]>([]);
  const [selectedGroupsToAdd, setSelectedGroupsToAdd] = useState<string[]>([]);
  const [addMode, setAddMode] = useState<"users" | "groups">("users");

  // Filter out already mapped users
  const unmappedUsers = availableUsers.filter(
    (u) => !mappedUsers.some((m) => m.id === u.id)
  );

  const filteredMappedUsers = mappedUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUnmappedUsers = unmappedUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroups = availableGroups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemoveUser = (userId: string) => {
    setMappedUsers((prev) => prev.filter((u) => u.id !== userId));
    toast.success("User removed from schedule");
  };

  const handleRemoveMultiple = (userIds: string[]) => {
    setMappedUsers((prev) => prev.filter((u) => !userIds.includes(u.id)));
    toast.success(`${userIds.length} users removed from schedule`);
  };

  const handleToggleUserToAdd = (userId: string) => {
    setSelectedUsersToAdd((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleToggleGroupToAdd = (groupId: string) => {
    setSelectedGroupsToAdd((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleAddSelected = () => {
    const newUsers: MappedUser[] = [];

    // Add individual users
    selectedUsersToAdd.forEach((userId) => {
      const user = availableUsers.find((u) => u.id === userId);
      if (user && !mappedUsers.some((m) => m.id === user.id)) {
        newUsers.push({
          id: user.id,
          name: user.name,
          email: user.email,
          addedVia: "direct",
        });
      }
    });

    // Add users from groups
    selectedGroupsToAdd.forEach((groupId) => {
      const group = availableGroups.find((g) => g.id === groupId);
      if (group) {
        group.users.forEach((user) => {
          if (
            !mappedUsers.some((m) => m.id === user.id) &&
            !newUsers.some((n) => n.id === user.id)
          ) {
            newUsers.push({
              id: user.id,
              name: user.name,
              email: user.email,
              addedVia: "group",
              groupName: group.name,
            });
          }
        });
      }
    });

    if (newUsers.length === 0) {
      toast.error("No new users to add");
      return;
    }

    setMappedUsers((prev) => [...prev, ...newUsers]);
    setSelectedUsersToAdd([]);
    setSelectedGroupsToAdd([]);
    setActiveTab("mapped");
    toast.success(`${newUsers.length} users added to schedule`);
  };

  const handleSelectAllUnmapped = () => {
    if (selectedUsersToAdd.length === filteredUnmappedUsers.length) {
      setSelectedUsersToAdd([]);
    } else {
      setSelectedUsersToAdd(filteredUnmappedUsers.map((u) => u.id));
    }
  };

  const [selectedMappedUsers, setSelectedMappedUsers] = useState<string[]>([]);

  const handleToggleMappedUser = (userId: string) => {
    setSelectedMappedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAllMapped = () => {
    if (selectedMappedUsers.length === filteredMappedUsers.length) {
      setSelectedMappedUsers([]);
    } else {
      setSelectedMappedUsers(filteredMappedUsers.map((u) => u.id));
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Manage Users - {scheduleName}
          </SheetTitle>
          <SheetDescription>
            View, add or remove users mapped to this schedule
          </SheetDescription>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "mapped" | "add")} className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mapped" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Mapped Users
              <Badge variant="secondary" className="ml-1">
                {mappedUsers.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="add" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Add Users
            </TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${activeTab === "mapped" ? "mapped users" : "users to add"}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <TabsContent value="mapped" className="mt-4">
            {mappedUsers.length === 0 ? (
              <div className="text-center py-12 border rounded-md bg-muted/30">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No users mapped to this schedule</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => setActiveTab("add")}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Users
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm text-muted-foreground">
                    {filteredMappedUsers.length} users mapped
                  </Label>
                  <div className="flex items-center gap-2">
                    {selectedMappedUsers.length > 0 && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          handleRemoveMultiple(selectedMappedUsers);
                          setSelectedMappedUsers([]);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove ({selectedMappedUsers.length})
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={handleSelectAllMapped}>
                      {selectedMappedUsers.length === filteredMappedUsers.length
                        ? "Deselect All"
                        : "Select All"}
                    </Button>
                  </div>
                </div>
                <ScrollArea className="h-[300px] border rounded-md">
                  <div className="p-2 space-y-1">
                    <AnimatePresence mode="popLayout">
                      {filteredMappedUsers.map((user) => (
                        <motion.div
                          key={user.id}
                          variants={listItemVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          layout
                          className={`flex items-center gap-3 p-3 rounded-md transition-colors ${
                            selectedMappedUsers.includes(user.id)
                              ? "bg-primary/10 border border-primary/20"
                              : "hover:bg-muted"
                          }`}
                        >
                          <Checkbox
                            checked={selectedMappedUsers.includes(user.id)}
                            onCheckedChange={() => handleToggleMappedUser(user.id)}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{user.name}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {user.email}
                            </p>
                          </div>
                          {user.addedVia === "group" && user.groupName && (
                            <Badge variant="outline" className="text-xs">
                              {user.groupName}
                            </Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleRemoveUser(user.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {filteredMappedUsers.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No users found matching your search
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </>
            )}
          </TabsContent>

          <TabsContent value="add" className="mt-4">
            <Tabs value={addMode} onValueChange={(v) => setAddMode(v as "users" | "groups")}>
              <TabsList className="mb-4">
                <TabsTrigger value="users">Individual Users</TabsTrigger>
                <TabsTrigger value="groups">Groups</TabsTrigger>
              </TabsList>

              <TabsContent value="users">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm text-muted-foreground">
                    {filteredUnmappedUsers.length} users available
                  </Label>
                  <Button variant="ghost" size="sm" onClick={handleSelectAllUnmapped}>
                    {selectedUsersToAdd.length === filteredUnmappedUsers.length
                      ? "Deselect All"
                      : "Select All"}
                  </Button>
                </div>
                <ScrollArea className="h-[250px] border rounded-md">
                  <div className="p-2 space-y-1">
                    <AnimatePresence mode="popLayout">
                      {filteredUnmappedUsers.map((user) => (
                        <motion.div
                          key={user.id}
                          variants={listItemVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          layout
                          className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors ${
                            selectedUsersToAdd.includes(user.id)
                              ? "bg-primary/10 border border-primary/20"
                              : "hover:bg-muted"
                          }`}
                          onClick={() => handleToggleUserToAdd(user.id)}
                        >
                          <Checkbox
                            checked={selectedUsersToAdd.includes(user.id)}
                            onCheckedChange={() => handleToggleUserToAdd(user.id)}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{user.name}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {user.email}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {filteredUnmappedUsers.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        All available users are already mapped
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="groups">
                <div className="mb-3">
                  <Label className="text-sm text-muted-foreground">
                    {filteredGroups.length} groups available
                  </Label>
                </div>
                <ScrollArea className="h-[250px] border rounded-md">
                  <div className="p-2 space-y-2">
                    <AnimatePresence mode="popLayout">
                      {filteredGroups.map((group) => (
                        <motion.div
                          key={group.id}
                          variants={listItemVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          layout
                          className={`flex items-start gap-3 p-3 rounded-md cursor-pointer transition-colors ${
                            selectedGroupsToAdd.includes(group.id)
                              ? "bg-primary/10 border border-primary/20"
                              : "hover:bg-muted border border-transparent"
                          }`}
                          onClick={() => handleToggleGroupToAdd(group.id)}
                        >
                          <Checkbox
                            checked={selectedGroupsToAdd.includes(group.id)}
                            onCheckedChange={() => handleToggleGroupToAdd(group.id)}
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
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {filteredGroups.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No groups found
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>

            {/* Selection Summary for Add Tab */}
            {(selectedUsersToAdd.length > 0 || selectedGroupsToAdd.length > 0) && (
              <div className="bg-muted/50 rounded-md p-3 mt-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="font-medium">
                      {selectedUsersToAdd.length + selectedGroupsToAdd.length}
                    </span>
                    <span className="text-muted-foreground"> items selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedUsersToAdd([]);
                        setSelectedGroupsToAdd([]);
                      }}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Clear
                    </Button>
                    <Button size="sm" onClick={handleAddSelected}>
                      <UserPlus className="h-4 w-4 mr-1" />
                      Add Selected
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <SheetFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
