import { Button } from "@/components/ui/button";
import { type Profile } from "@shared/schema";
import { motion } from "framer-motion";
import { useGravatar } from "@/hooks/useGravatar";

interface ProfileSectionProps {
  profile: Profile;
  isEditMode: boolean;
  onEditProfile: () => void;
  userEmail?: string; // Optional user email for Gravatar integration
}

/**
 * Render the user's profile card with image, display name, bio, view/click stats, and an optional edit control.
 *
 * When `userEmail` is provided and the profile has no custom image, a Gravatar URL will be used as the image source (falling back to a default image). The edit button is shown only when `isEditMode` is true and invokes `onEditProfile` when clicked.
 *
 * @param userEmail - Optional email used to fetch a Gravatar image when `profile.profileImageUrl` is not set
 * @param onEditProfile - Handler invoked when the "Edit Profile Details" button is clicked
 * @returns The ProfileSection React element
 */
export default function ProfileSection({ profile, isEditMode, onEditProfile, userEmail }: ProfileSectionProps) {
  const fallbackImage =
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&h=300";

  // Use Gravatar if user email is available and no custom profile image is set
  const shouldUseGravatar = userEmail && !profile.profileImageUrl;
  
  const { gravatarUrl, isLoading: gravatarLoading } = useGravatar(
    shouldUseGravatar ? userEmail : null,
    {
      size: 128,
      fallbackUrl: fallbackImage,
      useInitials: true,
      name: profile.displayName
    }
  );

  // Determine the final image source
  const imageSrc = profile.profileImageUrl || (shouldUseGravatar ? gravatarUrl : fallbackImage);

  return (
    <motion.section
      className="profile-card theme-card theme-spacing-normal mb-6 text-center"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <motion.div
        className="mb-6 flex justify-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.4 }}
      >
        <div className="gradient-border">
          <motion.img
            src={imageSrc}
            alt={profile.displayName || "Profile"}
            className="w-32 h-32 object-cover rounded-full"
            data-testid="img-profile"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            style={{ 
              opacity: gravatarLoading ? 0.7 : 1,
              transition: 'opacity 0.3s ease'
            }}
          />
        </div>
      </motion.div>

      <motion.div
        className="space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.4 }}
      >
        <h1
          className="text-3xl md:text-4xl theme-font-display font-bold theme-font-display-color"
          data-testid="text-display-name"
        >
          {profile.displayName || "User"}
        </h1>
        {profile.bio && (
          <p
            className="text-base md:text-lg theme-font-body max-w-md mx-auto whitespace-pre-line theme-font-body-color"
            data-testid="text-bio"
          >
            {profile.bio}
          </p>
        )}
      </motion.div>

      <motion.div
        className="flex justify-center gap-8 mt-6 pt-6 border-t border-gray-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.4 }}
      >
        <div className="text-center">
          <div className="text-2xl font-display font-bold text-primary" data-testid="text-profile-views">
            {profile.profileViews?.toLocaleString() || "0"}
          </div>
          <div className="text-sm font-sans theme-font-body-color">Profile Views</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-display font-bold text-secondary" data-testid="text-link-clicks">
            {profile.linkClicks?.toLocaleString() || "0"}
          </div>
          <div className="text-sm font-sans theme-font-body-color">Link Clicks</div>
        </div>
      </motion.div>

      {isEditMode && (
        <motion.div
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.4 }}
        >
          <Button
            onClick={onEditProfile}
            variant="outline"
            className="w-full text-charcoal rounded-card gap-2"
            data-testid="button-edit-profile"
          >
            ✏️
            <span>Edit Profile Details</span>
          </Button>
        </motion.div>
      )}
    </motion.section>
  );
}