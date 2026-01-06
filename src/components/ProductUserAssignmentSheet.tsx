import { useState, useEffect } from "react";
import { Save, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { mockUsers } from "@/data/adminMockData";
import { toast } from "@/hooks/use-toast";
import type { Project } from "@/data/projectMockData";
import { motion, AnimatePresence } from "framer-motion";

interface ProductUserAssignmentSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Project | null;
  onAssignmentUpdate?: (productId: string, userIds: string[]) => void;
}

const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

const ProductUserAssignmentSheet = ({ 
  open, 
  onOpenChange, 
  product, 
  onAssignmentUpdate 
}: ProductUserAssignmentSheetProps) => {
  const [assignedUsers, setAssignedUsers] = useState<string[]>([]);
  const [userSearch, setUserSearch] = useState("");

  useEffect(() => {
    if (product) {
      // Mock: assign first 3 users as already assigned
      setAssignedUsers(mockUsers.slice(0, 3).map(u => u.id));
    }
  }, [product]);

  const handleUserToggle = (userId: string) => {
    setAssignedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const assignedUsersList = filteredUsers.filter(u => assignedUsers.includes(u.id));
  const unassignedUsersList = filteredUsers.filter(u => !assignedUsers.includes(u.id));

  const handleSubmit = () => {
    if (product) {
      onAssignmentUpdate?.(product.id, assignedUsers);
      toast({
        title: "Users Updated",
        description: `User assignments for "${product.name}" have been updated.`,
      });
    }
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl flex flex-col p-0">
        <SheetHeader className="px-6 pt-6">
          <SheetTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Assign Users to Product
          </SheetTitle>
          <SheetDescription>
            {product ? `Manage user assignments for "${product.name}"` : "Select users to assign to this product."}
          </SheetDescription>
        </SheetHeader>

        <div className="px-6 py-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name or email..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <ScrollArea className="flex-1 px-6">
          <div className="space-y-6 py-4">
            {/* Assigned Users Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium flex items-center gap-2">
                  Assigned Users
                  <Badge variant="secondary" className="text-xs">
                    {assignedUsersList.length}
                  </Badge>
                </Label>
              </div>
              <div className="border border-border rounded-lg overflow-hidden">
                <AnimatePresence mode="popLayout">
                  {assignedUsersList.length > 0 ? (
                    assignedUsersList.map((user) => (
                      <motion.div
                        key={user.id}
                        layout
                        variants={listItemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-3 p-3 hover:bg-muted/50 border-b border-border last:border-b-0 bg-primary/5"
                      >
                        <Checkbox
                          id={`assigned-${user.id}`}
                          checked={true}
                          onCheckedChange={() => handleUserToggle(user.id)}
                        />
                        <label
                          htmlFor={`assigned-${user.id}`}
                          className="flex-1 cursor-pointer"
                        >
                          <div className="font-medium text-sm">{user.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {user.email} • {user.role}
                          </div>
                        </label>
                      </motion.div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No users assigned yet
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Available Users Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium flex items-center gap-2">
                  Available Users
                  <Badge variant="outline" className="text-xs">
                    {unassignedUsersList.length}
                  </Badge>
                </Label>
              </div>
              <div className="border border-border rounded-lg overflow-hidden">
                <AnimatePresence mode="popLayout">
                  {unassignedUsersList.length > 0 ? (
                    unassignedUsersList.map((user) => (
                      <motion.div
                        key={user.id}
                        layout
                        variants={listItemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-3 p-3 hover:bg-muted/50 border-b border-border last:border-b-0"
                      >
                        <Checkbox
                          id={`available-${user.id}`}
                          checked={false}
                          onCheckedChange={() => handleUserToggle(user.id)}
                        />
                        <label
                          htmlFor={`available-${user.id}`}
                          className="flex-1 cursor-pointer"
                        >
                          <div className="font-medium text-sm">{user.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {user.email} • {user.role}
                          </div>
                        </label>
                      </motion.div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      All users are assigned
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </ScrollArea>

        <SheetFooter className="px-6 py-4 border-t border-border">
          <div className="flex gap-3 w-full">
            <Button variant="outline" className="flex-1" onClick={handleCancel}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSubmit}>
              <Save className="h-4 w-4 mr-2" />
              Save Assignments
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ProductUserAssignmentSheet;
