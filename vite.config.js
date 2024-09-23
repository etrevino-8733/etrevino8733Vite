import { resolve } from 'path'
import { defineConfig } from 'vite'

export default {
    // config options
    assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.fbx', '**/*.ttf'],
    build: {
        rollupOptions: {
            input: {
                main: './index.html',
                aboutme: resolve(__dirname, 'pages/about-me/about-me.html'),
            }
        }
    }
    
  }