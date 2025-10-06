import { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Edit, Eye, BarChart3 } from "lucide-react";
import ProfileSection from "@/components/profile-section";
import SocialLinksList from "@/components/social-links-list";
import AddLinkModal from "@/components/add-link-modal";
import EditProfileModal from "@/components/edit-profile-modal";
import { type Profile, type SocialLink } from "@shared/schema";

interface ProfileData {
  profile: Profile;
  links: SocialLink[];
}

export default function Home() {
  const { username } = useParams<{ username?: string }>();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddLinkModalOpen, setIsAddLinkModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  const profileUsername = username || "sarahmitchell";

  const { data, isLoading, error } = useQuery<ProfileData>({
    queryKey: ["/api/profile", profileUsername],
    enabled: !!profileUsername,
  });

  const handleCopyShareUrl = async () => {
    const shareUrl = `${window.location.origin}/${profileUsername}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      // You could add a toast notification here
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareToSocial = (platform: string) => {
    const shareUrl = `${window.location.origin}/${profileUsername}`;
    const text = `Check out my links on LinkHub!`;
    
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${shareUrl}`)}`,
    };

    const url = urls[platform as keyof typeof urls];
    if (url) {
      window.open(url, "_blank");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-card shadow-lg p-8 mb-6 animate-pulse">
            <div className="mb-6 flex justify-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
            </div>
            <div className="space-y-3">
              <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
              <div className="h-6 bg-gray-200 rounded w-full mx-auto"></div>
              <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-card shadow-lg p-8">
            <h1 className="text-2xl font-bold text-charcoal mb-4">Profile Not Found</h1>
            <p className="text-gray-600">The requested profile could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      {/* Edit Mode Toggle */}
      <div className="fixed top-5 right-5 z-50">
        <Button
          onClick={() => setIsEditMode(!isEditMode)}
          className={`bg-primary hover:bg-primary-light text-white px-6 py-3 rounded-full shadow-lg font-semibold flex items-center gap-2 ${
            isEditMode ? "pulse-animation" : ""
          }`}
          data-testid="button-edit-mode"
        >
          {isEditMode ? <Eye className="w-5 h-5" /> : <Edit className="w-5 h-5" />}
          <span>{isEditMode ? "View Mode" : "Edit Profile"}</span>
        </Button>
      </div>

      <div className="max-w-2xl mx-auto">
        <ProfileSection
          profile={data.profile}
          isEditMode={isEditMode}
          onEditProfile={() => setIsEditProfileModalOpen(true)}
        />

        {/* Admin Controls */}
        {isEditMode && (
          <div className="mb-6">
            <div className="bg-white rounded-card shadow-lg p-6">
              <h3 className="text-xl font-display font-bold text-charcoal mb-4 flex items-center gap-2">
                <Edit className="w-5 h-5 text-primary" />
                Link Management
              </h3>
              <div className="space-y-3">
                <Button
                  onClick={() => setIsAddLinkModalOpen(true)}
                  className="w-full bg-primary hover:bg-primary-light text-white px-6 py-4 rounded-card font-semibold flex items-center justify-center gap-3 shadow-md hover:shadow-lg"
                  data-testid="button-add-link"
                >
                  <span className="text-xl">+</span>
                  <span>Add New Link</span>
                </Button>
                <Link href={`/analytics/${data.profile.id}`}>
                  <Button
                    className="w-full bg-secondary hover:bg-secondary/90 text-white px-6 py-4 rounded-card font-semibold flex items-center justify-center gap-3 shadow-md hover:shadow-lg"
                    data-testid="button-analytics"
                  >
                    <BarChart3 className="w-5 h-5" />
                    <span>View Analytics</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        <SocialLinksList 
          links={data.links} 
          isEditMode={isEditMode}
          profileId={data.profile.id}
        />

        {/* Share Section */}
        <div className="mt-8 bg-white rounded-card shadow-lg p-6 text-center">
          <h3 className="text-xl font-display font-bold text-charcoal mb-4">Share Your Profile</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={`${window.location.origin}/${profileUsername}`}
                readOnly
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-card font-sans text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
                data-testid="input-share-url"
              />
              <Button
                onClick={handleCopyShareUrl}
                className="bg-primary hover:bg-primary-light text-white px-6 py-3 rounded-card font-semibold flex items-center gap-2"
                data-testid="button-copy-url"
              >
                <span>📋</span>
                <span className="hidden sm:inline">Copy</span>
              </Button>
            </div>
          </div>
          <div className="flex justify-center gap-3 mt-4">
            <Button
              onClick={() => shareToSocial("facebook")}
              className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center"
              data-testid="button-share-facebook"
            >
              f
            </Button>
            <Button
              onClick={() => shareToSocial("twitter")}
              className="w-10 h-10 rounded-full bg-black hover:bg-gray-800 text-white flex items-center justify-center"
              data-testid="button-share-twitter"
            >
              𝕏
            </Button>
            <Button
              onClick={() => shareToSocial("linkedin")}
              className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center"
              data-testid="button-share-linkedin"
            >
              in
            </Button>
            <Button
              onClick={() => shareToSocial("whatsapp")}
              className="w-10 h-10 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center"
              data-testid="button-share-whatsapp"
            >
              📱
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-charcoal font-sans text-sm mb-2">
            Powered by <span className="font-semibold text-primary">LinkHub</span>
          </p>
        </div>
      </div>

      {/* Modals */}
      <AddLinkModal
        isOpen={isAddLinkModalOpen}
        onClose={() => setIsAddLinkModalOpen(false)}
        profileId={data.profile.id}
      />

      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        profile={data.profile}
      />
    </div>
  );
}
