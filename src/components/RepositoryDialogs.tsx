import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Folder, AlertTriangle } from "lucide-react";
import type { Repository } from "@/types/forms";

interface RepositoryDialogsProps {
  repositories: Repository[];
  createDialogOpen: boolean;
  setCreateDialogOpen: (open: boolean) => void;
  renameDialogOpen: boolean;
  setRenameDialogOpen: (open: boolean) => void;
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  selectedRepository: Repository | null;
  onCreateRepository: (name: string) => void;
  onRenameRepository: (id: string, name: string) => void;
  onDeleteRepository: (id: string) => void;
}

export const RepositoryDialogs = ({
  repositories,
  createDialogOpen,
  setCreateDialogOpen,
  renameDialogOpen,
  setRenameDialogOpen,
  deleteDialogOpen,
  setDeleteDialogOpen,
  selectedRepository,
  onCreateRepository,
  onRenameRepository,
  onDeleteRepository,
}: RepositoryDialogsProps) => {
  const [newRepoName, setNewRepoName] = useState("");
  const [renameValue, setRenameValue] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (createDialogOpen) {
      setNewRepoName("");
      setError("");
    }
  }, [createDialogOpen]);

  useEffect(() => {
    if (renameDialogOpen && selectedRepository) {
      setRenameValue(selectedRepository.name);
      setError("");
    }
  }, [renameDialogOpen, selectedRepository]);

  const validateName = (name: string, excludeId?: string): string | null => {
    const trimmed = name.trim();
    if (!trimmed) {
      return "Repository name is required";
    }
    if (trimmed.length < 2) {
      return "Name must be at least 2 characters";
    }
    if (trimmed.length > 50) {
      return "Name must be less than 50 characters";
    }
    const exists = repositories.some(
      (repo) => repo.name.toLowerCase() === trimmed.toLowerCase() && repo.id !== excludeId
    );
    if (exists) {
      return "A repository with this name already exists";
    }
    return null;
  };

  const handleCreate = () => {
    const validationError = validateName(newRepoName);
    if (validationError) {
      setError(validationError);
      return;
    }
    onCreateRepository(newRepoName.trim());
    setCreateDialogOpen(false);
    setNewRepoName("");
    setError("");
  };

  const handleRename = () => {
    if (!selectedRepository) return;
    const validationError = validateName(renameValue, selectedRepository.id);
    if (validationError) {
      setError(validationError);
      return;
    }
    onRenameRepository(selectedRepository.id, renameValue.trim());
    setRenameDialogOpen(false);
    setRenameValue("");
    setError("");
  };

  const handleDelete = () => {
    if (!selectedRepository) return;
    onDeleteRepository(selectedRepository.id);
    setDeleteDialogOpen(false);
  };

  return (
    <>
      {/* Create Repository Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Folder className="h-5 w-5 text-primary" />
              Create New Repository
            </DialogTitle>
            <DialogDescription>
              Create a new repository to organize your forms, configurations, and surveys.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="repo-name">Repository Name</Label>
              <Input
                id="repo-name"
                placeholder="Enter repository name"
                value={newRepoName}
                onChange={(e) => {
                  setNewRepoName(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreate();
                  }
                }}
                className={error ? "border-destructive" : ""}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create Repository</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Repository Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Folder className="h-5 w-5 text-primary" />
              Rename Repository
            </DialogTitle>
            <DialogDescription>
              Enter a new name for "{selectedRepository?.name}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rename-repo">New Name</Label>
              <Input
                id="rename-repo"
                placeholder="Enter new repository name"
                value={renameValue}
                onChange={(e) => {
                  setRenameValue(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleRename();
                  }
                }}
                className={error ? "border-destructive" : ""}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRename}>Rename</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Repository Alert Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete Repository
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Are you sure you want to delete "{selectedRepository?.name}"?
              </p>
              {selectedRepository && selectedRepository.formCount > 0 && (
                <p className="text-destructive font-medium">
                  This repository contains {selectedRepository.formCount} item(s). All items will be permanently deleted.
                </p>
              )}
              <p>This action cannot be undone.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Repository
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
