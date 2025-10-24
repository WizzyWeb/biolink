import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Link as LinkIcon, Mail, CheckCircle2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

/**
 * Render the forgot-password page and manage sending a password-reset request for the entered email.
 *
 * Displays an email input and submit button, sends a password-reset request for the provided address, shows an error toast on failure, and replaces the form with a confirmation view on success.
 *
 * @returns The forgot-password page as a JSX element.
 */
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await apiRequest("POST", "/api/auth/forgot-password", { email });
      setIsSuccess(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/10 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-gray-200">
            <CardContent className="pt-6 text-center">
              <div className="mb-4">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
              </div>
              <h2 className="text-2xl font-display font-bold text-charcoal mb-2">
                Check your email!
              </h2>
              <p className="text-gray-600 mb-6">
                If an account exists for <strong>{email}</strong>, we've sent password reset instructions to your email.
              </p>
              <div className="space-y-3">
                <Link href="/login">
                  <Button className="w-full bg-primary hover:bg-primary-light">
                    Back to Login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link href="/">
            <a className="inline-flex items-center gap-3 mb-2 hover:opacity-80 transition-opacity">
              <LinkIcon className="w-10 h-10 text-primary" />
              <span className="text-3xl font-display font-bold text-charcoal">LinkBoard</span>
            </a>
          </Link>
          <p className="text-gray-600">Reset your password</p>
        </div>

        <Card className="shadow-xl border-gray-200">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-display font-bold">Forgot Password?</CardTitle>
            <CardDescription>
              Enter your email address and we'll send you a link to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                    data-testid="input-email"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary-light text-white font-semibold py-3"
                disabled={isLoading}
                data-testid="button-reset-password"
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Remember your password?{" "}
              <Link href="/login">
                <a className="text-primary hover:text-primary-light font-semibold transition-colors">
                  Log in
                </a>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-500">
          <Link href="/">
            <a className="hover:text-gray-700 transition-colors">
              ← Back to home
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}