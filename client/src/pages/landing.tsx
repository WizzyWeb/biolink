import { Button } from "@/components/ui/button";
import { Link2, BarChart3, Users, Sparkles } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-secondary/10">
      {/* Header */}
      <header className="py-6 px-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link2 className="w-8 h-8 text-primary" />
            <span className="text-2xl font-display font-bold text-charcoal">LinkHub</span>
          </div>
          <Button
            onClick={handleLogin}
            className="bg-primary hover:bg-primary-light text-white px-6 py-2 rounded-full font-semibold"
            data-testid="button-login-header"
          >
            Log In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-charcoal mb-6">
            One Link for{" "}
            <span className="text-primary">Everything</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Share all your important links in one beautiful profile. Perfect for creators, businesses, and anyone who wants to simplify their online presence.
          </p>
          <Button
            onClick={handleLogin}
            className="bg-primary hover:bg-primary-light text-white px-8 py-6 text-lg rounded-card font-semibold shadow-lg hover:shadow-xl transition-all"
            data-testid="button-get-started"
          >
            Get Started Free
          </Button>
        </div>

        {/* Features */}
        <div className="grid md:grid-3xl gap-8 mt-20">
          <div className="bg-white rounded-card shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Link2 className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-display font-bold text-charcoal mb-3">
              Unlimited Links
            </h3>
            <p className="text-gray-600">
              Add as many links as you need. Social media, websites, portfolios, shops, and more.
            </p>
          </div>

          <div className="bg-white rounded-card shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-xl font-display font-bold text-charcoal mb-3">
              Track Performance
            </h3>
            <p className="text-gray-600">
              See how many people view your profile and click your links with built-in analytics.
            </p>
          </div>

          <div className="bg-white rounded-card shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-display font-bold text-charcoal mb-3">
              Easy Customization
            </h3>
            <p className="text-gray-600">
              Personalize your profile with custom bio, profile picture, and link descriptions.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-gradient-to-r from-primary to-secondary rounded-card shadow-xl p-12 text-center text-white">
          <Users className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-3xl font-display font-bold mb-4">
            Join LinkHub Today
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Create your profile in seconds. No credit card required.
          </p>
          <Button
            onClick={handleLogin}
            className="bg-white text-primary hover:bg-gray-100 px-8 py-6 text-lg rounded-card font-semibold shadow-lg"
            data-testid="button-cta-login"
          >
            Sign Up Now
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 mt-16 border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center text-gray-600">
          <p>&copy; 2024 LinkHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
