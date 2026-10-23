import {addIcon,Menu,Notice,setIcon} from 'obsidian';
import type CanvasOutliner from './main';
import {Area,uid,matchesSearch} from './model';

export const VISION_ICON='co-vision-group';
export const VISION_ICON_SVG='<path d="M8 3H5a2 2 0 0 0-2 2v3m13-5h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3m8 0h3a2 2 0 0 0 2-2v-3"/><path d="M6 12s2.2-4 6-4 6 4 6 4-2.2 4-6 4-6-4-6-4Z"/><circle cx="12" cy="12" r="1.5"/>';
export function creationBounds(selected:Omit<Area,'id'|'name'>[],viewport:Omit<Area,'id'|'name'>|null){
 if(!selected.length)return viewport;
 const x=Math.min(...selected.map(n=>n.x)),y=Math.min(...selected.map(n=>n.y));
 return{x,y,width:Math.max(...selected.map(n=>n.x+n.width))-x,height:Math.max(...selected.map(n=>n.y+n.height))-y};
}

/** Independent metadata: never changes native Canvas nodes or their membership. */
export class VisionGroups {
 private wrapper:HTMLElement|null=null;
 private layer:HTMLElement|null=null;
 private toolbar:HTMLElement|null=null;
 private restore:(()=>void)|null=null;
 private resize:ResizeObserver|null=null;
 private frame=0;
 private signature='';
 private cancelDrag:(()=>void)|null=null;
 private path='';
 constructor(private p:CanvasOutliner){
  addIcon(VISION_ICON,'<g transform="scale(4.1666667)" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+VISION_ICON_SVG+'</g>');
  p.addCommand({id:'vision-group-create',name:'Vision Group 만들기',checkCallback:checking=>{if(!this.available())return false;if(!checking)this.createFromSelection();return true;}});
  p.addCommand({id:'vg-vision-toggle',name:'VG Vision ON/OFF',checkCallback:checking=>{if(!this.p.adapter.canvas)return false;if(!checking)this.toggle();return true;}});
  p.register(()=>this.detach());
 }
 private available(){return !!this.p.adapter.canvas&&!!this.p.state()&&!this.p.state()?.presentation;}
 get visible(){return this.p.store.settings.vgVision!==false;}
 toggle(){this.p.store.settings.vgVision=!this.visible;void this.p.save();this.p.renderAll();}
 createFromSelection(){const doc=this.p.document(),ids=new Set(this.p.adapter.selection());if(!doc)return;const rect=creationBounds(doc.nodes.filter(n=>ids.has(n.id)),this.p.adapter.bounds());if(rect)this.create(rect);}
 create(rect:Omit<Area,'id'|'name'>){
  if(!this.available()||![rect.x,rect.y,rect.width,rect.height].every(Number.isFinite)||rect.width<=0||rect.height<=0)return;
  const path=this.p.adapter.file?.path;
  const names=new Set((this.p.state()?.visionGroups??[]).map(a=>a.name));let n=1;while(names.has('Vision Group'+n))n++;
  this.p.prompt('Vision Group 이름','Vision Group'+n,name=>{
   if(this.p.adapter.file?.path!==path||!this.available()){new Notice('Canvas가 바뀌어 Vision Group 생성을 취소했습니다.');return;}
   this.p.change(s=>{(s.visionGroups??=[]).push({...rect,id:uid(),name});});
  });
 }
 renderRows(el:HTMLElement,groups:Area[],query:string){
  let count=0;
  for(const a of groups.filter(a=>!query||matchesSearch(a.name,query))){
   count++;const row=el.createDiv({cls:'co-row co-vision-group-row',attr:{'data-vision-group':a.id}});row.tabIndex=0;
   setIcon(row.createSpan({cls:'co-node-icon'}),VISION_ICON);row.createSpan({cls:'co-label',text:a.name});
   row.onclick=()=>this.p.adapter.fit(a,this.p.store.settings.fitPadding,0);
   row.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();row.click();}};
   row.oncontextmenu=e=>{e.preventDefault();e.stopPropagation();const path=this.p.adapter.file?.path,m=new Menu();
    m.addItem(i=>i.setTitle('Vision Group 이름 변경').setIcon('pencil').onClick(()=>this.p.prompt('Vision Group 이름',a.name,name=>{if(this.p.adapter.file?.path===path)this.p.change(s=>{const target=s.visionGroups?.find(x=>x.id===a.id);if(target)target.name=name;});})));
    m.addItem(i=>i.setTitle('Vision Group 삭제').setIcon('trash').onClick(()=>{if(this.p.adapter.file?.path===path)this.p.change(s=>{s.visionGroups=(s.visionGroups??[]).filter(x=>x.id!==a.id);});}));m.showAtMouseEvent(e);
   };
  }return count;
 }
 render(){
  const wrapper=this.p.adapter.element(),path=this.p.adapter.file?.path??'';
  if(wrapper!==this.wrapper||path!==this.path){this.detach();this.path=path;this.wrapper=wrapper;if(wrapper)this.attach(wrapper);}
  if(!wrapper)return;
  if(this.toolbar){this.toolbar.setAttribute('aria-pressed',String(this.visible));this.toolbar.classList.toggle('is-active',this.visible);setIcon(this.toolbar,this.visible?'eye':'eye-off');}
  const groups=this.p.state()?.visionGroups??[],key=JSON.stringify([groups,this.visible]);
  if(key===this.signature&&this.layer?.isConnected)return;
  this.signature=key;this.layer?.remove();this.layer=null;
  if(!this.visible||!groups.length)return;
  this.layer=wrapper.createDiv({cls:'co-vg-layer'});
  for(const a of groups){const box=this.layer.createDiv({cls:'co-vg-area',attr:{'data-vg-area':a.id}});box.createSpan({cls:'co-vg-name',text:a.name});}
  this.project();
 }
 private schedule=()=>{if(!this.frame)this.frame=requestAnimationFrame(()=>{this.frame=0;this.project();});};
 private project(){const c=this.p.adapter.canvas,b=c?.getViewportBBox?.();if(!b||!this.layer)return;const z=2**c.zoom;for(const a of this.p.state()?.visionGroups??[]){const box=this.layer.querySelector<HTMLElement>('[data-vg-area="'+CSS.escape(a.id)+'"]');if(box)Object.assign(box.style,{left:(a.x-b.minX)*z+'px',top:(a.y-b.minY)*z+'px',width:a.width*z+'px',height:a.height*z+'px'});}}
 private attach(wrapper:HTMLElement){
  const group=wrapper.querySelector('.canvas-controls');if(group){this.toolbar=group.createEl('button',{cls:'canvas-control-item co-vg-toggle',attr:{'aria-label':'Vision Group 표시 전환','data-tooltip-position':'left'}});this.toolbar.onclick=()=>this.toggle();}
  const canvas=wrapper.querySelector('.canvas');
  if(canvas){const observer=new MutationObserver(()=>this.project());observer.observe(canvas,{attributes:true,attributeFilter:['style']});this.restore=()=>observer.disconnect();}
  wrapper.addEventListener('pointerdown',this.startDrag,true);this.resize=new ResizeObserver(this.schedule);this.resize.observe(wrapper);
 }
 private startDrag=(e:PointerEvent)=>{
  if(e.button!==0||!e.ctrlKey||!e.shiftKey||e.altKey||!this.available()||(e.target as HTMLElement).closest('input,textarea,[contenteditable="true"],.canvas-controls'))return;
  const wrapper=this.wrapper,start=this.p.adapter.toCanvas(e),path=this.path;if(!wrapper||!start)return;
  e.preventDefault();e.stopImmediatePropagation();this.cancelDrag?.();
  const ghost=wrapper.createDiv({cls:'co-vg-ghost'});let rect:Omit<Area,'id'|'name'>|null=null;
  wrapper.setPointerCapture(e.pointerId);
  const move=(ev:PointerEvent)=>{const end=this.p.adapter.toCanvas(ev),c=this.p.adapter.canvas,b=c?.getViewportBBox?.();if(!end||!b)return;rect={x:Math.min(start.x,end.x),y:Math.min(start.y,end.y),width:Math.abs(end.x-start.x),height:Math.abs(end.y-start.y)};const z=2**c.zoom;Object.assign(ghost.style,{left:(rect.x-b.minX)*z+'px',top:(rect.y-b.minY)*z+'px',width:rect.width*z+'px',height:rect.height*z+'px'});};
  const cancel=()=>{ghost.remove();wrapper.removeEventListener('pointermove',move);wrapper.removeEventListener('pointerup',up);wrapper.removeEventListener('pointercancel',cancel);document.removeEventListener('keydown',key,true);if(wrapper.hasPointerCapture(e.pointerId))wrapper.releasePointerCapture(e.pointerId);this.cancelDrag=null;};
  const key=(ev:KeyboardEvent)=>{if(ev.key==='Escape'){ev.preventDefault();ev.stopImmediatePropagation();cancel();}};
  const up=(ev:PointerEvent)=>{move(ev);const result=rect;cancel();if(!result||result.width<20||result.height<20||this.path!==path)return;const m=new Menu();m.addItem(i=>i.setTitle('Presentation Group 추가').setIcon('presentation').onClick(()=>{if(this.path===path)this.p.presentation.createArea(result);}));m.addItem(i=>i.setTitle('Vision Group 만들기').setIcon(VISION_ICON).onClick(()=>{if(this.path===path)this.create(result);}));m.showAtMouseEvent(ev);};
  this.cancelDrag=cancel;wrapper.addEventListener('pointermove',move);wrapper.addEventListener('pointerup',up);wrapper.addEventListener('pointercancel',cancel);document.addEventListener('keydown',key,true);
 };
 private detach(){this.cancelDrag?.();this.restore?.();this.restore=null;this.resize?.disconnect();this.resize=null;this.wrapper?.removeEventListener('pointerdown',this.startDrag,true);this.toolbar?.remove();this.toolbar=null;this.layer?.remove();this.layer=null;cancelAnimationFrame(this.frame);this.frame=0;this.signature='';this.wrapper=null;}
}
