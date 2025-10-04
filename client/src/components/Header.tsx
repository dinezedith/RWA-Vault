
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Wallet, TrendingUp, Gift } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Header = () => {
  const [loaded, setLoaded] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setLoaded(true);
  }, []);

  const navItems = [
    { path: '/', label: 'Home', icon: <Wallet size={20} /> },
    { path: '/invest', label: 'Invest', icon: <TrendingUp size={20} /> },
    { path: '/claim', label: 'Claim', icon: <Gift size={20} /> },
  ];

  return (
    <header className={`py-6 transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <Link to="/" className="flex items-center space-x-2">
          <Wallet className="text-arcade-purple" size={32} />
          <h1 className="font-bold text-white text-2xl md:text-3xl tracking-wide">
            <span className="gradient-text">RWA VAULT</span>
          </h1>
        </Link>
        
        <nav className="flex space-x-1">
          <ConnectButton/>
          {navItems.map((item) => (
            <Button
              key={item.path}
              asChild
              variant={location.pathname === item.path ? "default" : "ghost"}
              className="flex items-center space-x-2 px-4 py-2"
            >
              <Link to={item.path}>
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </Button>
          ))}
        </nav>
      </div>

    </header>
  );
};

export default Header;
