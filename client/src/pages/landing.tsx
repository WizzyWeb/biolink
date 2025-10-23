import { Button } from "@/components/ui/button";
import { Link2, Github, Heart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Landing() {
  const { isAuthenticated, isLoading } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/api/login";
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-secondary/10">
      {/* Header */}
      <header className="py-6 px-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link2 className="w-8 h-8 text-primary" />
            <span className="text-2xl font-display font-bold text-charcoal">LinkHub</span>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-charcoal transition-colors"
            >
              <Github className="w-6 h-6" />
            </a>
            {isAuthenticated ? (
              <Button
                onClick={() => window.location.href = "/dashboard"}
                className="bg-primary hover:bg-primary-light text-white px-6 py-2 rounded-full font-semibold"
                data-testid="button-dashboard"
              >
                Dashboard
              </Button>
            ) : (
              <Button
                onClick={() => window.location.href = "/api/login"}
                className="bg-primary hover:bg-primary-light text-white px-6 py-2 rounded-full font-semibold"
                data-testid="button-login-header"
              >
                Log In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center">
          <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
            Free & Open Source
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-charcoal mb-6">
            Link In Bio
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Share all your important links in one beautiful, customizable profile.
          </p>
          <Button
            onClick={handleGetStarted}
            className="bg-primary hover:bg-primary-light text-white px-10 py-6 text-lg rounded-card font-semibold shadow-lg hover:shadow-xl transition-all"
            data-testid="button-get-started"
          >
            {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
          </Button>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-20 max-w-4xl mx-auto">
          <div className="text-center p-6">
            <div className="text-4xl mb-3">🔗</div>
            <h3 className="font-semibold text-charcoal mb-2">Unlimited Links</h3>
            <p className="text-gray-600 text-sm">Add all your social media, websites, and more</p>
          </div>
          
          <div className="text-center p-6">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="font-semibold text-charcoal mb-2">Analytics</h3>
            <p className="text-gray-600 text-sm">Track views and clicks on your profile</p>
          </div>
          
          <div className="text-center p-6">
            <div className="text-4xl mb-3">✨</div>
            <h3 className="font-semibold text-charcoal mb-2">Customizable</h3>
            <p className="text-gray-600 text-sm">Make it yours with custom bio and images</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 mt-20 border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-600 flex items-center justify-center gap-2">
            Made with <Heart className="w-4 h-4 text-red-500" /> as Free & Open Source Software
          </p>
        </div>
      </footer>
    </div>
  );
}
