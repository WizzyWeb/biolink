import { Button } from "@/components/ui/button";
import { type Profile } from "@shared/schema";

interface ProfileSectionProps {
  profile: Profile;
  isEditMode: boolean;
  onEditProfile: () => void;
}

export default function ProfileSection({ profile, isEditMode, onEditProfile }: ProfileSectionProps) {
  return (
    <div className="profile-card theme-card theme-spacing-normal mb-6 text-center">
      {/* Profile Image */}
      <div className="mb-6 flex justify-center">
        <div className="gradient-border">
          <img
            src={profile.profileImageUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300"}
            alt="Profile picture"
            className="w-32 h-32 object-cover"
            data-testid="img-profile"
          />
        </div>
      </div>

      {/* Profile Info */}
      <div className="space-y-3">
        <h1 className="text-3xl md:text-4xl theme-font-display font-bold text-charcoal" data-testid="text-display-name">
          {profile.displayName}
        </h1>
        <p className="text-base md:text-lg text-gray-600 theme-font-body max-w-md mx-auto whitespace-pre-line" data-testid="text-bio">
          {profile.bio}
        </p>
      </div>

      {/* Social Stats */}
      <div className="flex justify-center gap-8 mt-6 pt-6 border-t border-gray-100">
        <div className="text-center">
          <div className="text-2xl font-display font-bold text-primary" data-testid="text-profile-views">
            {profile.profileViews?.toLocaleString() || "0"}
          </div>
          <div className="text-sm text-gray-500 font-sans">Profile Views</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-display font-bold text-secondary" data-testid="text-link-clicks">
            {profile.linkClicks?.toLocaleString() || "0"}
          </div>
          <div className="text-sm text-gray-500 font-sans">Link Clicks</div>
        </div>
      </div>

      {/* Edit Profile Button (Edit Mode) */}
      {isEditMode && (
        <div className="mt-6">
          <Button
            onClick={onEditProfile}
            className="w-full bg-gray-100 hover:bg-gray-200 text-charcoal px-6 py-3 rounded-card font-sans font-medium flex items-center justify-center gap-2"
            data-testid="button-edit-profile"
          >
            ✏️
            <span>Edit Profile Details</span>
          </Button>
        </div>
      )}
    </div>
  );
}
