//src/features/home/components/home-settings-dialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { AppearanceSection } from "@/features/settings/components/appearance-section";

interface HomeSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HomeSettingsDialog({
  isOpen,
  onClose,
}: HomeSettingsDialogProps): React.JSX.Element {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl w-[95vw]">
        <DialogHeader className="space-y-0 pb-0">
          <DialogTitle className="text-2xl font-bold tracking-tight">
            App Settings
          </DialogTitle>
          <DialogDescription className="text-[13px] text-muted-foreground">
            Customize your experience. These visual preferences are saved
            globally on this device.
          </DialogDescription>
        </DialogHeader>

        <div className="pb-0 pt-0">
          <AppearanceSection />
        </div>
      </DialogContent>
    </Dialog>
  );
}
