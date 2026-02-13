import { resolve } from 'path'
import { defineConfig } from 'vite'

export default {
    // config options
    assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.fbx', '**/*.ttf'],
    build: {
        rollupOptions: {
            input: {
                main: './index.html',
                aboutme: resolve(__dirname, 'pages/about-me-tech/about-me.html'),
                threejs: resolve(__dirname, 'pages/three-js-project/three-js-project.html'),
                oilproject: resolve(__dirname, 'pages/oil-project/oil-project.html'),
            }
        }
    }
    
  }