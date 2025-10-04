import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gift, Clock, CheckCircle, ExternalLink } from 'lucide-react';
import { useAccount } from 'wagmi';
import { tokenabi, vault } from '@/config/ABI';
import { RWAJNR, RWASNR, RWAVault } from '@/config/Address';
import { readContract, waitForTransactionReceipt, writeContract } from '@wagmi/core';
import { config } from '@/wagmi';

const Claim = () => {
  const [loaded, setLoaded] = useState(false);
  const[account, setAccount] = useState('');
  const [data, setData] = useState([]);


  const address = useAccount();
  

  useEffect(() => {
    const initilize = async () => {
      setAccount(address.address);
      console.log("Wallet address:", address.address);
    }

  
    const fetch = async() => {
  
      let res = await readContract(config, {
          abi: vault,
          address: RWAVault,
          functionName: 'getUserInvestment',
          args:[address.address]
      });
      const withIds = res.pool.map((item, index) => ({
        id: index,
        ...item,
      }));
      console.log(withIds);
      setData(withIds);
    }
    initilize();
    fetch();
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);


      const handleSNRtransfer = async(amount) => {
      let res = await writeContract(config, {
          abi: tokenabi,
          address: RWASNR,
          functionName: 'transfer',
          args:[RWAVault, amount]
      });
      await waitForTransactionReceipt(config,{
          hash: res,
      });
    }


    const handleJNRtransfer = async(amount) => {
      let res = await writeContract(config, {
          abi: tokenabi,
          address: RWAJNR,
          functionName: 'transfer',
          args:[RWAVault, amount]
      });
      const receipt = await waitForTransactionReceipt(config,{
          hash: res,
      });
    }

  const handleClaim = async (tokenId: number) => {
    const  params = data.find((token) => token.id === tokenId);

    await handleSNRtransfer(params.SNRAlloc);
    await handleJNRtransfer(params.JNRAlloc);

    const res  = writeContract(config, {
      abi: vault,
      address: RWAVault,
      functionName: 'redeem',
      args:[[tokenId,params.SNRAlloc, params.JNRAlloc]],
    });

    await waitForTransactionReceipt(config, {
      hash:res,
    });
    console.log(res);
 
    alert(`Claiming rewards for Pool ID: ${tokenId}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'true':
        return <Gift className="text-green-500" size={20} />;
      case 'false':
        return <CheckCircle className="text-muted-foreground" size={20} />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'true':
        return <Badge variant="default" className="bg-green-600">Ready</Badge>;
      case 'false':
        return <Badge variant="outline">Claimed</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-arcade-dark">
      <Header />
      
      <div className={`container mx-auto px-4 py-8 max-w-6xl transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Claim Rewards</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Claim your earned rewards from staking, lending, and liquidity providing activities.
          </p>
        </div>

        <div className="space-y-4">
          {data.map((token) => (
            <Card key={token.id} className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(token.isActive.toString())}
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-bold text-lg text-foreground">USDC</h3>
                        {getStatusBadge(token.isActive.toString())}
                      </div>
                      <p className="text-sm text-muted-foreground">USDC Investment</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1 max-w-2xl">
                    <div className="text-center md:text-left">
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="font-medium text-foreground">{Number(token.amounts)/1e6} USDC</p>
                    </div>
                    <div className="text-center md:text-left">
                      <p className="text-sm text-muted-foreground">SNR TOKEN VOLUME</p>
                      <p className="font-medium text-foreground">{Number(token.SNRAlloc)/1e18}</p>
                    </div>
                    <div className="text-center md:text-left">
                      <p className="text-sm text-muted-foreground">JNR TOKEN VOLUME</p>
                      <p className="font-medium text-foreground">{Number(token.JNRAlloc)/1e18}</p>
                    </div>
                    <div className="text-center md:text-left">
                      <p className="text-sm text-muted-foreground">Active</p>
                      <p className="font-medium text-foreground">{token.isActive.toString()}</p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleClaim(token.id)}
                      disabled={token.isActive.toString() === 'false'}
                      variant={token.isActive.toString() === 'true' ? 'default' : 'outline'}
                      size="sm"
                    >
                      REDEEM
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ExternalLink size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Claim;