// KYU music generator — original, copyright-free (shared by editor.html)
let SR=48000;
function rng(seed){let a=seed>>>0||1; return ()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const STY={
  lofi:{name:'로파이',bpm:[70,88],inst:['ep','piano','pluck'],swing:[0.12,0.2],
    drums:[{n:'붐뱁',k:'x.........x.....',s:'....x.......x...',h:'x.x.x.x.x.x.x.x.'},{n:'느린 셔플',k:'x......x..x.....',s:'....x.......x..x',h:'x.xxx.x.x.xxx.x.'},{n:'재지',k:'x..x......x.x...',s:'....x.......x...',h:'..x...x...x...x.'},{n:'하프타임',k:'x...............',s:'........x.......',h:'x.x.x.x.x.x.x.x.'}],
    comp:['x...............','x.....x.........','x.......x.......','..x.......x.....'],bass:['x.......x.......','x.....x...x.....','x..........x....']},
  bright:{name:'밝은 팝',bpm:[104,124],inst:['pluck','ep','piano'],swing:[0,0.05],
    drums:[{n:'포 온 더 플로어',k:'x...x...x...x...',s:'....x.......x...',h:'..x...x...x...x.'},{n:'팝 그루브',k:'x.....x.x.......',s:'....x.......x...',h:'xxxxxxxxxxxxxxxx'},{n:'박수 팝',k:'x...x...x...x..x',s:'....x..x....x...',h:'x.x.x.x.x.x.x.x.'},{n:'싱코페이션',k:'x..x..x...x.....',s:'....x.......x...',h:'x.xxx.xxx.xxx.xx'}],
    comp:['x.x.x.x.x.x.x.x.','x..x..x.x..x..x.','..x...x...x...x.','x...x...x...x...'],bass:['x...x...x...x...','x..x..x.x..x....','x.x.x.x.x.x.x.x.']},
  piano:{name:'피아노',bpm:[60,84],inst:['piano'],swing:[0,0.08],
    drums:[{n:'드럼 없이',k:'',s:'',h:''},{n:'부드러운 셰이커',k:'',s:'',h:'..x...x...x...x.'},{n:'잔잔한 비트',k:'x.......x.......',s:'....x.......x...',h:''}],
    comp:['x.x.x.x.x.x.x.x.','x...x...x...x...','x..x..x.x..x..x.','xxxxxxxxxxxxxxxx'],bass:['x...............','x.......x.......']},
  latin:{name:'라틴 리듬',bpm:[88,108],inst:['pluck','ep'],swing:[0,0.04],
    drums:[{n:'뎀보 (레게톤)',k:'x...x...x...x...',s:'...x..x....x..x.',h:'x.x.x.x.x.x.x.x.'},{n:'쿰비아',k:'x.......x.......',s:'....x.......x...',h:'xxx.xxx.xxx.xxx.'},{n:'보사노바',k:'x..x.x..x..x.x..',s:'x..x..x...x..x..',h:'x.x.x.x.x.x.x.x.',rim:1},{n:'살사 클라베',k:'x.......x.......',s:'x..x..x...x.x...',h:'x.xxx.xxx.xxx.xx',rim:1}],
    comp:['x..x..x.x..x..x.','..x...x...x...x.','x.x..x.x..x.x..x','x...x...x...x...'],bass:['x..x....x..x....','x.....x.x.....x.','x...x...x...x...']},
  kpop:{name:'K-팝 느낌',bpm:[116,132],inst:['pluck','ep'],swing:[0,0.03],
    drums:[{n:'댄스',k:'x...x...x...x...',s:'....x.......x...',h:'x.xxx.xxx.xxx.xx'},{n:'트랩 하프타임',k:'x......x..x.....',s:'........x.......',h:'xxxxxxxxxxxxxxxx'},{n:'퓨처 베이스',k:'x..x..x...x.....',s:'....x.......x...',h:'x.x.x.x.x.x.x.x.'},{n:'뉴잭스윙',k:'x..x..x.x.......',s:'....x..x....x...',h:'x.xxx.x.x.xxx.x.'}],
    comp:['x..x..x...x..x..','x.x.x.x.x.x.x.x.','..x...x...x...x.','x.......x.......'],bass:['x..x..x.x.......','x.x.x.x.x.x.x.x.','x...x...x...x...']}
};
const PROGS=[[0,4,5,3],[5,3,0,4],[0,5,1,4],[3,4,2,5],[0,3,4,3],[5,4,3,4],[1,4,0,5],[0,2,3,4]];
const MINPROGS=[[0,5,2,6],[0,3,4,0],[0,5,3,4],[0,6,5,6]], MIN=[0,2,3,5,7,8,10];
const MAJ=[0,2,4,5,7,9,11], KEYS=['C','D♭','D','E♭','E','F','G♭','G','A♭','A','B♭','B'];
const INAME={ep:'일렉 피아노',piano:'피아노',pluck:'플럭'};
const mf=m=>440*Math.pow(2,(m-69)/12);
export function genMusic(style,seed,dur,opt={},sr=48000){ SR=sr;
  const R=rng(seed*7919+style.length*131+7), st=STY[style]||STY.lofi, pick=a=>a[Math.floor(R()*a.length)];
  const BR=opt.bpm||st.bpm, bpm=Math.round(BR[0]+R()*(BR[1]-BR[0])), beat=60/bpm, s16=beat/4;
  const key=Math.floor(R()*12), root=48+key-(key>6?12:0), prog=opt.minor?pick(MINPROGS):pick(PROGS), SC=opt.minor?MIN:MAJ;
  const nd=st.drums.length, sd=Math.abs(seed|0), dr=st.drums[sd%nd], dr2=st.drums[(sd+1+Math.floor(R()*(nd-1)))%nd], comp=st.comp[Math.floor(sd/nd)%st.comp.length], bassP=st.bass[(sd+Math.floor(sd/nd))%st.bass.length], inst=st.inst[(sd+Math.floor(R()*2))%st.inst.length];
  const swing=st.swing[0]+R()*(st.swing[1]-st.swing[0]), melDen=0.25+R()*0.45, voicing=R()<0.5?[0,2,4,6]:[0,2,4,7];
  const L=Math.round(SR*dur), y=new Float32Array(L);
  const note=(deg,oct)=>root+12*oct+SC[((deg%7)+7)%7]+12*Math.floor(deg/7);
  const T=(bar,step)=>bar*beat*4+step*s16+(step%2?swing*s16*2:0);
  const tone=(t0,d,f,amp,kind)=>{const a=Math.round(t0*SR); if(a>=L||a<0) return; const n=Math.min(L-a,Math.round((d+0.6)*SR));
    if(kind==='pluck'){const P=Math.max(2,Math.round(SR/f)), b=new Float32Array(P); for(let i=0;i<P;i++) b[i]=R()*2-1; let p=0;
      for(let i=0;i<n;i++){const v=b[p], nx=b[(p+1)%P]; b[p]=(v+nx)*0.4985; y[a+i]+=v*amp*(i<d*SR?1:Math.exp(-(i-d*SR)/(SR*0.05))); p=(p+1)%P} return}
    for(let i=0;i<n;i++){const t=i/SR; let v, env;
      if(kind==='ep'){env=Math.min(1,t*200)*Math.exp(-t*1.6)*(t<d?1:Math.exp(-(t-d)*12)); v=(Math.sin(2*Math.PI*f*t)+0.25*Math.sin(4*Math.PI*f*t)*Math.exp(-t*6))*(1+0.08*Math.sin(2*Math.PI*4.5*t))}
      else if(kind==='piano'){env=Math.min(1,t*500)*Math.exp(-t*2.4)*(t<d?1:Math.exp(-(t-d)*10)); v=Math.sin(2*Math.PI*f*t)+0.5*Math.sin(4*Math.PI*f*t)*Math.exp(-t*3)+0.2*Math.sin(6*Math.PI*f*t)*Math.exp(-t*5)}
      else if(kind==='pad'){env=Math.min(1,t/0.4)*(t<d?1:Math.exp(-(t-d)*4)); v=Math.sin(2*Math.PI*f*t)+0.5*Math.sin(2*Math.PI*f*1.004*t)+0.3*Math.sin(4*Math.PI*f*t)}
      else {env=Math.min(1,t*300)*(t<d?Math.exp(-t*1.2):Math.exp(-(t-d)*20)); v=Math.sin(2*Math.PI*f*t)+0.3*Math.sin(4*Math.PI*f*t)}
      y[a+i]+=v*env*amp}};
  const drum=(t0,kind,amp)=>{const a=Math.round(t0*SR); if(a>=L||a<0) return; const n=Math.min(L-a,Math.round(SR*0.35));
    for(let i=0;i<n;i++){const t=i/SR; let v=0;
      if(kind==='kick') v=Math.sin(2*Math.PI*(45*t+(110/18)*(1-Math.exp(-t*18))))*Math.exp(-t*9);
      else if(kind==='snare') v=(R()*2-1)*0.7*Math.exp(-t*16)+Math.sin(2*Math.PI*190*t)*0.5*Math.exp(-t*25);
      else if(kind==='clap') v=(R()*2-1)*(Math.exp(-t*30)+(t>0.012?0.6*Math.exp(-(t-0.012)*25):0));
      else if(kind==='hat') v=(R()*2-1)*Math.exp(-t*90);
      else if(kind==='rim') v=Math.sin(2*Math.PI*1700*t)*Math.exp(-t*60);
      y[a+i]+=v*amp}};
  const on=(p,i)=>p&&p[i]==='x';
  const loud={lofi:[0.5,0.18,0.05],bright:[0.45,0.2,0.06],piano:[0.25,0.08,0.03],latin:[0.5,0.2,0.05],kpop:[0.55,0.22,0.06]}[style]||[0.5,0.2,0.05];
  const snareKind=style==='bright'||style==='kpop'&&R()<0.5?'clap':'snare';
  const instAmp={ep:0.09,piano:0.1,pluck:0.12}[inst], bars=Math.ceil(dur/(beat*4))+1;
  let mel=4;
  for(let b=0;b<bars;b++){const deg=prog[b%4], chord=voicing.map(v=>deg+v), D=(b%8>=4)?dr2:dr, intro=b<1, fill=b%8===7;
    // chords
    if(style!=='piano'&&R()<0.6) chord.slice(0,3).forEach(c=>tone(T(b,0),beat*4,mf(note(c,1)),0.03,'pad'));
    for(let i=0;i<16;i++) if(on(comp,i)){
      if(inst==='pluck'||style==='piano') tone(T(b,i)+0.002,s16*1.6,mf(note(chord[i%chord.length],style==='piano'?(i%4===0?0:1):2)),instAmp*(style==='piano'?1:0.9),inst==='pluck'?'pluck':inst);
      else chord.forEach((c,j)=>tone(T(b,i)+j*0.012,s16*(comp.indexOf('x',i+1)>0?comp.indexOf('x',i+1)-i:16-i)*0.95,mf(note(c,1)),instAmp,inst))}
    // bass
    for(let i=0;i<16;i++) if(on(bassP,i)) tone(T(b,i),s16*2.5,mf(note(i>=8&&R()<0.3?deg+4:deg,-1)),0.2,'bass');
    // drums (variation every 4 bars, fill every 8)
    if(!intro) for(let i=0;i<16;i++){
      if(on(D.k,i)) drum(T(b,i),'kick',loud[0]);
      if(on(D.s,i)) drum(T(b,i),D.rim?'rim':snareKind,D.rim?0.13:loud[1]);
      if(on(D.h,i)) drum(T(b,i),'hat',loud[2]*(i%4===0?1:0.7));
      if(fill&&i>=12&&(style!=='piano')) drum(T(b,i)+s16/2,'snare',loud[1]*0.6)}
    // melody
    for(let i=0;i<16;i+=2) if(R()<melDen*0.35){mel=Math.max(2,Math.min(11,mel+[-2,-1,1,1,2][Math.floor(R()*5)])); tone(T(b,i),s16*(R()<0.5?2:4),mf(note([0,1,2,4,5,7,8,9,11,12,14,15][mel],1)),0.05,style==='piano'?'piano':(inst==='pluck'?'ep':'piano'))}
  }
  if(style==='lofi'){let a=0; for(let i=0;i<L;i++){a+=0.35*(y[i]-a); y[i]=a} const R2=rng(seed); for(let i=0;i<L;i+=Math.floor(SR*0.03+R2()*SR*0.2)) y[i]+=(R2()*2-1)*0.08}
  let pk=0; for(let i=0;i<L;i++) pk=Math.max(pk,Math.abs(y[i]));
  const fi=SR*1, fo=SR*2.5; for(let i=0;i<L;i++) y[i]=y[i]/(pk||1)*0.85*Math.min(1,i/fi,(L-i)/fo);
  return {buf:y,info:`${st.name} · ${dr.n}${dr2!==dr?' + '+dr2.n:''} · ${INAME[inst]} · ${bpm} BPM · ${KEYS[key]}${opt.minor?' 단조':''}`};
}



export const MOODS=[
  {k:/fantasm|espant|sangre|halloween|miedo|terror|noche más larga|귀신|무서/g,style:'lofi',minor:true,drum:3,bpm:[64,72],why:'귀신·밤 이야기 → 미스터리한 단조 로파이'},
  {k:/\bamar\b|amor|te amo|사랑|pienso en ti|corazón|enamor/g,style:'piano',minor:false,drum:1,bpm:[64,74],why:'사랑 이야기 → 잔잔한 피아노'},
  {k:/comida|restaurante|buffet|platillo|comes?\b|comer|sopa|fonda|cocina|김치|한식|wones|precio/g,style:'latin',minor:false,drum:1,bpm:[92,100],why:'음식·식당 이야기 → 신나는 쿰비아'},
  {k:/viaje|seúl|ciudad|letrero|tienda|turista|capital|calle|barrio/g,style:'bright',minor:false,drum:1,bpm:[104,112],why:'여행·장소 이야기 → 밝은 팝'},
  {k:/fighting|화이팅|k-?pop|idol|drama|gringo|inglés|selfie|laptop/g,style:'kpop',minor:false,drum:0,bpm:[118,124],why:'유행어·말장난 → K-팝 댄스'},
  {k:/palabra|significa|coreano|dilo conmigo|pronuncia|carácter|antiguo|sílaba/g,style:'lofi',minor:false,drum:0,bpm:[76,86],why:'한국어 설명 → 차분한 로파이'}];

export const STYLES=Object.fromEntries(Object.entries(STY).map(([k,v])=>[k,v.name]));
export function moodOf(text){ const low=(text||'').toLowerCase(); if(!low.trim()) return null; let best=null,bs=0;
  MOODS.forEach((m,i)=>{ const n=(low.match(m.k)||[]).length*(i<2?1.5:1); if(n>bs){bs=n;best=m} }); return best||MOODS[MOODS.length-1] }
