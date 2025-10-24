import { Button } from "@/components/ui/button";
import { type Profile } from "@shared/schema";
import { motion } from "framer-motion";

interface ProfileSectionProps {
  profile: Profile;
  isEditMode: boolean;
  onEditProfile: () => void;
}

export default function ProfileSection({ profile, isEditMode, onEditProfile }: ProfileSectionProps) {
  const fallbackImage =
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&h=300";

  return (
    <motion.section
      className="profile-card bg-white rounded-card shadow-lg p-8 mb-6 text-center"
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
            src={profile.profileImageUrl || fallbackImage}
            alt={profile.displayName || "Profile"}
            className="w-32 h-32 object-cover rounded-full"
            data-testid="img-profile"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
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
          className="text-3xl md:text-4xl font-display font-bold text-charcoal break-words"
          data-testid="text-display-name"
        >
          {profile.displayName || "User"}
        </h1>
        {profile.bio && (
          <p
            className="text-base md:text-lg text-gray-600 font-sans max-w-md mx-auto whitespace-pre-line"
            data-testid="text-bio"
          >
            {profile.bio}
          </p>
        )}
      </motion.div>

      <motion.div
        className="flex justify-center gap-10 mt-6 pt-6 border-t border-gray-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.4 }}
      >
        <Stat value={profile.profileViews} label="Profile Views" testId="text-profile-views" />
        <Stat value={profile.linkClicks} label="Link Clicks" testId="text-link-clicks" secondary />
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

function Stat({
  value,
  label,
  testId,
  secondary,
}: {
  value?: number;
  label: string;
  testId: string;
  secondary?: boolean;
}) {
  return (
    <div className="text-center">
      <p
        className={`text-2xl font-display font-bold ${
          secondary ? "text-secondary" : "text-primary"
        }`}
        data-testid={testId}
      >
        {value?.toLocaleString() || "0"}
      </p>
      <p className="text-sm text-gray-500 font-sans">{label}</p>
    </div>
  );
}
