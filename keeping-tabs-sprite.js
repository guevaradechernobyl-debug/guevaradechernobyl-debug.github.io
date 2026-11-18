/* keeping-tabs-sprite.js
   Drop-in floating sprite for the homepage. Add ONE line before </body> in index.html:
   <script src="keeping-tabs-sprite.js"></script>
   Needs these files in the same folder: kt-sprite.webp, kt-sprite-still.png, keeping-tabs.html */
(function(){
  if(window.__ktSprite)return;window.__ktSprite=true;
  var cs=document.currentScript,base=cs&&cs.src?cs.src.replace(/[^\/]*$/,''):'';
  var PAGE=base+'keeping-tabs.html',DATA=base+'keeping-tabs-data.json';
  var SCALE=2,W=49*SCALE,H=43*SCALE,PAD=14,EDGE=14;
  var reduced=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

  var css='#kt-sprite{position:fixed;left:0;bottom:'+(EDGE-PAD)+'px;z-index:9999;padding:'+PAD+'px;display:block;line-height:0;text-decoration:none;will-change:transform;-webkit-tap-highlight-color:transparent}'+
  '#kt-sprite img{display:block;width:'+W+'px;height:'+H+'px;image-rendering:pixelated;image-rendering:crisp-edges;image-rendering:pixelated;transition:filter .3s}'+
  '#kt-sprite.flip img{transform:scaleX(-1)}'+
  '#kt-sprite:hover img,#kt-sprite:focus-visible img{filter:drop-shadow(0 0 0 #fff) brightness(1.15)}'+
  '#kt-sprite:focus-visible{outline:2px solid #6df0cf;outline-offset:-4px}'+
  '#kt-sprite.live img{filter:drop-shadow(0 0 6px #6df0cf);animation:kt-pulse 1.6s ease-in-out infinite}'+
  '@keyframes kt-pulse{50%{filter:drop-shadow(0 0 12px #6df0cf)}}'+
  '#kt-sprite .kt-tip{position:absolute;bottom:100%;left:50%;margin-bottom:-6px;white-space:nowrap;line-height:1;font:18px/1 "VT323",ui-monospace,Menlo,Consolas,monospace;color:#6df0cf;background:#050608;border:2px solid #2f9e8a;box-shadow:3px 3px 0 #000;padding:5px 9px;opacity:0;pointer-events:none;transition:opacity .15s;max-width:70vw;overflow:hidden;text-overflow:ellipsis}'+
  '#kt-sprite:hover .kt-tip,#kt-sprite:focus-visible .kt-tip,#kt-sprite.live .kt-tip{opacity:1}'+
  '@media (prefers-reduced-motion:reduce){#kt-sprite.live img{animation:none}}'+
  '@media print{#kt-sprite{display:none}}';
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

  var a=document.createElement('a');a.id='kt-sprite';a.href=PAGE;
  a.setAttribute('aria-label','Open Keeping Tabs, my live focus tracker');
  var tip=document.createElement('span');tip.className='kt-tip';tip.textContent='keeping tabs \u2192';
  var img=document.createElement('img');img.alt='';img.width=W;img.height=H;img.draggable=false;
  img.src=base+(reduced?'kt-sprite-still.png':'kt-sprite.webp');
  a.appendChild(tip);a.appendChild(img);
  document.body.appendChild(a);

  var boxW=W+PAD*2,x=Math.random()*200+20,dir=1,hover=false,pauseUntil=0,nextPause=0,live=false,last=0,idleText='keeping tabs \u2192';
  var maxX=function(){return Math.max(0,innerWidth-boxW-EDGE)};
  a.addEventListener('mouseenter',function(){hover=true});a.addEventListener('mouseleave',function(){hover=false});
  a.addEventListener('focus',function(){hover=true});a.addEventListener('blur',function(){hover=false});

  function place(){
    a.style.transform='translateX('+Math.round(x)+'px)';
    a.classList.toggle('flip',dir<0);
    var tw=tip.offsetWidth,left=x+boxW/2-tw/2,dx=Math.max(0,6-left)-Math.max(0,left+tw-(innerWidth-6));
    tip.style.transform='translateX(calc(-50% + '+Math.round(dx)+'px))';
  }
  function frame(t){
    var dt=last?Math.min(0.1,(t-last)/1000):0;last=t;
    if(!hover&&!document.hidden){
      if(t<pauseUntil){}
      else{
        if(!nextPause)nextPause=t+6000+Math.random()*6000;
        if(t>nextPause){pauseUntil=t+2000+Math.random()*2500;nextPause=0}
        else{
          x+=dir*(live?64:24)*dt;var m=maxX();
          if(x>=m){x=m;dir=-1}else if(x<=0){x=0;dir=1}
        }
      }
    }
    place();requestAnimationFrame(frame);
  }
  if(reduced){x=maxX();dir=-1;place();addEventListener('resize',function(){x=maxX();place()})}
  else{requestAnimationFrame(frame);addEventListener('resize',function(){x=Math.min(x,maxX())})}

  function setLive(name){
    live=!!name;a.classList.toggle('live',live);
    tip.textContent=live?('focusing: '+name):idleText;
    place();
  }
  function poll(){
    if(document.hidden)return;
    fetch(DATA+'?t='+Date.now(),{cache:'no-store'}).then(function(r){return r.ok?r.json():null}).then(function(j){
      var s=j&&(j.state||j);
      if(s&&s.run&&Array.isArray(s.tabs)&&Date.now()-s.run.start<12*3600e3){
        var t=s.tabs.filter(function(x){return x.id===s.run.id})[0];
        setLive(t?String(t.name).slice(0,28):null);
      }else setLive(null);
    }).catch(function(){setLive(null)});
  }
  poll();setInterval(poll,120000);
  document.addEventListener('visibilitychange',function(){if(!document.hidden)poll()});
})();
