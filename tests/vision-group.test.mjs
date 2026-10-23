import {test} from 'node:test';
import assert from 'node:assert/strict';
import {buildSync} from 'esbuild';
import vm from 'node:vm';
const code=buildSync({entryPoints:['src/vision-group.ts'],bundle:true,write:false,platform:'node',format:'cjs',external:['obsidian']}).outputFiles[0].text;
const module={exports:{}};vm.runInNewContext(code,{module,exports:module.exports,require:()=>({})});
const {creationBounds}=module.exports;
test('Vision Group shortcut wraps only selected card bounds without changing them',()=>{
 const nodes=[{x:-20,y:30,width:80,height:50},{x:150,y:-40,width:70,height:120}],before=JSON.stringify(nodes);
 assert.equal(JSON.stringify(creationBounds(nodes,null)),JSON.stringify({x:-20,y:-40,width:240,height:120}));
 assert.equal(JSON.stringify(nodes),before);
});
test('No selection uses exactly the visible viewport, including negative coordinates',()=>{
 const viewport={x:-300,y:-500,width:900,height:700};
 assert.equal(creationBounds([],viewport),viewport);assert.equal(creationBounds([],null),null);
});
