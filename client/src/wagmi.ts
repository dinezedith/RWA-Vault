import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
bscTestnet
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: 'bc375bedd339481c19a1e23cac3fd380',
  chains: [
    bscTestnet,
  ],
  ssr: true,
});
