import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BarChart3, Eye, MousePointerClick, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { getPlatformIcon } from "@/lib/platform-icons";

interface AnalyticsData {
  profile: {
    views: number;
    totalClicks: number;
  };
  links: Array<{
    id: string;
    title: string;
    platform: string;
    clicks: number;
    url: string;
  }>;
}

export default function Analytics() {
  const { profileId } = useParams<{ profileId: string }>();

  const { data, isLoading } = useQuery<AnalyticsData>({
    queryKey: ["/api/analytics", profileId],
    enabled: !!profileId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Not Found</CardTitle>
              <CardDescription>Unable to load analytics data</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  const totalEngagement = data.profile.views + data.profile.totalClicks;
  const sortedLinks = [...data.links].sort((a, b) => b.clicks - a.clicks);
  const engagementRate = data.profile.views > 0 
    ? ((data.profile.totalClicks / data.profile.views) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href={`/${data.links[0]?.url?.split('/')[3] || ''}`}>
              <Button variant="outline" size="icon" data-testid="button-back">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-charcoal flex items-center gap-3">
                <BarChart3 className="text-primary" />
                Analytics Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Track your profile performance and engagement</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Profile Views */}
          <Card data-testid="card-profile-views">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2 text-sm">
                <Eye className="h-4 w-4 text-primary" />
                Profile Views
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-display font-bold text-charcoal" data-testid="stat-profile-views">
                {data.profile.views.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-2">Total visitors to your profile</p>
            </CardContent>
          </Card>

          {/* Total Link Clicks */}
          <Card data-testid="card-link-clicks">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2 text-sm">
                <MousePointerClick className="h-4 w-4 text-secondary" />
                Link Clicks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-display font-bold text-charcoal" data-testid="stat-link-clicks">
                {data.profile.totalClicks.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-2">Total clicks across all links</p>
            </CardContent>
          </Card>

          {/* Engagement Rate */}
          <Card data-testid="card-engagement-rate">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                Engagement Rate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-display font-bold text-charcoal" data-testid="stat-engagement-rate">
                {engagementRate}%
              </div>
              <p className="text-xs text-gray-500 mt-2">Clicks per profile view</p>
            </CardContent>
          </Card>
        </div>

        {/* Link Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-display font-bold text-charcoal">
              Link Performance
            </CardTitle>
            <CardDescription>Individual link click statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4" data-testid="link-performance-list">
              {sortedLinks.map((link, index) => {
                const { icon, bgColor } = getPlatformIcon(link.platform);
                const percentage = data.profile.totalClicks > 0
                  ? ((link.clicks / data.profile.totalClicks) * 100).toFixed(1)
                  : "0.0";

                return (
                  <div
                    key={link.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    data-testid={`link-stat-${link.id}`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-full ${bgColor} flex items-center justify-center text-white text-xl flex-shrink-0`}>
                        {icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {index === 0 && link.clicks > 0 && (
                            <span className="text-xs bg-primary text-white px-2 py-1 rounded-full font-semibold">
                              Top Performer
                            </span>
                          )}
                          <h3 className="text-lg font-sans font-semibold text-charcoal" data-testid={`text-link-title-${link.id}`}>
                            {link.title}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{link.url}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-display font-bold text-charcoal" data-testid={`text-link-clicks-${link.id}`}>
                        {link.clicks.toLocaleString()}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {percentage}% of total clicks
                      </p>
                    </div>
                  </div>
                );
              })}

              {sortedLinks.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <p>No link performance data yet</p>
                  <p className="text-sm mt-2">Start sharing your profile to see analytics!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tips Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-xl font-display font-bold text-charcoal">
              💡 Pro Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Share your profile link on social media to increase visibility</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Add compelling descriptions to your links to boost click rates</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Reorder your links to prioritize high-value content</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Engagement rate of 20%+ is considered excellent</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
