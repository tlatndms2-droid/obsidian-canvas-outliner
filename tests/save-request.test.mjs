import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {buildSync} from 'esbuild';
const code=buildSync({entryPoints:['src/main.ts'],bundle:true,write:false,platform:'node',format:'cjs',external:['obsidian']}).outputFiles[0].text;
const module={exports:{}},stub=class{};
vm.runInNewContext(code,{module,exports:module.exports,crypto:globalThis.crypto,TextEncoder,require:id=>id==='obsidian'?{Plugin:stub,ItemView:stub,Modal:stub,PluginSettingTab:stub}:id==='fs'?{}:id==='path'?{join:(...a)=>a.join('/')}:{}});
const Plugin=module.exports.default;
test('Unchanged related file signatures do not schedule another save',async()=>{
 const p=Object.create(Plugin.prototype),bytes='same content',hash=Buffer.from(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(bytes))).toString('hex');
 const meta={fileSignature:hash,updated:123};
 p.store={canvases:{c:{snapshot:{nodes:[{id:'a',file:'a.md'}]},meta:{a:meta}}}};
 p.fileSignatures=new Map();p.app={vault:{cachedRead:async()=>bytes}};let saves=0,renders=0;
 p.save=()=>{saves++;return Promise.resolve()};p.renderAll=()=>renders++;
 await p.fileChanged({extension:'md',path:'a.md'});assert.equal(saves,0);assert.equal(renders,0);assert.equal(meta.updated,123);
 p.app.vault.cachedRead=async()=>'new content';
 await p.fileChanged({extension:'md',path:'a.md'});assert.equal(saves,1);assert.equal(renders,1);assert.notEqual(meta.updated,123);
});
test('Initial signature records once without falsely marking a file edited',async()=>{
 const p=Object.create(Plugin.prototype),meta={updated:null};
 p.store={canvases:{c:{snapshot:{nodes:[{id:'a',file:'a.md'}]},meta:{a:meta}}}};
 p.fileSignatures=new Map();p.app={vault:{cachedRead:async()=>'first'}};let saves=0;
 p.save=()=>{saves++;return Promise.resolve()};p.renderAll=()=>assert.fail('initial hash is not an edit');
 await p.fileChanged({extension:'md',path:'a.md'},true);await p.fileChanged({extension:'md',path:'a.md'},true);
 assert.equal(saves,1);assert.equal(meta.updated,null);
});
test('One active save and one latest pending save remain bounded and await completion',async()=>{
 const p=Object.create(Plugin.prototype);p.store={value:1};p.saveQueue=Promise.resolve();p.scheduledSave=null;p.corrupt=false;
 let release;const gate=new Promise(r=>release=r),snapshots=[];
 p.settingsFile={save:async data=>{snapshots.push(JSON.stringify(data));if(snapshots.length===1)await gate;}};
 const first=p.save();await Promise.resolve();await Promise.resolve();assert.equal(snapshots.length,1);let completed=false;const pending=[];
 for(let i=2;i<=101;i++){p.store.value=i;pending.push(p.save());}
 pending.at(-1).then(()=>completed=true);await Promise.resolve();
 assert.equal(snapshots.length,1);assert.equal(completed,false);
 release();await Promise.all([first,...pending]);
 assert.deepEqual(snapshots,[JSON.stringify({value:1}),JSON.stringify({value:101})]);assert.equal(completed,true);
});

