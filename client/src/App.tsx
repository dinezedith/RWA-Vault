
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Invest from "./pages/Invest";
import Claim from "./pages/Claim";
import NotFound from "./pages/NotFound";
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import './styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { config } from './wagmi';



const queryClient = new QueryClient();

const App = () => (
  <WagmiProvider config={config}>
  <QueryClientProvider client={queryClient}>
    <RainbowKitProvider modalSize="compact" showRecentTransactions={true} coolMode>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/invest" element={<Invest />} />
          <Route path="/claim" element={<Claim />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </RainbowKitProvider>
  </QueryClientProvider>
  </WagmiProvider>
);

export default App;
