import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FingerprintIcon } from 'lucide-react';
import { readContract, signMessage, waitForTransactionReceipt, writeContract } from '@wagmi/core';
import { config } from '@/wagmi';
import { useAccount } from 'wagmi';
import { addInvoice, addUser, getWalletData, updateKyc } from '@/APIs/controller';
import { tokenabi, vault } from '@/config/ABI';
import { RWAUSDC, RWAVault } from '@/config/Address';

const Invest = () => {
  const [selectedToken, setSelectedToken] = useState('');
  const [amount, setAmount] = useState('');
  const[account, setAccount] = useState('');
  const [data, setData] = useState('');
  const [status, setStatus] = useState(false);
  const [bal, setBal] = useState(0);
  
  const address = useAccount();


useEffect(() => {

  const initilize = async () => {
    setAccount(address.address);
  }

  const fetch = async() => {
    let res = await getWalletData(address.address);
    if(res.user == 0){
      let res = await addUser(address.address, false);
      console.log(res);
    }
    console.log(res);
    setData(res);
    setStatus(res.user[0].kyc_status); 

    let bal = await readContract(config, {
        abi: tokenabi,
        address: RWAUSDC,
        functionName: 'balanceOf',
        args:[address.address]
    });
    setBal(parseInt(bal)/1e6);
  }
  initilize();
  fetch();
}, []);


  const handleKYC = async () => {
    try { 
      const response = await signMessage(config,{
        account: address.address,
        message: `
          I hereby confirm that I am the owner of this 
          wallet address: ${address.address}
          Purpose: To simulate a KYC verification process for testing only.
          No personal information is being transmitted.
          Timestamp: ${new Date().toISOString()}`,
    });
    const res = await updateKyc(address.address);
    console.log(res);
    alert('KYC process simulated successfully');
    }catch (error) {
      alert('Error during KYC process: ' + error.message);
    }
  }


  const handleApprove = async () => {
    try {
        const approve_tx = await writeContract(config, {
          abi: tokenabi,
          address: RWAUSDC,
          functionName: 'approve',
          args: [ RWAVault, BigInt(Number(amount) * 1e6)],
        });
        await waitForTransactionReceipt(config, {
          hash: approve_tx,
        });
    } catch (error) {
        alert('Approval failed: ' + error);
    }
  }


    const handledeposit = async () => {
    try {
        const deposit_tx = await writeContract(config, {
          abi: vault,
          address: RWAVault,
          functionName: 'deposit',
          args: [BigInt(Number(amount) * 1e6)],
        });
        await waitForTransactionReceipt(config, {
          hash: deposit_tx,
        });
        console.log(deposit_tx);
        debugger
        return deposit_tx;
    } catch (error) {
        alert('Approval failed: ' + error);
    }
  }

  const handleInvoice = async () => {
    await handleApprove();
    const receipt:string = await handledeposit();
    let res = await addInvoice(receipt, address.address, Number(amount), "true");
  }

  const handleDeposit = () => {
    if (!amount || !selectedToken) return;
    // Mock deposit functionality
    alert(`Depositing ${amount} ${selectedToken} successfully!`);
  };

  return (
    <div className="min-h-screen bg-arcade-dark">
      <Header />
      
      <div className={`container mx-auto px-4 py-8 max-w-6xl transition-opacity duration-700`}>
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Start Investing</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect your wallet and choose from various investment opportunities to grow your crypto portfolio.
          </p>
        </div>
        <Card className="mb-8 bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-foreground">
              <FingerprintIcon size={24} />
              <span> KYC VERIFICATION</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Button 
                  onClick={handleKYC}
                  disabled= {status}
                  className="px-8"
                >
                  Request
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
            {/* Deposit Form */}
            <Card className="mb-8 bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Deposit Tokens</CardTitle>
                <CardDescription>Select a token and amount to invest</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="token">Select Token</Label>
                    <Select value= {selectedToken} onValueChange={setSelectedToken}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a token" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USDC">USDC - USD Coin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-4">
                  <div className="text-sm text-muted-foreground">
                    Available Balance: {bal} USDC
                  </div>
                  <Button 
                    onClick={handleInvoice}
                    disabled={!selectedToken || !amount}
                    className="px-8"
                  >
                    Deposit
                  </Button>
                </div>
              </CardContent>
            </Card>
      </div>
    </div>
  );
};

export default Invest;