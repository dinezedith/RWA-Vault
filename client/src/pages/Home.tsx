import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, Eye, EyeOff, Copy, ExternalLink, Gift, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { readContract } from '@wagmi/core';
import { config } from '@/wagmi';
import { tokenabi, vault } from '@/config/ABI';
import { useAccount, useBalance } from 'wagmi';
import { RWAUSDC, RWAVault } from '@/config/Address';

const Home = () => {
  const [loaded, setLoaded] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [USDCbal, setUSDCbal] = useState(0);

  const address = useAccount();
  const walletBalance = useBalance({
    address: address.address,
})


  useEffect(() => {
      const fetch = async() => {
        

        let bal = await readContract(config, {
            abi: tokenabi,
            address: RWAUSDC,
            functionName: 'balanceOf',
            args:[address.address]
        });
        console.log(bal);
        setUSDCbal(parseInt(bal)/1e6);
      }
        fetch();


    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);

  }, []);



  return (
    <div className="min-h-screen bg-arcade-dark">
      <Header />
      
      <div className={`container mx-auto px-4 py-8 max-w-6xl transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
        {/* Wallet Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Balance Card */}
          <Card className="lg:col-span-2 bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-foreground">Total Balance</CardTitle>
                <CardDescription>Your wallet overview</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowBalance(!showBalance)}
              >
                {showBalance ? <Eye size={20} /> : <EyeOff size={20} />}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-4xl font-bold gradient-text">
                    {showBalance ? `BNB ${walletBalance.data.formatted}` : '••••••'}
                  </p>
                </div>
      
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Value */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Portfolio Value</CardTitle>
              <CardDescription>Total asset value</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground"> ${(USDCbal/1e6).toString().length > 10 
                      ? (USDCbal/1e6).toString().slice(0, 10) + "..." 
                      : (USDCbal/1e6).toString()}</p>
              <div className="mt-4 space-y-2">

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">USDC</span>
                  <span className="text-foreground">
                    {(USDCbal/1e6).toString().length > 10 
                      ? (USDCbal/1e6).toString().slice(0, 10) + "..." 
                      : (USDCbal/1e6).toString()}
                  </span>                
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">BNB</span>
                  <span className="text-foreground">
                    {walletBalance.data.formatted}
                  </span>                
                </div>

              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;