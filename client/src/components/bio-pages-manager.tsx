import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Star, ExternalLink, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type Profile } from "@shared/schema";
import { Link } from "wouter";

interface BioPagesManagerProps {
  userId: string;
}

interface CreateBioPageData {
  pageName: string;
  displayName: string;
  bio: string;
  profileImageUrl?: string;
}

/**
 * Manage and render a UI for listing, creating, editing, deleting, and setting a default bio page for a specific user.
 *
 * @param userId - The user identifier used to fetch and manage that user's bio pages.
 * @returns The React element that provides the bio pages management interface.
 */
export default function BioPagesManager({ userId }: BioPagesManagerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<Profile | null>(null);
  const [createFormData, setCreateFormData] = useState<CreateBioPageData>({
    pageName: "",
    displayName: "",
    bio: "",
    profileImageUrl: "",
  });
  const [editFormData, setEditFormData] = useState<CreateBioPageData>({
    pageName: "",
    displayName: "",
    bio: "",
    profileImageUrl: "",
  });

  // Fetch all bio pages for the user
  const { data: bioPages = [], isLoading } = useQuery<Profile[]>({
    queryKey: ["/api/bio-pages"],
    enabled: !!userId,
  });

  // Create bio page mutation
  const createPageMutation = useMutation({
    mutationFn: async (data: CreateBioPageData) => {
      const response = await apiRequest("POST", "/api/bio-pages", data);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create bio page");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bio-pages"] });
      setIsCreateModalOpen(false);
      setCreateFormData({ pageName: "", displayName: "", bio: "", profileImageUrl: "" });
      toast({
        title: "Success",
        description: "Bio page created successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update bio page mutation
  const updatePageMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateBioPageData> }) => {
      const response = await apiRequest("PATCH", `/api/bio-pages/${id}`, data);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update bio page");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bio-pages"] });
      setIsEditModalOpen(false);
      setSelectedPage(null);
      toast({
        title: "Success",
        description: "Bio page updated successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete bio page mutation
  const deletePageMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/bio-pages/${id}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete bio page");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bio-pages"] });
      toast({
        title: "Success",
        description: "Bio page deleted successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Set default bio page mutation
  const setDefaultMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("POST", `/api/bio-pages/${id}/set-default`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to set default bio page");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bio-pages"] });
      toast({
        title: "Success",
        description: "Default bio page updated!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreatePage = (e: React.FormEvent) => {
    e.preventDefault();
    createPageMutation.mutate(createFormData);
  };

  const handleEditPage = (page: Profile) => {
    setSelectedPage(page);
    setEditFormData({
      pageName: page.pageName,
      displayName: page.displayName,
      bio: page.bio,
      profileImageUrl: page.profileImageUrl || "",
    });
    setIsEditModalOpen(true);
  };

  const handleUpdatePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPage) return;
    updatePageMutation.mutate({ id: selectedPage.id, data: editFormData });
  };

  const handleDeletePage = (page: Profile) => {
    if (window.confirm(`Are you sure you want to delete "${page.displayName}"? This action cannot be undone.`)) {
      deletePageMutation.mutate(page.id);
    }
  };

  const handleSetDefault = (page: Profile) => {
    setDefaultMutation.mutate(page.id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-display font-bold text-charcoal">Bio Pages</h2>
          <p className="text-gray-600">Manage your multiple bio pages</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary-light text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create New Page
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Bio Page</DialogTitle>
              <DialogDescription>
                Create a new bio page with a unique name that people can visit.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreatePage} className="space-y-4">
              <div>
                <Label htmlFor="pageName">Page Name</Label>
                <Input
                  id="pageName"
                  value={createFormData.pageName}
                  onChange={(e) => setCreateFormData({ ...createFormData, pageName: e.target.value })}
                  placeholder="e.g., personal, business, portfolio"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  This will be your page URL: yoursite.com/{createFormData.pageName || "page-name"}
                </p>
              </div>
              <div>
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={createFormData.displayName}
                  onChange={(e) => setCreateFormData({ ...createFormData, displayName: e.target.value })}
                  placeholder="Your name or title"
                  required
                />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={createFormData.bio}
                  onChange={(e) => setCreateFormData({ ...createFormData, bio: e.target.value })}
                  placeholder="Tell people about yourself..."
                  required
                />
              </div>
              <div>
                <Label htmlFor="profileImageUrl">Profile Image URL (optional)</Label>
                <Input
                  id="profileImageUrl"
                  type="url"
                  value={createFormData.profileImageUrl}
                  onChange={(e) => setCreateFormData({ ...createFormData, profileImageUrl: e.target.value })}
                  placeholder="https://example.com/your-photo.jpg"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createPageMutation.isPending}
                  className="bg-primary hover:bg-primary-light text-white"
                >
                  {createPageMutation.isPending ? "Creating..." : "Create Page"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Bio Pages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bioPages.map((page) => (
          <Card key={page.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{page.displayName}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <span>/{page.pageName}</span>
                    {page.isDefault && (
                      <Badge variant="secondary" className="text-xs">
                        <Star className="w-3 h-3 mr-1" />
                        Default
                      </Badge>
                    )}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-600 line-clamp-2 mb-4">{page.bio}</p>
              <div className="flex items-center justify-between">
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditPage(page)}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeletePage(page)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                  {!page.isDefault && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSetDefault(page)}
                    >
                      <Star className="w-3 h-3" />
                    </Button>
                  )}
                </div>
                <Link href={`/${page.pageName}`}>
                  <Button size="sm" variant="ghost" className="text-primary">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    View
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Bio Page</DialogTitle>
            <DialogDescription>
              Update your bio page information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdatePage} className="space-y-4">
            <div>
              <Label htmlFor="editPageName">Page Name</Label>
              <Input
                id="editPageName"
                value={editFormData.pageName}
                onChange={(e) => setEditFormData({ ...editFormData, pageName: e.target.value })}
                placeholder="e.g., personal, business, portfolio"
                required
              />
            </div>
            <div>
              <Label htmlFor="editDisplayName">Display Name</Label>
              <Input
                id="editDisplayName"
                value={editFormData.displayName}
                onChange={(e) => setEditFormData({ ...editFormData, displayName: e.target.value })}
                placeholder="Your name or title"
                required
              />
            </div>
            <div>
              <Label htmlFor="editBio">Bio</Label>
              <Textarea
                id="editBio"
                value={editFormData.bio}
                onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                placeholder="Tell people about yourself..."
                required
              />
            </div>
            <div>
              <Label htmlFor="editProfileImageUrl">Profile Image URL (optional)</Label>
              <Input
                id="editProfileImageUrl"
                type="url"
                value={editFormData.profileImageUrl}
                onChange={(e) => setEditFormData({ ...editFormData, profileImageUrl: e.target.value })}
                placeholder="https://example.com/your-photo.jpg"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updatePageMutation.isPending}
                className="bg-primary hover:bg-primary-light text-white"
              >
                {updatePageMutation.isPending ? "Updating..." : "Update Page"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}