import {defineConfig, passthroughImageService} from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  image: {
    service: passthroughImageService()
  },
  adapter: cloudflare({
    platformProxy: {
      enabled: true
    }
  })
});