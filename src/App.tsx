import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import './i18n';

import LanguageSelector from "./pages/LanguageSelector";
import Home from "./pages/Home";
import Analyze from "./pages/Analyze";
import About from "./pages/About";
import Settings from "./pages/Settings";
import Catalogs from "./pages/Catalogs";
import Calculators from "./pages/Calculators";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState<boolean | null>(null);

  useEffect(() => {
    const selected = localStorage.getItem('hasSelectedLanguage');
    setHasSelectedLanguage(!!selected);
  }, []);

  if (hasSelectedLanguage === null) {
    return null; // Loading state
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={
                hasSelectedLanguage ? <Navigate to="/home" replace /> : <Navigate to="/language" replace />
              } 
            />
            <Route path="/language" element={<LanguageSelector />} />
            <Route path="/home" element={<Home />} />
            <Route path="/analyze" element={<Analyze />} />
            <Route path="/catalogs" element={<Catalogs />} />
            <Route path="/calculators" element={<Calculators />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/about" element={<About />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
