import {promises as fs} from 'fs';
import {join} from 'path';
import {Store} from './model';

export function parseStore(raw:string):Store {
 const value=JSON.parse(raw);
 if(value?.version!==1||!value.canvases||typeof value.canvases!=='object'||Array.isArray(value.canvases)||!value.settings||typeof value.settings!=='object')throw Error('Invalid Canvas Outliner settings');
 return value;
}

// Never truncate the only current copy. A failed write/read/rename leaves it intact.
export class SettingsFile {
 constructor(private dir:string,private io=fs){}
 private async read(name:string){try{return await this.io.readFile(join(this.dir,name),'utf8')}catch(e){if((e as NodeJS.ErrnoException).code==='ENOENT')return null;throw e;}}
 private async replace(name:string,raw:string){
  const target=join(this.dir,name),temp=target+'.'+crypto.randomUUID()+'.tmp';
  try{await this.io.writeFile(temp,raw,'utf8');if(await this.io.readFile(temp,'utf8')!==raw)throw Error('Settings temporary write verification failed');parseStore(raw);await this.io.rename(temp,target);}
  finally{await this.io.unlink(temp).catch(()=>{});}
 }
 async load():Promise<{data:Store|null;recovered:boolean}>{
  const raw=await this.read('data.json');
  if(raw!==null){try{return{data:parseStore(raw),recovered:false}}catch{}}
  const backup=await this.read('data.backup.json');
  if(backup===null){if(raw===null)return{data:null,recovered:false};throw Error('Settings and recovery backup unavailable');}
  const data=parseStore(backup);
  if(raw!==null)await this.io.copyFile(join(this.dir,'data.json'),join(this.dir,'data.corrupt-'+Date.now()+'-'+crypto.randomUUID()+'.json'));
  await this.replace('data.json',backup);
  return{data,recovered:true};
 }
 async save(data:Store){
  const raw=JSON.stringify(data),previous=await this.read('data.json');parseStore(raw);
  if(previous!==null){parseStore(previous);if(previous===raw)return;await this.replace('data.backup.json',previous);}
  await this.replace('data.json',raw);
 }
}
