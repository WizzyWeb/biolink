import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { type SocialLink } from "@shared/schema";
import LinkCard from "./link-card";
import { useToast } from "@/hooks/use-toast";

interface SocialLinksListProps {
  links: SocialLink[];
  isEditMode: boolean;
  profileId: string;
}

export default function SocialLinksList({ links, isEditMode, profileId }: SocialLinksListProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteLinkMutation = useMutation({
    mutationFn: async (linkId: string) => {
      await apiRequest("DELETE", `/api/links/${linkId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      toast({
        title: "Link deleted",
        description: "The link has been successfully removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete the link. Please try again.",
        variant: "destructive",
      });
    },
  });

  const reorderLinksMutation = useMutation({
    mutationFn: async (linkIds: string[]) => {
      await apiRequest("PATCH", "/api/links/reorder", { linkIds });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
    },
  });

  const handleDeleteLink = async (linkId: string) => {
    if (window.confirm("Are you sure you want to delete this link?")) {
      deleteLinkMutation.mutate(linkId);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newLinks = [...links];
    const draggedLink = newLinks[draggedIndex];
    newLinks.splice(draggedIndex, 1);
    newLinks.splice(dropIndex, 0, draggedLink);

    const linkIds = newLinks.map(link => link.id);
    reorderLinksMutation.mutate(linkIds);
  };

  const handleLinkClick = async (link: SocialLink, e: React.MouseEvent<HTMLDivElement>) => {
    if (isEditMode) {
      e.preventDefault();
      return;
    }

    // Track click
    try {
      const response = await apiRequest("POST", `/api/links/${link.id}/click`);
      const data = await response.json();
      window.open(data.url, "_blank");
    } catch (error) {
      // If tracking fails, still open the link
      window.open(link.url, "_blank");
    }
  };

  return (
    <div className="space-y-4" data-testid="social-links-list">
      {links.map((link, index) => (
        <div
          key={link.id}
          draggable={isEditMode}
          onDragStart={(e) => handleDragStart(e, index)}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, index)}
          className={`${isEditMode ? "draggable" : ""} ${
            draggedIndex === index ? "dragging" : ""
          }`}
        >
          <LinkCard
            link={link}
            isEditMode={isEditMode}
            onDelete={() => handleDeleteLink(link.id)}
            onClick={(e) => handleLinkClick(link, e)}
          />
        </div>
      ))}
    </div>
  );
}
