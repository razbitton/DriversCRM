import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Clients from "@/pages/Clients";
import Settings from "@/pages/Settings";
import Drivers from "@/pages/Drivers";
import Trips from "@/pages/Trips";
import Payments from "@/pages/Payments";
import Tenders from "@/pages/Tenders";
import Pricing from "@/pages/Pricing";
import DriverReport from "@/pages/DriverReport";
import GeneralReport from "@/pages/GeneralReport";
import CustomReport from "@/pages/CustomReport";

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <Layout currentPageName="Dashboard"><Dashboard /></Layout>} />
      <Route path="/dashboard" component={() => <Layout currentPageName="Dashboard"><Dashboard /></Layout>} />
      <Route path="/clients" component={() => <Layout currentPageName="Clients"><Clients /></Layout>} />
      <Route path="/settings" component={() => <Layout currentPageName="Settings"><Settings /></Layout>} />
      <Route path="/drivers" component={() => <Layout currentPageName="Drivers"><Drivers /></Layout>} />
      <Route path="/trips" component={() => <Layout currentPageName="Trips"><Trips /></Layout>} />
      <Route path="/payments" component={() => <Layout currentPageName="Payments"><Payments /></Layout>} />
      <Route path="/tenders" component={() => <Layout currentPageName="Tenders"><Tenders /></Layout>} />
      <Route path="/pricing" component={() => <Layout currentPageName="Pricing"><Pricing /></Layout>} />
      <Route path="/driver-report" component={() => <Layout currentPageName="DriverReport"><DriverReport /></Layout>} />
      <Route path="/general-report" component={() => <Layout currentPageName="GeneralReport"><GeneralReport /></Layout>} />
      <Route path="/custom-report" component={() => <Layout currentPageName="CustomReport"><CustomReport /></Layout>} />
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
