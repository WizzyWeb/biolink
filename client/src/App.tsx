import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Register from "@/pages/register";
import ForgotPassword from "@/pages/forgot-password";
import ResetPassword from "@/pages/reset-password";
import VerifyEmail from "@/pages/verify-email";
import Dashboard from "@/pages/dashboard";
import Home from "@/pages/home";
import Analytics from "@/pages/analytics";
import NotFound from "@/pages/not-found";

/**
 * Declares the application's route map and returns the router UI.
 *
 * @returns A React element that renders the first route whose path matches the current URL (including dynamic routes for `:profileId` and `:username`); renders the `NotFound` component when no routes match.
 */
function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/verify-email" component={VerifyEmail} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/analytics/:profileId" component={Analytics} />
      <Route path="/:username" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

/**
 * Renders the application root composed with query, tooltip, and theme providers and includes the Toaster and Router.
 *
 * @returns The root React element containing the configured providers and the application UI (Toaster and Router).
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <Toaster />
          <Router />
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;