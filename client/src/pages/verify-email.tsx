import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link as LinkIcon, CheckCircle2, XCircle, Loader2 } from "lucide-react";

/**
 * Renders an email verification page that reads a "token" query parameter, verifies it with the authentication API, and displays loading, success, or error states.
 *
 * @returns The verification page JSX. On success it shows a success message and redirects to /dashboard after 2 seconds; on error it shows an error message and actions to go to login or home.
 */
export default function VerifyEmail() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [location] = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`, {
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully!");
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 2000);
        } else {
          setStatus("error");
          setMessage(data.error || "Verification failed");
        }
      } catch (error) {
        setStatus("error");
        setMessage("An error occurred during verification");
      }
    };

    verifyEmail();
  }, [location]);

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
        </div>

        <Card className="shadow-xl border-gray-200">
          <CardContent className="pt-6 text-center">
            {status === "loading" && (
              <>
                <div className="mb-4">
                  <Loader2 className="w-16 h-16 text-primary mx-auto animate-spin" />
                </div>
                <h2 className="text-2xl font-display font-bold text-charcoal mb-2">
                  Verifying your email...
                </h2>
                <p className="text-gray-600">Please wait while we verify your email address.</p>
              </>
            )}

            {status === "success" && (
              <>
                <div className="mb-4">
                  <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
                </div>
                <h2 className="text-2xl font-display font-bold text-charcoal mb-2">
                  Email Verified!
                </h2>
                <p className="text-gray-600 mb-6">{message}</p>
                <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
              </>
            )}

            {status === "error" && (
              <>
                <div className="mb-4">
                  <XCircle className="w-16 h-16 text-red-500 mx-auto" />
                </div>
                <h2 className="text-2xl font-display font-bold text-charcoal mb-2">
                  Verification Failed
                </h2>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="space-y-3">
                  <Link href="/login">
                    <Button className="w-full bg-primary hover:bg-primary-light">
                      Go to Login
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button variant="outline" className="w-full">
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}