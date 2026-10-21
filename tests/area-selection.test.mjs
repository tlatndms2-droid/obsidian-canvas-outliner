import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
const bundle=await build({entryPoints:['src/area-selection.ts'],bundle:true,write:false,format:'esm',platform:'node'});
const {marqueeSelection}=await import('data:text/javascript;base64,'+Buffer.from(bundle.outputFiles[0].text).toString('base64'));
const areas=[{id:'outer',x:0,y:0,width:300,height:300},{id:'inner',x:100,y:100,width:50,height:50},{id:'other',x:400,y:0,width:100,height:100}];
test('partial overlap includes enclosing and nested PT areas',()=>{
 assert.deepEqual([...marqueeSelection(areas,{x:125,y:125,width:10,height:10},new Set(),'replace')],['outer','inner']);
});
test('add and subtract preserve unrelated selected areas and never mutate input',()=>{
 const initial=new Set(['other']);const box={x:125,y:125,width:10,height:10};
 const added=marqueeSelection(areas,box,initial,'add');
 assert.deepEqual([...added],['other','outer','inner']);assert.deepEqual([...initial],['other']);
 assert.deepEqual([...marqueeSelection(areas,box,added,'subtract')],['other']);
});
test('empty replace clears while empty subtract preserves',()=>{
 const box={x:-100,y:-100,width:10,height:10},initial=new Set(['inner']);
 assert.equal(marqueeSelection(areas,box,initial,'replace').size,0);
 assert.deepEqual([...marqueeSelection(areas,box,initial,'subtract')],['inner']);
});
