import { X } from "lucide-react";
import { Button } from "../ui/Button";
import { Sidebar } from "./Sidebar";

export function MobileSidebar({ isOpen, onClose }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Mobile navigation">
      <div className="absolute inset-0 bg-slate-950/50" onClick={onClose} role="presentation" />
      <div className="relative h-full w-80 max-w-[85vw] bg-white shadow-xl">
        <div className="absolute right-3 top-3 z-10">
          <Button variant="ghost" size="sm" aria-label="Close sidebar" onClick={onClose}>
            <X className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
        <Sidebar onNavigate={onClose} />
      </div>
    </div>
  );
}
