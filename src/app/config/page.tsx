
// config/page.tsx

import { cookieStorage, createStorage, http } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { sepolia } from '@reown/appkit/networks'

// Get projectId from https://cloud.reown.com
export const projectId = 'c00bb1831476f81fb8e314045f057e86'

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const networks = [sepolia]

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks
})

export const config = wagmiAdapter.wagmiConfig