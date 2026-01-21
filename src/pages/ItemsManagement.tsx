import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, Plus, MoreVertical, Edit, Eye, Copy, Trash2, 
  Filter, ChevronDown, ChevronRight, Tag, Sparkles,
  ChevronLeft, ChevronLeftIcon, ChevronRightIcon, ChevronsLeft, ChevronsRight
} from "lucide-react";
import { mockProjects } from "@/data/projectMockData";
import { ItemRepositorySidebar } from "@/components/ItemRepositorySidebar";
import { GenerateItemsDialog, GeneratedItem } from "@/components/GenerateItemsDialog";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ItemOption {
  text: string;
  isCorrect: boolean;
}

interface Item {
  id: string;
  code: string;
  question: string;
  type: string;
  score: number;
  status: "used" | "unused";
  language: string;
  version: string;
  passageCode?: string;
  options: ItemOption[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

const mockRepositories = [
  {
    id: "repo-1",
    name: "Demo_Items",
    itemCount: 30,
    children: [
      { id: "repo-1-1", name: "Leadership Skills", itemCount: 12 },
      { id: "repo-1-2", name: "Management Basics", itemCount: 8 },
      { id: "repo-1-3", name: "Communication", itemCount: 10 },
    ],
  },
];

const mockItems: Item[] = [
  {
    id: "1",
    code: "Demo001-Item-MBA001-06",
    question: "Which leadership style is most effective in a crisis situation?",
    type: "Multiple Choice",
    score: 1,
    status: "used",
    language: "English",
    version: "V2.0",
    passageCode: "1",
    options: [
      { text: "Democratic", isCorrect: false },
      { text: "Autocratic", isCorrect: true },
      { text: "Laissez-faire", isCorrect: false },
      { text: "Servant Leadership", isCorrect: false },
    ],
    createdAt: "20-01-2026 04:39 PM",
    updatedAt: "21-01-2026 03:44 PM",
    createdBy: "Harshitha C H",
  },
  {
    id: "2",
    code: "Demo001-Item-MBA001-30",
    question: "Which strategy helps overcome resistance to change?",
    type: "Multiple Choice",
    score: 1,
    status: "used",
    language: "English",
    version: "V1.0",
    passageCode: "-",
    options: [
      { text: "Ignoring employee concerns", isCorrect: false },
      { text: "Providing clear communication and involvement", isCorrect: true },
      { text: "Imposing change without explanation", isCorrect: false },
      { text: "Reducing transparency", isCorrect: false },
    ],
    createdAt: "20-01-2026 04:39 PM",
    updatedAt: "",
    createdBy: "Harshitha C H",
  },
  {
    id: "3",
    code: "Demo001-Item-MBA001-15",
    question: "What is the primary purpose of strategic planning?",
    type: "Multiple Choice",
    score: 1,
    status: "unused",
    language: "English",
    version: "V1.0",
    options: [
      { text: "Daily task management", isCorrect: false },
      { text: "Long-term goal setting and resource allocation", isCorrect: true },
      { text: "Employee scheduling", isCorrect: false },
      { text: "Inventory management", isCorrect: false },
    ],
    createdAt: "19-01-2026 10:15 AM",
    updatedAt: "19-01-2026 02:30 PM",
    createdBy: "John Smith",
  },
  {
    id: "4",
    code: "Demo001-Item-MBA001-22",
    question: "Which of the following is a characteristic of transformational leadership?",
    type: "Multiple Choice",
    score: 1,
    status: "used",
    language: "English",
    version: "V1.5",
    options: [
      { text: "Focus on day-to-day operations", isCorrect: false },
      { text: "Inspiring and motivating followers to exceed expectations", isCorrect: true },
      { text: "Strict adherence to rules", isCorrect: false },
      { text: "Minimal employee interaction", isCorrect: false },
    ],
    createdAt: "18-01-2026 09:00 AM",
    updatedAt: "20-01-2026 11:20 AM",
    createdBy: "Sarah Johnson",
  },
];

const ItemsManagement = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("repository");
  const [selectedRepository, setSelectedRepository] = useState<string | null>("repo-1-1");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(["1", "2"]));
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [items, setItems] = useState<Item[]>(mockItems);

  const project = mockProjects.find((p) => p.id === productId);
  const userRole = localStorage.getItem("userRole") || "author";

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredItems.length / rowsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const toggleItemExpand = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const toggleItemSelect = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(new Set(paginatedItems.map((item) => item.id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleGenerateItems = (generatedItems: GeneratedItem[]) => {
    const newItems: Item[] = generatedItems.map((item) => ({
      id: item.id,
      code: item.code,
      question: item.question,
      type: item.type,
      score: item.score,
      status: "unused" as const,
      language: "English",
      version: "V1.0",
      options: item.options,
      createdAt: new Date().toLocaleString(),
      updatedAt: "",
      createdBy: "AI Generated",
    }));
    setItems([...newItems, ...items]);
  };

  const handleBack = () => {
    navigate("/admin/products");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader searchQuery="" onSearchChange={() => {}} />

      <div className="flex flex-1">
        <AdminSidebar />

        <div className="flex-1 flex flex-col">
          {/* Page Header */}
          <div className="border-b border-border bg-card px-6 py-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <span>Manage Items</span>
            </div>
            <h1 className="text-xl font-semibold text-foreground">Manage Items</h1>
          </div>

          {/* Content Area */}
          <div className="flex flex-1 overflow-hidden">
            {/* Repository Sidebar */}
            <ItemRepositorySidebar
              repositories={mockRepositories}
              selectedRepository={selectedRepository}
              onSelectRepository={setSelectedRepository}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Toolbar */}
              <div className="border-b border-border bg-card px-4 py-3">
                <div className="flex items-center gap-3">
                  {/* Tabs */}
                  <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                    <TabsList className="bg-muted">
                      <TabsTrigger value="repository" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        Repository
                      </TabsTrigger>
                      <TabsTrigger value="topic">Leadership Skills</TabsTrigger>
                    </TabsList>
                  </Tabs>

                  <div className="flex-1" />

                  {/* Search */}
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by item code, item text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>

                  {/* Create New Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="gap-2 bg-primary hover:bg-primary/90">
                        Create New
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Manually
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setIsGenerateDialogOpen(true)}>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate with AI
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Actions */}
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>

                  {/* Toggle */}
                  <Switch defaultChecked />
                </div>
              </div>

              {/* Table */}
              <div className="flex-1 overflow-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-card z-10">
                    <TableRow className="border-b border-border">
                      <TableHead className="w-12">
                        <Checkbox
                          checked={
                            paginatedItems.length > 0 &&
                            paginatedItems.every((item) => selectedItems.has(item.id))
                          }
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead className="w-12"></TableHead>
                      <TableHead className="font-semibold text-foreground">ITEM CODE</TableHead>
                      <TableHead className="font-semibold text-foreground">ITEM TYPE</TableHead>
                      <TableHead className="font-semibold text-foreground text-center">SCORE</TableHead>
                      <TableHead className="font-semibold text-foreground">LAST MODIFIED</TableHead>
                      <TableHead className="font-semibold text-foreground">CREATED DATE</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedItems.map((item) => (
                      <>
                        {/* Main Row */}
                        <TableRow
                          key={item.id}
                          className={cn(
                            "border-b border-border cursor-pointer hover:bg-muted/50",
                            expandedItems.has(item.id) && "bg-muted/30"
                          )}
                        >
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={selectedItems.has(item.id)}
                              onCheckedChange={() => toggleItemSelect(item.id)}
                            />
                          </TableCell>
                          <TableCell onClick={() => toggleItemExpand(item.id)}>
                            {expandedItems.has(item.id) ? (
                              <ChevronDown className="h-4 w-4 text-primary" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-primary" />
                            )}
                          </TableCell>
                          <TableCell className="font-medium" onClick={() => toggleItemExpand(item.id)}>
                            {item.code}
                          </TableCell>
                          <TableCell onClick={() => toggleItemExpand(item.id)}>{item.type}</TableCell>
                          <TableCell className="text-center" onClick={() => toggleItemExpand(item.id)}>
                            {item.score}
                          </TableCell>
                          <TableCell className="text-muted-foreground" onClick={() => toggleItemExpand(item.id)}>
                            {item.updatedAt || "-"}
                          </TableCell>
                          <TableCell className="text-muted-foreground" onClick={() => toggleItemExpand(item.id)}>
                            {item.createdAt}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Preview
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>

                        {/* Expanded Content */}
                        {expandedItems.has(item.id) && (
                          <TableRow className="bg-muted/20">
                            <TableCell colSpan={8} className="p-0">
                              <div className="px-12 py-4 border-b border-border">
                                {/* Question */}
                                <p className="text-sm font-medium mb-4">{item.question}</p>

                                {/* Options */}
                                <RadioGroup className="space-y-2">
                                  {item.options.map((option, idx) => (
                                    <div
                                      key={idx}
                                      className={cn(
                                        "flex items-center gap-3 text-sm",
                                        option.isCorrect && "text-primary font-medium"
                                      )}
                                    >
                                      <RadioGroupItem
                                        value={option.text}
                                        checked={option.isCorrect}
                                        className={cn(
                                          option.isCorrect && "border-primary text-primary"
                                        )}
                                      />
                                      <span>{option.text}</span>
                                    </div>
                                  ))}
                                </RadioGroup>

                                {/* Metadata Footer */}
                                <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground border-t border-border pt-3">
                                  <span>Passage Code: {item.passageCode || "-"}</span>
                                  <div className="flex items-center gap-1">
                                    <Tag className="h-3 w-3 text-destructive" />
                                    <span className="text-destructive">Item {item.status === "used" ? "Used" : "Unused"}</span>
                                  </div>
                                  <span>Available Language: {item.language}</span>
                                  <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">
                                    {item.version}
                                  </Badge>
                                  <span>
                                    {item.updatedAt ? `Modified ${item.updatedAt}` : `Created ${item.createdAt}`}, by {item.createdBy}
                                  </span>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Footer */}
              <div className="border-t border-border bg-card px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>
                    {(currentPage - 1) * rowsPerPage + 1}-
                    {Math.min(currentPage * rowsPerPage, filteredItems.length)} of{" "}
                    {filteredItems.length}
                  </span>
                  <span className="mx-2">Rows per page:</span>
                  <Select
                    value={rowsPerPage.toString()}
                    onValueChange={(val) => {
                      setRowsPerPage(parseInt(val));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-16 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(1)}
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </Button>
                  <span className="text-sm mx-2">
                    {currentPage}/{totalPages || 1}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-border px-4 py-2 text-center text-xs text-muted-foreground">
                Powered by Saras | Copyright © 2025 of Excelsoft Technologies Ltd{" "}
                <a href="https://www.excelsoftcorp.com" className="text-primary hover:underline">
                  https://www.excelsoftcorp.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Generation Dialog */}
      <GenerateItemsDialog
        open={isGenerateDialogOpen}
        onOpenChange={setIsGenerateDialogOpen}
        onGenerate={handleGenerateItems}
      />
    </div>
  );
};

export default ItemsManagement;
