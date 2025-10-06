import { Button } from "@/components/ui/button";
import { Edit, Trash2, ChevronRight } from "lucide-react";
import { type SocialLink } from "@shared/schema";
import { getPlatformIcon } from "@/lib/platform-icons";

interface LinkCardProps {
  link: SocialLink;
  isEditMode: boolean;
  onDelete: () => void;
  onEdit?: () => void;
  onClick: (e: React.MouseEvent) => void;
}

export default function LinkCard({ link, isEditMode, onDelete, onEdit, onClick }: LinkCardProps) {
  const { icon, bgColor } = getPlatformIcon(link.platform);

  return (
    <div 
      className="link-card bg-white rounded-card shadow-md p-5 cursor-pointer relative group"
      data-testid={`card-link-${link.id}`}
    >
      {/* Edit Actions (Edit Mode) */}
      {isEditMode && (
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {onEdit && (
            <Button
              onClick={onEdit}
              className="bg-primary hover:bg-primary-light text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md p-0"
              data-testid={`button-edit-${link.id}`}
            >
              <Edit className="w-3 h-3" />
            </Button>
          )}
          <Button
            onClick={onDelete}
            className="bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md p-0"
            data-testid={`button-delete-${link.id}`}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      )}

      <div 
        className="flex items-center gap-4"
        onClick={onClick}
        data-testid={`link-${link.id}`}
      >
        <div className={`social-icon w-14 h-14 rounded-full ${bgColor} flex items-center justify-center text-white text-2xl shadow-md flex-shrink-0`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-sans font-semibold text-charcoal" data-testid={`text-title-${link.id}`}>
            {link.title}
          </h3>
          {link.description && (
            <p className="text-sm text-gray-500" data-testid={`text-description-${link.id}`}>
              {link.description}
            </p>
          )}
        </div>
        <ChevronRight className="text-gray-400 text-xl" />
      </div>
    </div>
  );
}
