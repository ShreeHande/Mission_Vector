
/* Mission: Vector original procedural audio. No sampled or copyrighted soundtrack. */
(()=> {
'use strict';
const AudioContextClass=window.AudioContext||window.webkitAudioContext;
if(!AudioContextClass)return;
let ctx,master,musicGain,sfxGain,voices=[],playing=false,musicOn=false,sfxOn=true;
let musicVolume=.25,sfxVolume=.35,interval=null,step=0,opened=false,scene='control';
const frequencies=[110,164.81,220,293.66,329.63,440,493.88,587.33];
function init(){
 if(ctx)return;
 ctx=new AudioContextClass();
 master=ctx.createGain();master.gain.value=.8;master.connect(ctx.destination);
 musicGain=ctx.createGain();musicGain.gain.value=0;musicGain.connect(master);
 sfxGain=ctx.createGain();sfxGain.gain.value=sfxVolume;sfxGain.connect(master);
}
function tone(freq,start,duration,volume=.09,wave='sine',dest){
 if(!ctx)return;
 const o=ctx.createOscillator(),g=ctx.createGain();
 o.type=wave;o.frequency.setValueAtTime(freq,start);
 g.gain.setValueAtTime(.0001,start);
 g.gain.exponentialRampToValueAtTime(Math.max(.0002,volume),start+Math.min(.9,duration*.3));
 g.gain.exponentialRampToValueAtTime(.0001,start+duration);
 o.connect(g);g.connect(dest||musicGain);
 o.start(start);o.stop(start+duration+.02);
}

const moods={
 control:{roots:[110,98,130.81,87.31],duration:5.4,interval:4200,pad:.015,lead:.024,bass:.012},
 launch:{roots:[110,130.81,146.83,164.81],duration:3.5,interval:2400,pad:.024,lead:.045,bass:.033},
 space:{roots:[87.31,98,110,130.81],duration:6.8,interval:5200,pad:.019,lead:.030,bass:.015}
};
function phrase(){
 if(!ctx||!musicOn)return;
 const m=moods[scene],now=ctx.currentTime+.05;
 const root=m.roots[Math.floor(step/2)%m.roots.length];
 // All notes are original procedural composition; no recordings or sampled film score.
 [1,1.5,2,2.5].forEach((ratio,i)=>tone(root*ratio,now,m.duration,m.pad/(1+i*.35),'sine'));
 tone(root/2,now,m.duration*.8,m.bass,'triangle');
 tone(root*[2,2.5,3,2.25,3,2.5,2,1.5][step%8],now+.3,m.duration*.65,m.lead,'triangle');
 if(scene==='launch'){
  tone(root*4,now+.5,.45,.022,'triangle');
  tone(root*2,now+1.15,.5,.025,'triangle');
 }
 step++;
}
function setScene(next){
 if(!moods[next]||scene===next)return;
 scene=next;step=0;
 if(musicOn){clearInterval(interval);phrase();interval=setInterval(phrase,moods[scene].interval);}
 updateUI();
}
function startMusic(){
 init();ctx.resume();
 if(musicOn)return;
 musicOn=true;
 musicGain.gain.setTargetAtTime(musicVolume,ctx.currentTime,.8);
 phrase();interval=setInterval(phrase,moods[scene].interval);
 updateUI();
}
function stopMusic(){
 musicOn=false;
 if(interval){clearInterval(interval);interval=null;}
 if(ctx)musicGain.gain.setTargetAtTime(0,ctx.currentTime,.25);
 updateUI();
}
function sound(kind){
 if(!sfxOn)return;
 init();ctx.resume();
 const t=ctx.currentTime+.01;
 if(kind==='launch'){
  tone(130,t,.45,.09,'sawtooth',sfxGain);
  tone(195,t+.16,.5,.055,'triangle',sfxGain);
 }else if(kind==='warning'){
  tone(310,t,.16,.045,'square',sfxGain);
  tone(260,t+.21,.2,.045,'square',sfxGain);
 }else{
  tone(540,t,.075,.025,'sine',sfxGain);
  tone(770,t+.07,.12,.018,'sine',sfxGain);
 }
}
function updateUI(){
 const toggle=document.querySelector('#mv-music-toggle');
 if(toggle){toggle.textContent=musicOn?'♫ MUSIC ON':'♫ MUSIC OFF';toggle.setAttribute('aria-pressed',String(musicOn));}
 const mode=document.querySelector('#mv-audio-mode');if(mode)mode.textContent=({control:'MISSION CONTROL',launch:'LAUNCH SEQUENCE',space:'DEEP SPACE'}[scene]);
 const sfx=document.querySelector('#mv-sfx-toggle');
 if(sfx){sfx.textContent=sfxOn?'SFX ON':'SFX OFF';sfx.setAttribute('aria-pressed',String(sfxOn));}
}
function mount(){
 if(document.querySelector('#mv-audio-controls'))return;
 const panel=document.createElement('aside');
 panel.id='mv-audio-controls';
 panel.setAttribute('aria-label','Audio settings');
 panel.innerHTML=`<button type="button" id="mv-audio-open" aria-expanded="false" aria-controls="mv-audio-panel">♫ AUDIO</button>
 <div id="mv-audio-panel" hidden>
 <div class="mv-audio-title">MISSION AUDIO <span id="mv-audio-mode">MISSION CONTROL</span></div>
 <div class="mv-audio-row"><button type="button" id="mv-music-toggle" aria-pressed="false">♫ MUSIC OFF</button><label>MUSIC <input id="mv-music-volume" type="range" min="0" max="100" value="25" aria-label="Music volume"></label></div>
 <div class="mv-audio-row"><button type="button" id="mv-sfx-toggle" aria-pressed="true">SFX ON</button><label>EFFECTS <input id="mv-sfx-volume" type="range" min="0" max="100" value="35" aria-label="Effects volume"></label></div>
 <p>Music starts only when enabled. Settings are for this session.</p></div>`;
 document.body.appendChild(panel);
 const details=panel.querySelector('#mv-audio-panel');
 panel.querySelector('#mv-audio-open').addEventListener('click',()=>{
  opened=!opened;details.hidden=!opened;panel.querySelector('#mv-audio-open').setAttribute('aria-expanded',String(opened));
 });
 panel.querySelector('#mv-music-toggle').addEventListener('click',()=>musicOn?stopMusic():startMusic());
 panel.querySelector('#mv-sfx-toggle').addEventListener('click',()=>{sfxOn=!sfxOn;updateUI();});
 panel.querySelector('#mv-music-volume').addEventListener('input',e=>{
  musicVolume=Number(e.target.value)/100;
  if(ctx&&musicOn)musicGain.gain.setTargetAtTime(musicVolume,ctx.currentTime,.08);
 });
 panel.querySelector('#mv-sfx-volume').addEventListener('input',e=>{
  sfxVolume=Number(e.target.value)/100;
  if(ctx)sfxGain.gain.setTargetAtTime(sfxVolume,ctx.currentTime,.08);
 });
 // Existing game actions remain untouched. Only augment user-initiated sounds.
 document.addEventListener('click',e=>{
  if(e.target.closest('#mv-audio-controls'))return;
  const b=e.target.closest('button');
  if(!b||b.disabled)return;
  const action=b.dataset.action||'';
  if(action==='launch'||action==='retry')setScene('launch');
  else if(action==='results')setScene('space');
  else if(action==='arcade'||action==='startArcade')setScene('launch');
  else if(action==='home'||action==='missions'||action==='designer'||action==='briefing'||action==='guide'||action==='archive')setScene('control');
  sound(action==='launch'?'launch':action==='results'?'warning':'click');
 },true);
 // Mission selection cards and launch results update the music, not game state.
 document.addEventListener('click',e=>{
  if(e.target.closest('[data-mission]'))setScene('control');
 },true);
 updateUI();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);
else mount();
document.addEventListener('visibilitychange',()=>{
 if(!ctx)return;
 if(document.hidden)ctx.suspend();
 else if(musicOn)ctx.resume();
});
})();
