import {readFile} from 'node:fs/promises';
import {transform} from 'esbuild';
import test from 'node:test';
import assert from 'node:assert/strict';
const {code}=await transform(await readFile(new URL('../src/copy.ts',import.meta.url),'utf8'),{loader:'ts',format:'esm'});
const {observeCopies}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
const file=(path,extension='canvas')=>({path,extension});
const setup=(copy)=>{const states={A:{name:'A'},B:{name:'B'}},errors=[];
 const host={copy};const hook=observeCopies(host,{normalize:p=>p.replaceAll('\\','/'),capture:f=>structuredClone(states[f.path]),complete:async(f,s)=>{states[f.path]=s;},error:e=>errors.push(e)});return {host,hook,states,errors};};
test('concurrent copies retain source-at-start and isolate configuration',async()=>{
 const finish={};const t=setup((f,p)=>new Promise(r=>finish[p]=()=>r(file(p))));
 const a=t.host.copy(file('A'),'a'),b=t.host.copy(file('B'),'b');t.states.A.name='changed';
 finish.b();await b;finish.a();await a;
 assert.equal(t.states.a.name,'A');assert.equal(t.states.b.name,'B');t.states.a.name='copy';assert.equal(t.states.A.name,'changed');assert.equal(t.hook.pending.size,0);
});
test('native failure clears pending and does not create configuration',async()=>{
 const t=setup(async()=>{throw Error('native failure')});await assert.rejects(t.host.copy(file('A'),'failed'),/native failure/);assert.equal(t.states.failed,undefined);assert.equal(t.hook.pending.size,0);
});
test('same destination collision cannot steal another source',async()=>{
 let finish;const t=setup((f,p)=>new Promise(r=>finish=()=>r(file(p))));const a=t.host.copy(file('A'),'same');await assert.rejects(t.host.copy(file('B'),'same'),/already in progress/);finish();await a;assert.equal(t.states.same.name,'A');
});
test('unload restores previous hook; later wrapper remains and bypasses inactive observer',async()=>{
 let calls=0;const original=async(f,p)=>{calls++;return file(p,f.extension)};const t=setup(original);const wrapped=t.host.copy;const later=async(...args)=>wrapped(...args);t.host.copy=later;t.hook.dispose();assert.equal(t.host.copy,later);await t.host.copy(file('A'),'after');assert.equal(t.states.after,undefined);assert.equal(calls,1);
 const u=setup(original);u.hook.dispose();assert.equal(u.host.copy,original);
});
test('unload during native copy completes the already captured configuration',async()=>{
 let finish;const t=setup((f,p)=>new Promise(r=>finish=()=>r(file(p))));const a=t.host.copy(file('A'),'a');t.hook.dispose();finish();await a;assert.equal(t.states.a.name,'A');assert.equal(t.hook.pending.size,0);
});
test('configuration failure is reported without pretending native file copy failed',async()=>{
 const errors=[],host={copy:async(f,p)=>file(p)};const hook=observeCopies(host,{normalize:p=>p,capture:()=>null,complete:async()=>{throw Error('save failed')},error:e=>errors.push(e)});
 assert.equal((await host.copy(file('A'),'a')).path,'a');assert.match(errors[0].message,/save failed/);assert.equal(hook.pending.size,0);
});
test('non Canvas copy retains receiver and native behavior',async()=>{
 const t=setup(async function(f,p){assert.equal(this,t.host);return file(p,f.extension)});await t.host.copy(file('note','md'),'note2');assert.equal(t.states.note2,undefined);
});
