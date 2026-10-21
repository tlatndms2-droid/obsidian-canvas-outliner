import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
const bundle=await build({entryPoints:['src/area-selection.ts'],bundle:true,write:false,format:'esm',platform:'node'});
const {AreaSelection,marqueeSelection,resizeArea,numberedAreaName}=await import('data:text/javascript;base64,'+Buffer.from(bundle.outputFiles[0].text).toString('base64'));
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

test('resize keeps opposite corner and clamps minimum size',()=>{const r={x:10,y:20,width:100,height:80};assert.deepEqual(resizeArea(r,'nw',200,200),{x:70,y:60,width:40,height:40});assert.deepEqual(resizeArea(r,'se',30,40),{x:10,y:20,width:130,height:120});assert.equal(r.width,100)});
test('numbered names avoid duplicates and preserve an available requested suffix',()=>{assert.equal(numberedAreaName([]),'Presentation Group1');assert.equal(numberedAreaName(['Presentation Group1']),'Presentation Group2');assert.equal(numberedAreaName(['Presentation Group1','Presentation Group2'],'Presentation Group1'),'Presentation Group3');assert.equal(numberedAreaName(['Custom1'],'Custom'),'Custom2');});

test('normal marquee preserves native handlers, restores cancellation and unhooks',()=>{
 let handlers,nativeMoves=0;const canvas={posFromEvt:e=>e,handleDragWithPan(e,h){handlers=h},handleDragToSelect(e){return this.handleDragWithPan(e,{move(){nativeMoves++},cancel(){}})}};
 const original=canvas.handleDragToSelect,drag=canvas.handleDragWithPan;
 const p={adapter:{canvas,file:{path:'test'}},state:()=>({areas,presentation:false}),store:{settings:{vision:true}}};
 const owner=Object.assign(Object.create(AreaSelection.prototype),{pt:{p},ids:new Set(),normalInitial:new Set(['other']),enabled:false,paint(){}});
 owner.syncNative();canvas.handleDragToSelect({x:125,y:125,shiftKey:true});assert.equal(canvas.handleDragWithPan,drag);handlers.move({x:135,y:135});assert.equal(nativeMoves,1);assert.deepEqual([...owner.ids],['other','outer','inner']);handlers.cancel();assert.deepEqual([...owner.ids],['other']);
 owner.restoreNative();assert.equal(canvas.handleDragToSelect,original);
});
