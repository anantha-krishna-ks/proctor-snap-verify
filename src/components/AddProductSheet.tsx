import { useState } from "react";
import { Plus, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockUsers } from "@/data/adminMockData";
import { toast } from "@/hooks/use-toast";

// Mock organizations
const organizations = [
  { id: "org-1", name: "Acme Corp" },
  { id: "org-2", name: "TechEd Inc" },
  { id: "org-3", name: "EduTech Solutions" },
  { id: "org-4", name: "Learning Systems Ltd" },
];

// Mock categories
const categories = [
  { id: "cat-1", name: "Assessment" },
  { id: "cat-2", name: "Certification" },
  { id: "cat-3", name: "Training" },
  { id: "cat-4", name: "Evaluation" },
];

interface AddProductSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProductCreate?: (product: ProductFormData) => void;
}

export interface ProductFormData {
  organizationId: string;
  code: string;
  name: string;
  category: string;
  description: string;
  image: File | null;
  assignedUsers: string[];
}

const AddProductSheet = ({ open, onOpenChange, onProductCreate }: AddProductSheetProps) => {
  const [formData, setFormData] = useState<ProductFormData>({
    organizationId: "",
    code: "",
    name: "",
    category: "",
    description: "",
    image: null,
    assignedUsers: [],
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [userSearch, setUserSearch] = useState("");

  const handleInputChange = (field: keyof ProductFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  const handleUserToggle = (userId: string) => {
    setFormData((prev) => ({
      ...prev,
      assignedUsers: prev.assignedUsers.includes(userId)
        ? prev.assignedUsers.filter((id) => id !== userId)
        : [...prev.assignedUsers, userId],
    }));
  };

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const handleSubmit = () => {
    if (!formData.organizationId || !formData.code || !formData.name || !formData.category) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    onProductCreate?.(formData);
    toast({
      title: "Product Created",
      description: `Product "${formData.name}" has been created successfully.`,
    });

    // Reset form
    setFormData({
      organizationId: "",
      code: "",
      name: "",
      category: "",
      description: "",
      image: null,
      assignedUsers: [],
    });
    setImagePreview(null);
    setUserSearch("");
    onOpenChange(false);
  };

  const handleCancel = () => {
    setFormData({
      organizationId: "",
      code: "",
      name: "",
      category: "",
      description: "",
      image: null,
      assignedUsers: [],
    });
    setImagePreview(null);
    setUserSearch("");
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl flex flex-col p-0">
        <SheetHeader className="px-6 pt-6">
          <SheetTitle>Add New Product</SheetTitle>
          <SheetDescription>
            Create a new product and assign users to it.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="space-y-5 py-6">
            {/* Organization */}
            <div className="space-y-2">
              <Label htmlFor="organization">
                Organization <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.organizationId}
                onValueChange={(value) => handleInputChange("organizationId", value)}
              >
                <SelectTrigger id="organization">
                  <SelectValue placeholder="Select organization" />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Code */}
            <div className="space-y-2">
              <Label htmlFor="code">
                Code <span className="text-destructive">*</span>
              </Label>
              <Input
                id="code"
                placeholder="Enter product code (e.g., PRD-001)"
                value={formData.code}
                onChange={(e) => handleInputChange("code", e.target.value)}
              />
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Enter product name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter product description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Product Image</Label>
              {imagePreview ? (
                <div className="relative w-full h-40 rounded-lg border border-border overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="w-full h-full object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">
                    Click to upload image
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>

            {/* User Assignment */}
            <div className="space-y-3">
              <Label>Assign Users</Label>
              <Input
                placeholder="Search users..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
              <div className="border border-border rounded-lg max-h-48 overflow-y-auto">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-3 p-3 hover:bg-muted/50 border-b border-border last:border-b-0"
                    >
                      <Checkbox
                        id={`user-${user.id}`}
                        checked={formData.assignedUsers.includes(user.id)}
                        onCheckedChange={() => handleUserToggle(user.id)}
                      />
                      <label
                        htmlFor={`user-${user.id}`}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="font-medium text-sm">{user.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {user.email} • {user.role}
                        </div>
                      </label>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No users found
                  </div>
                )}
              </div>
              {formData.assignedUsers.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {formData.assignedUsers.length} user(s) selected
                </p>
              )}
            </div>
          </div>
        </ScrollArea>

        <SheetFooter className="px-6 py-4 border-t border-border">
          <div className="flex gap-3 w-full">
            <Button variant="outline" className="flex-1" onClick={handleCancel}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSubmit}>
              <Plus className="h-4 w-4 mr-2" />
              Create Product
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default AddProductSheet;
