import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "lucide-react";

interface IdentityVerificationModalProps {
  profileImageUrl: string;
  testImageUrl: string;
  candidateName: string;
  onClose: () => void;
}

export const IdentityVerificationModal = ({
  profileImageUrl,
  testImageUrl,
  candidateName,
  onClose,
}: IdentityVerificationModalProps) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Identity Verification - {candidateName}
          </DialogTitle>
          <DialogDescription>
            Compare the profile picture with the test-time captured image to verify identity
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="grid md:grid-cols-2 gap-6 py-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-center">Profile Picture</h4>
              <div className="relative aspect-square bg-muted rounded-lg overflow-hidden border-2 border-border">
                <img
                  src={profileImageUrl}
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
                  src={testImageUrl}
                  alt="Test capture"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Captured during test
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
