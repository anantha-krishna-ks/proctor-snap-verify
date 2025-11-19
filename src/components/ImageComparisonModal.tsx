import { Candidate } from "@/types/assessment";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, XCircle, User } from "lucide-react";
import { toast } from "sonner";

interface ImageComparisonModalProps {
  candidate: Candidate | null;
  open: boolean;
  onClose: () => void;
  onApprove: (candidateId: string) => void;
  onReject: (candidateId: string) => void;
}

export const ImageComparisonModal = ({
  candidate,
  open,
  onClose,
  onApprove,
  onReject,
}: ImageComparisonModalProps) => {
  if (!candidate) return null;

  const handleApprove = () => {
    onApprove(candidate.id);
    toast.success(`${candidate.name} has been approved`);
    onClose();
  };

  const handleReject = () => {
    onReject(candidate.id);
    toast.error(`${candidate.name} has been rejected`);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Headshot Verification - {candidate.name}
          </DialogTitle>
          <DialogDescription>
            Compare the profile picture with the test-time captured image to verify identity
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 py-4">
          <div className="space-y-3">
            <h4 className="font-semibold text-center">Profile Picture</h4>
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden border-2 border-border">
              <img
                src={candidate.profileImageUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Registered profile image
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-center">Test-Time Capture</h4>
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden border-2 border-primary">
              <img
                src={candidate.testImageUrl}
                alt="Test capture"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Captured on {new Date(candidate.submittedAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg space-y-2">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Email:</span>
              <span className="ml-2 font-medium">{candidate.email}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Submitted:</span>
              <span className="ml-2 font-medium">
                {new Date(candidate.submittedAt).toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleReject}>
            <XCircle className="w-4 h-4 mr-2" />
            Reject
          </Button>
          <Button onClick={handleApprove}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
