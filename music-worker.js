import {genMusic} from './music.js';
self.onmessage=e=>{ const {id,style,seed,dur,opt,sr}=e.data; const r=genMusic(style,seed,dur,opt,sr); self.postMessage({id,buf:r.buf,info:r.info},[r.buf.buffer]) };
