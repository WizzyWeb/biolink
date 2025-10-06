export function getPlatformIcon(platform: string) {
  const iconMap = {
    instagram: {
      icon: "📷",
      bgColor: "bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500",
    },
    twitter: {
      icon: "𝕏",
      bgColor: "bg-black",
    },
    linkedin: {
      icon: "💼",
      bgColor: "bg-blue-600",
    },
    tiktok: {
      icon: "🎵",
      bgColor: "bg-black",
    },
    youtube: {
      icon: "📺",
      bgColor: "bg-red-600",
    },
    github: {
      icon: "💻",
      bgColor: "bg-gray-800",
    },
    website: {
      icon: "🌐",
      bgColor: "bg-secondary",
    },
    newsletter: {
      icon: "✉️",
      bgColor: "bg-gradient-to-br from-primary to-primary-light",
    },
    custom: {
      icon: "🔗",
      bgColor: "bg-gray-500",
    },
  };

  return iconMap[platform as keyof typeof iconMap] || iconMap.custom;
}
