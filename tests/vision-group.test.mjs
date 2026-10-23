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
test('Previous overlay converts once, preserves its ID and does not resurrect a deleted native group',()=>{
 const {VisionGroups}=module.exports,groups=[{id:'saved-vg',name:'기존 그룹',x:10,y:20,width:300,height:200}],state={visionGroups:groups},nodes=new Map();let imports=0,saves=0;
 const canvas={nodes,importData(doc){imports++;for(const d of doc.nodes)nodes.set(d.id,{getData:()=>d});},requestSave(){}};
 const owner=Object.create(VisionGroups.prototype);owner.p={state:()=>state,adapter:{canvas},save:()=>{saves++;return Promise.resolve();},store:{settings:{}}};
 owner.syncNative();owner.syncNative();
 assert.equal(imports,1);assert.equal(groups[0].native,true);assert.equal(groups[0].id,'saved-vg');
 nodes.clear();owner.syncNative();assert.equal(imports,1);
});
test('Native group position and label become the saved Vision Group information',()=>{
 const {VisionGroups}=module.exports,a={id:'vg',name:'이전',x:0,y:0,width:100,height:100,native:true},state={visionGroups:[a]};
 const d={label:'변경',x:50,y:-25,width:500,height:250};
 const owner=Object.create(VisionGroups.prototype);owner.p={state:()=>state,adapter:{canvas:{nodes:new Map([['vg',{getData:()=>d}]])}},save:()=>Promise.resolve(),store:{settings:{}}};
 owner.syncNative();
 assert.deepEqual({x:a.x,y:a.y,width:a.width,height:a.height,name:a.name},{x:50,y:-25,width:500,height:250,name:'변경'});
});
test('Vision Group drag excludes implicit contents while ordinary group drag retains them',()=>{
 const {independentVisionDrag}=module.exports,box={minX:0,minY:0,maxX:300,maxY:200};
 const vg={id:'vg',getData:()=>({type:'group'}),getBBox:()=>box},normal={...vg,id:'normal'},card={id:'card'};
 const get=function(){assert.equal(this,c);return [card]},c={selection:new Set([vg]),getContainingNodes:get};
 assert.deepEqual(independentVisionDrag(c,new Set(['vg']),()=>Array.from(c.getContainingNodes(box))),[]);
 assert.equal(c.getContainingNodes,get);
 c.selection=new Set([normal]);
 assert.equal(independentVisionDrag(c,new Set(['vg']),()=>c.getContainingNodes(box))[0],card);
 c.selection=new Set([vg,normal]);
 assert.equal(independentVisionDrag(c,new Set(['vg']),()=>c.getContainingNodes(box))[0],card);
});
test('Drag starts from an unselected Vision Group and restores containment after failure',()=>{
 const {independentVisionDrag}=module.exports,box={minX:0,minY:0,maxX:100,maxY:100};
 const vg={id:'vg',getData:()=>({type:'group'}),getBBox:()=>box},original=()=>['card'],c={selection:new Set(),getContainingNodes:original};
 assert.throws(()=>independentVisionDrag(c,new Set(['vg']),()=>{assert.equal(c.getContainingNodes(box).length,0);throw Error('native failure');},vg),/native failure/);
 assert.equal(c.getContainingNodes,original);
});
