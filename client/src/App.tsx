import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Home from "@/pages/home";
import Analytics from "@/pages/analytics";
import NotFound from "@/pages/not-found";

/**
 * Defines the application's route mappings and renders the corresponding page components.
 *
 * Maps:
 * - "/" → Landing
 * - "/dashboard" → Dashboard
 * - "/analytics/:profileId" → Analytics (captures `profileId`)
 * - "/:username" → Home (captures `username`)
 * - fallback → NotFound
 *
 * @returns A JSX element that renders the route switch for the application
 */
function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/analytics/:profileId" component={Analytics} />
      <Route path="/:username" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;