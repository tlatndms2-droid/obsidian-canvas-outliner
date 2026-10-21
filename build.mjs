import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {build}=require('esbuild');
await build({entryPoints:['src/main.ts'],outfile:'main.js',bundle:true,format:'cjs',platform:'browser',target:'es2022',external:['obsidian','electron','fs','path'],sourcemap:false,logLevel:'info'});
await build({entryPoints:['src/model.ts'],outfile:'.build/model.mjs',bundle:true,format:'esm',platform:'node',target:'es2022'});
