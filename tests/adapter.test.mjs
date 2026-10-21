import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
const bundle=await build({entryPoints:['src/adapter.ts'],bundle:true,write:false,format:'esm',platform:'node',plugins:[{name:'obsidian-test',setup(b){b.onResolve({filter:/^obsidian$/},()=>({path:'obsidian',namespace:'stub'}));b.onLoad({filter:/.*/,namespace:'stub'},()=>({contents:'export class TFile {}'}));}}]});
const {CanvasAdapter}=await import('data:text/javascript;base64,'+Buffer.from(bundle.outputFiles[0].text).toString('base64'));
const leaf=id=>({id,view:{getViewType:()=> 'canvas',canvas:{id}}});
test('closed active pane falls back to last used surviving Canvas, not enumeration order',()=>{const a=leaf('a'),b=leaf('b'),c=leaf('c'),adapter=new CanvasAdapter({});adapter.activate(a);adapter.activate(c);adapter.activate(b);adapter.reconcileLeaves([a,c]);assert.equal(adapter.leaf,c);assert.equal(adapter.canvas.id,'c');});
test('layout change preserves an open selected pane; closing all clears stale canvas',()=>{const a=leaf('a'),b=leaf('b'),adapter=new CanvasAdapter({});adapter.activate(a);adapter.activate(b);adapter.reconcileLeaves([a,b]);assert.equal(adapter.leaf,b);adapter.reconcileLeaves([]);assert.equal(adapter.canvas,null);assert.equal(adapter.leaf,null);});

