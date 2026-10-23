import test from 'node:test';import assert from 'node:assert/strict';import {promises as fs} from 'node:fs';import os from 'node:os';import path from 'node:path';import {build} from 'esbuild';
const b=await build({entryPoints:['src/storage.ts'],bundle:true,write:false,format:'esm',platform:'node'});const {SettingsFile}=await import('data:text/javascript;base64,'+Buffer.from(b.outputFiles[0].text).toString('base64'));
const old={version:1,canvases:{},settings:{label:'preserve'}},next={...old,settings:{label:'next'}};
async function fixture(t){const dir=await fs.mkdtemp(path.join(os.tmpdir(),'outliner-storage-'));t.after(()=>fs.rm(dir,{recursive:true,force:true}));return dir;}
test('truncated current recovers full backup and preserves corrupt bytes',async t=>{const dir=await fixture(t),raw='{"version":1,"canvases":';await fs.writeFile(path.join(dir,'data.json'),raw);await fs.writeFile(path.join(dir,'data.backup.json'),JSON.stringify(old));const r=await new SettingsFile(dir).load();assert.equal(r.recovered,true);assert.deepEqual(r.data,old);const bad=(await fs.readdir(dir)).find(x=>x.startsWith('data.corrupt-'));assert.equal(await fs.readFile(path.join(dir,bad),'utf8'),raw);assert.deepEqual(JSON.parse(await fs.readFile(path.join(dir,'data.json'))),old);});
test('partial temporary write cannot damage current or backup',async t=>{const dir=await fixture(t);await new SettingsFile(dir).save(old);const io={...fs,writeFile:async(p,raw,enc)=>fs.writeFile(p,String(raw).slice(0,9),enc)};await assert.rejects(new SettingsFile(dir,io).save(next));assert.deepEqual(JSON.parse(await fs.readFile(path.join(dir,'data.json'))),old);});
test('failed replacement keeps current intact; retry saves without creating a backup',async t=>{const dir=await fixture(t);await new SettingsFile(dir).save(old);const io={...fs,rename:async(a,b)=>{if(b.endsWith('/data.json')||b.endsWith('\\data.json'))throw Error('injected rename failure');return fs.rename(a,b)}};await assert.rejects(new SettingsFile(dir,io).save(next));assert.deepEqual(JSON.parse(await fs.readFile(path.join(dir,'data.json'))),old);await new SettingsFile(dir).save(next);assert.deepEqual(JSON.parse(await fs.readFile(path.join(dir,'data.json'))),next);await assert.rejects(fs.readFile(path.join(dir,'data.backup.json')),/ENOENT/);});
test('two invalid copies are preserved and load fails closed',async t=>{const dir=await fixture(t);for(const f of ['data.json','data.backup.json'])await fs.writeFile(path.join(dir,f),'broken');await assert.rejects(new SettingsFile(dir).load());assert.equal(await fs.readFile(path.join(dir,'data.json'),'utf8'),'broken');});
test('recovery preserves incomplete UTF-8 bytes exactly',async t=>{const dir=await fixture(t),bytes=Buffer.from([123,34,120,34,58,34,0xed,0x95]);await fs.writeFile(path.join(dir,'data.json'),bytes);await fs.writeFile(path.join(dir,'data.backup.json'),JSON.stringify(old));await new SettingsFile(dir).load();const bad=(await fs.readdir(dir)).find(x=>x.startsWith('data.corrupt-'));assert.deepEqual(await fs.readFile(path.join(dir,bad)),bytes);});
test('Unchanged save writes nothing and unchanged validated JSON is not parsed again',async t=>{
 const dir=await fixture(t),file=new SettingsFile(dir);await file.save(old);
 let writes=0;const io={...fs,writeFile:async(...args)=>{writes++;return fs.writeFile(...args)}};
 const cached=new SettingsFile(dir,io);await cached.load();await cached.save(old);await cached.save(old);
 assert.equal(writes,0);
});
test('Save freezes its contents before its first asynchronous read',async t=>{
 const dir=await fixture(t);await new SettingsFile(dir).save(old);
 let release;const gate=new Promise(r=>release=r);let first=true;
 const io={...fs,readFile:async(...args)=>{if(first){first=false;await gate;}return fs.readFile(...args)}};
 const file=new SettingsFile(dir,io),data=JSON.parse(JSON.stringify(next)),pending=file.save(data);
 data.settings.label='mutated after save call';release();await pending;
 assert.equal(JSON.parse(await fs.readFile(path.join(dir,'data.json'),'utf8')).settings.label,'next');
});
test('External valid or corrupt replacements are preserved, including backup',async t=>{
 const dir=await fixture(t),file=new SettingsFile(dir);await file.save(old);
 const foreign=JSON.stringify({...next,settings:{label:'external'}});
 await fs.writeFile(path.join(dir,'data.json'),foreign);
 await assert.rejects(file.save(next),/changed externally/);
 assert.equal(await fs.readFile(path.join(dir,'data.json'),'utf8'),foreign);
 await fs.writeFile(path.join(dir,'data.json'),'corrupt external data');
 await assert.rejects(file.save(next));
 assert.equal(await fs.readFile(path.join(dir,'data.json'),'utf8'),'corrupt external data');
});
test('Replacement during temporary write is detected before overwriting current file',async t=>{
 const dir=await fixture(t);await new SettingsFile(dir).save(old);
 const foreign=JSON.stringify({...old,settings:{label:'concurrent external'}});
 const io={...fs,writeFile:async(p,...args)=>{const result=await fs.writeFile(p,...args);if(p.includes('data.json.')&&p.endsWith('.tmp'))await fs.writeFile(path.join(dir,'data.json'),foreign);return result}};
 const file=new SettingsFile(dir,io);await file.load();
 await assert.rejects(file.save(next),/changed externally during save/);
 assert.equal(await fs.readFile(path.join(dir,'data.json'),'utf8'),foreign);
 await assert.rejects(fs.readFile(path.join(dir,'data.backup.json')),/ENOENT/);
});
test('Failed cached save can retry without creating a backup',async t=>{
 const dir=await fixture(t);let fail=false;
 const io={...fs,rename:async(a,b)=>{if(fail&&b===path.join(dir,'data.json'))throw Error('fail');return fs.rename(a,b)}};
 const file=new SettingsFile(dir,io);await file.save(old);fail=true;
 await assert.rejects(file.save(next));fail=false;await file.save(next);
 assert.deepEqual(JSON.parse(await fs.readFile(path.join(dir,'data.json'),'utf8')),next);
 await assert.rejects(fs.readFile(path.join(dir,'data.backup.json')),/ENOENT/);
});
test('Invalid in-memory store cannot touch a valid file',async t=>{
 const dir=await fixture(t),file=new SettingsFile(dir);await file.save(old);
 await assert.rejects(file.save({...old,version:99}));
 assert.deepEqual(JSON.parse(await fs.readFile(path.join(dir,'data.json'),'utf8')),old);
});
test('An external deletion after load is not silently recreated',async t=>{
 const dir=await fixture(t),file=new SettingsFile(dir);await file.save(old);
 await fs.unlink(path.join(dir,'data.json'));
 await assert.rejects(file.save(next),/changed externally/);
 await assert.rejects(fs.readFile(path.join(dir,'data.json')),/ENOENT/);
});
test('Cached saves avoid JSON parsing while external changes are still parsed',async t=>{
 const {runInNewContext}=await import('node:vm');
 const code=await build({entryPoints:['src/storage.ts'],bundle:true,write:false,format:'cjs',platform:'node'});
 const module={exports:{}};let parses=0;
 runInNewContext(code.outputFiles[0].text,{module,exports:module.exports,crypto,JSON:{parse:raw=>{parses++;return JSON.parse(raw)},stringify:JSON.stringify},require:id=>id==='fs'?{promises:fs}:{join:path.join}});
 const dir=await fixture(t);await fs.writeFile(path.join(dir,'data.json'),JSON.stringify(old));
 const file=new module.exports.SettingsFile(dir);await file.load();assert.equal(parses,1);
 await file.save(old);await file.save(next);await file.save(next);assert.equal(parses,1);
 await fs.writeFile(path.join(dir,'data.json'),'external invalid');
 await assert.rejects(file.save(old));assert.equal(parses,2);
});
test('A custom serializer cannot replace the validated store structure',async t=>{
 const dir=await fixture(t),file=new SettingsFile(dir);await file.save(old);
 await assert.rejects(file.save({...old,toJSON:()=>null}),/Custom settings serializers/);
 await assert.rejects(file.save({...old,settings:{toJSON:()=>false}}),/Custom settings serializers/);
 assert.deepEqual(JSON.parse(await fs.readFile(path.join(dir,'data.json'),'utf8')),old);
});

test('Changed saves write only the current file and leave a legacy backup untouched',async t=>{
 const dir=await fixture(t),legacy=JSON.stringify({...old,settings:{label:'legacy backup'}});
 await fs.writeFile(path.join(dir,'data.backup.json'),legacy);
 const writes=[];const io={...fs,writeFile:async(p,...args)=>{writes.push(path.basename(p));return fs.writeFile(p,...args)}};
 const file=new SettingsFile(dir,io);await file.save(old);await file.save(next);
 assert.equal(writes.length,2);assert.ok(writes.every(name=>name.startsWith('data.json.')&&name.endsWith('.tmp')));
 assert.equal(await fs.readFile(path.join(dir,'data.backup.json'),'utf8'),legacy);
 const loaded=await new SettingsFile(dir).load();assert.equal(loaded.recovered,false);assert.deepEqual(loaded.data,next);
});
test('A fresh installation persists changed settings across reload without any backup',async t=>{
 const dir=await fixture(t),file=new SettingsFile(dir);await file.load();await file.save(old);await file.save(next);
 assert.deepEqual((await new SettingsFile(dir).load()).data,next);
 assert.deepEqual(await fs.readdir(dir),['data.json']);
});
