import {build} from 'esbuild';
import test from 'node:test';
import assert from 'node:assert/strict';
const built=await build({entryPoints:['src/identity.ts'],bundle:true,write:false,format:'esm',platform:'node'});
const {CanvasIdentity}=await import('data:text/javascript;base64,'+Buffer.from(built.outputFiles[0].text).toString('base64'));
const clone=structuredClone;
const state=name=>({registered:['n'],collections:[{id:'c',name,parent:null,refs:[{kind:'node',id:'n'}]}],steps:[{id:'step',kind:'node',target:'n'}],areas:[],current:'step',presentation:false,meta:{},custom:{},snapshot:null});
function harness(){let store={version:1,canvases:{A:state('A'),B:state('B')},settings:{}},disk=clone(store),calls=0,failAt=0,failWrite=false;
 const doc={nodes:[{id:'n',type:'text',text:'same',x:0,y:0,width:100,height:100}],edges:[]},files={A:clone(doc),B:clone(doc)};
 const io={store:()=>store,read:async p=>clone(files[p]),save:async()=>{if(++calls===failAt)throw Error('save failure');disk=clone(store)},write:async(p,prev,id)=>{if(failWrite)throw Error('write failure');const current=files[p].canvasOutliner?.id??null;assert.ok(current===prev||current===id);files[p].canvasOutliner={version:1,id};return clone(files[p]);}};
 return {files,get store(){return store},get disk(){return disk},manager:()=>new CanvasIdentity(io),crash(){store=clone(disk)},failSaveAfter(n){failAt=calls+n},failWrite(v){failWrite=v}};
}
test('legacy known identical files keep own configurations and get distinct identities',async()=>{
 const h=harness(),m=h.manager();await m.ensure('A');await m.ensure('B');assert.notEqual(h.files.A.canvasOutliner.id,h.files.B.canvasOutliner.id);assert.equal(h.store.canvases.A.collections[0].name,'A');assert.equal(h.store.canvases.B.collections[0].name,'B');
});
test('external copies resolve by identity after content changes and remain independent',async()=>{
 const h=harness(),m=h.manager();await m.ensure('A');await m.ensure('B');h.files.C=clone(h.files.B);h.files.C.nodes[0].text='edited before plugin sees copy';await m.ensure('C');assert.equal(h.store.canvases.C.collections[0].name,'B');assert.notEqual(h.files.C.canvasOutliner.id,h.files.B.canvasOutliner.id);h.store.canvases.C.collections[0].name='copy';assert.equal(h.store.canvases.B.collections[0].name,'B');assert.equal(h.files.C.nodes[0].text,'edited before plugin sees copy');
});
for(const point of ['journal','canvas','commit'])test('restart recovery after '+point+' failure',async()=>{
 const h=harness(),m=h.manager();await m.ensure('A');h.files.C=clone(h.files.A);
 if(point==='journal')h.failSaveAfter(1);else if(point==='canvas')h.failWrite(true);else h.failSaveAfter(2);
 await assert.rejects(m.ensure('C'));assert.equal(h.store.canvases.C,undefined);assert.equal(h.store.canvases.A.collections[0].name,'A');
 h.crash();h.failWrite(false);const resumed=h.manager();await resumed.ensure('C');assert.equal(h.store.canvases.C.collections[0].name,'A');assert.notEqual(h.files.C.canvasOutliner.id,h.files.A.canvasOutliner.id);assert.deepEqual(h.store.identityTransfers,{});assert.deepEqual(h.store,h.disk);
});
test('native exact source bypasses ambiguous content and assigns new identity',async()=>{
 const h=harness(),m=h.manager();await m.ensure('A');await m.ensure('B');h.files.C=clone(h.files.A);await m.ensure('C',clone(h.store.canvases.B));assert.equal(h.store.canvases.C.collections[0].name,'B');assert.notEqual(h.files.C.canvasOutliner.id,h.files.B.canvasOutliner.id);
});
test('unknown foreign identity is never guessed; simultaneous copies get unique identities',async()=>{
 const h=harness(),m=h.manager();await m.ensure('A');h.files.C=clone(h.files.A);h.files.D=clone(h.files.A);await Promise.all([m.ensure('C'),m.ensure('D')]);assert.notEqual(h.files.C.canvasOutliner.id,h.files.D.canvasOutliner.id);h.files.X=clone(h.files.A);h.files.X.canvasOutliner.id='unknown';await assert.rejects(m.ensure('X'),/식별 실패/);assert.equal(h.store.canvases.X,undefined);
});
