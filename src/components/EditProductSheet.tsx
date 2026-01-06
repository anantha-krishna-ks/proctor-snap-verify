import { useState, useEffect } from "react";
import { Save, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { toast } from "@/hooks/use-toast";
import type { Project } from "@/data/projectMockData";

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

interface EditProductSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Project | null;
  onProductUpdate?: (productId: string, data: EditProductFormData) => void;
}

export interface EditProductFormData {
  organizationId: string;
  code: string;
  name: string;
  category: string;
  description: string;
  image: File | null;
}

const EditProductSheet = ({ open, onOpenChange, product, onProductUpdate }: EditProductSheetProps) => {
  const [formData, setFormData] = useState<EditProductFormData>({
    organizationId: "",
    code: "",
    name: "",
    category: "",
    description: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setFormData({
        organizationId: "org-1", // Default for mock
        code: product.code,
        name: product.name,
        category: "cat-1", // Default for mock
        description: "",
        image: null,
      });
      setImagePreview(product.image || null);
    }
  }, [product]);

  const handleInputChange = (field: keyof EditProductFormData, value: string) => {
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

  const handleSubmit = () => {
    if (!formData.organizationId || !formData.code || !formData.name || !formData.category) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (product) {
      onProductUpdate?.(product.id, formData);
      toast({
        title: "Product Updated",
        description: `Product "${formData.name}" has been updated successfully.`,
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
          <SheetTitle>Edit Product</SheetTitle>
          <SheetDescription>
            Update the product details.
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
          </div>
        </ScrollArea>

        <SheetFooter className="px-6 py-4 border-t border-border">
          <div className="flex gap-3 w-full">
            <Button variant="outline" className="flex-1" onClick={handleCancel}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSubmit}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default EditProductSheet;
