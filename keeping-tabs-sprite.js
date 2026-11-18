/* keeping-tabs-sprite.js
   Floating "click me" sprite for the homepage. Add ONE line before </body> in index.html:
   <script src="keeping-tabs-sprite.js"></script>
   Needs in the same folder: kt-sprite.webp, kt-sprite-still.png, keeping-tabs.html */
(function(){
  if(window.__ktSprite)return;window.__ktSprite=true;

  /* ---- easy settings ---- */
  var SCALE_DESKTOP=3;       // 3 = 147x129 px (whole numbers keep the pixels sharp)
  var SCALE_MOBILE=2;        // 2 = 98x86 px
  var GAP=0.38;              // gap between the sprite and the intro box, as a fraction of the sprite's width
  var NUDGE_Y=0;             // move up (-) or down (+) in px from the spot at the bottom-left of the intro box
  var FOLLOW_SCROLL=true;    // true = stays on screen while scrolling, false = scrolls away with the page
  var LABEL_Y=0.6;           // label height on the sprite: 0 = top, 1 = bottom (0.6 is about the stomach/feet)
  var LABEL_COLOR='#ff2a2a';
  var LABEL_SIZE=15;         // px
  var LEFT_FALLBACK=14,TOP_FALLBACK=12,TOP_FALLBACK_MOBILE=66; // used when there is no room beside the intro box
  /* ----------------------- */

  var cs=document.currentScript,base=cs&&cs.src?cs.src.replace(/[^\/]*$/,''):'';
  var PAGE=base+'keeping-tabs.html',DATA=base+'keeping-tabs-data.json';
  var reduced=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mobile=function(){return innerWidth<760};
  var PAD=10;

  var F='font-family:"VT323",ui-monospace,Menlo,Consolas,monospace!important;font-weight:400!important;font-style:normal!important;text-transform:none!important;letter-spacing:0!important;-webkit-font-smoothing:none;';
  var css=
  '#kt-sprite{position:fixed;z-index:9999;display:block;padding:'+PAD+'px;line-height:0;text-decoration:none;-webkit-tap-highlight-color:transparent}'+
  '#kt-sprite .kt-in{position:relative;display:block;animation:kt-bob 1.6s ease-in-out infinite}'+
  '#kt-sprite img{display:block;image-rendering:pixelated;image-rendering:crisp-edges;image-rendering:pixelated;transform-origin:50% 100%;animation:kt-wig 5s ease-in-out infinite;transition:filter .2s}'+
  '#kt-sprite:hover .kt-in,#kt-sprite:focus-visible .kt-in{animation-play-state:paused}'+
  '#kt-sprite:hover img,#kt-sprite:focus-visible img{animation:none;transform:scale(1.08);filter:brightness(1.15) drop-shadow(0 0 6px rgba(109,240,207,.7))}'+
  '#kt-sprite:focus-visible{outline:2px solid #6df0cf;outline-offset:-2px}'+
  '#kt-sprite.live img{filter:drop-shadow(0 0 6px #6df0cf)}'+
  '#kt-sprite .kt-sp{position:absolute;width:6px;height:6px;background:#fff;box-shadow:0 0 0 2px rgba(109,240,207,.55);opacity:0;animation:kt-tw 2.4s steps(1,end) infinite;pointer-events:none}'+
  '#kt-sprite .kt-sp.a{top:-2px;right:-6px}'+
  '#kt-sprite .kt-sp.b{top:34%;left:-10px;width:4px;height:4px;animation-delay:.8s;background:#6df0cf}'+
  '#kt-sprite .kt-sp.c{bottom:6px;right:-12px;width:4px;height:4px;animation-delay:1.6s}'+
  /* label: no box, no border, sits on the sprite's body */
  '#kt-sprite .kt-tip{position:absolute;left:50%;transform:translateX(-50%);text-align:center;white-space:nowrap;pointer-events:none;opacity:0;transition:opacity .15s;'+
    'color:'+LABEL_COLOR+'!important;background:none!important;border:0!important;box-shadow:none!important;padding:0!important;margin:0!important;'+F+'font-size:'+LABEL_SIZE+'px!important;line-height:1!important;'+
    'text-shadow:1px 0 #000,-1px 0 #000,0 1px #000,0 -1px #000,1px 1px #000,-1px -1px #000,1px -1px #000,-1px 1px #000}'+
  '#kt-sprite .kt-tip span{display:block;max-width:260px;overflow:hidden;text-overflow:ellipsis;'+F+'}'+
  '#kt-sprite .kt-tip .kt-t{margin-top:2px}'+
  '#kt-sprite:hover .kt-tip,#kt-sprite:focus-visible .kt-tip,#kt-sprite.live .kt-tip{opacity:1}'+
  '@keyframes kt-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}'+
  '@keyframes kt-wig{0%,82%,100%{transform:rotate(0) scale(1)}86%{transform:rotate(-7deg) scale(1.06)}90%{transform:rotate(6deg) scale(1.06)}94%{transform:rotate(-4deg) scale(1.03)}}'+
  '@keyframes kt-tw{0%{opacity:0}20%{opacity:1}40%{opacity:0}100%{opacity:0}}'+
  '@media (prefers-reduced-motion:reduce){#kt-sprite .kt-in,#kt-sprite img,#kt-sprite .kt-sp{animation:none}#kt-sprite .kt-sp{opacity:0}}'+
  '@media print{#kt-sprite{display:none}}';
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

  var a=document.createElement('a');a.id='kt-sprite';a.href=PAGE;
  a.setAttribute('aria-label','Open Keeping Tabs, my live focus tracker');
  var inner=document.createElement('span');inner.className='kt-in';
  var img=document.createElement('img');img.alt='';img.draggable=false;
  img.src=base+(reduced?'kt-sprite-still.png':'kt-sprite.webp');
  inner.appendChild(img);
  ['a','b','c'].forEach(function(c){var s=document.createElement('span');s.className='kt-sp '+c;inner.appendChild(s)});
  var idleText='keeping tabs \u2192';
  var tip=document.createElement('span');tip.className='kt-tip';
  var l1=document.createElement('span');l1.className='kt-l';l1.textContent=idleText;
  var l2=document.createElement('span');l2.className='kt-t';l2.style.display='none';
  tip.appendChild(l1);tip.appendChild(l2);
  inner.appendChild(tip);
  a.appendChild(inner);
  document.body.appendChild(a);

  /* ---- position: beside the bottom-left of the intro box ---- */
  function layout(){
    var sc=mobile()?SCALE_MOBILE:SCALE_DESKTOP,W=49*sc,H=43*sc;
    img.style.width=W+'px';img.style.height=H+'px';
    tip.style.top=Math.round(H*LABEL_Y)+'px';
    var left=null,top=null;
    var pan=document.querySelector('.main-column .pixel-panel')||document.querySelector('.pixel-panel');
    if(!mobile()&&pan){
      var r=pan.getBoundingClientRect();
      var l=r.left-W*GAP-W,t=r.bottom+W*0.1-H/2+NUDGE_Y;
      if(r.width>0&&l>=6){left=l;top=t}
    }
    var abs=!FOLLOW_SCROLL&&left!==null;
    if(left===null){left=LEFT_FALLBACK;top=mobile()?TOP_FALLBACK_MOBILE:TOP_FALLBACK}
    else if(FOLLOW_SCROLL)top+=window.scrollY;           // keep the spot it has at the top of the page
    else top+=window.scrollY;                            // absolute: document coordinates
    a.style.position=abs?'absolute':'fixed';
    a.style.left=Math.round(left-PAD+(abs?window.scrollX:0))+'px';
    a.style.top=Math.round(top-PAD)+'px';
  }
  layout();
  addEventListener('resize',layout);
  addEventListener('load',layout);
  if(window.ResizeObserver){var ro=new ResizeObserver(layout);ro.observe(document.body);var p0=document.querySelector('.pixel-panel');if(p0)ro.observe(p0)}
  setTimeout(layout,600);setTimeout(layout,2000);

  /* ---- live state + timer ---- */
  var runStart=0,tickT=0;
  var pad=function(n){return String(n).padStart(2,'0')};
  function hms(ms){var s=Math.max(0,Math.floor(ms/1000));return pad(Math.floor(s/3600))+':'+pad(Math.floor(s/60)%60)+':'+pad(s%60)}
  function tick(){if(runStart)l2.textContent=hms(Date.now()-runStart)}
  function setLive(name,start){
    var live=!!name;a.classList.toggle('live',live);
    clearInterval(tickT);
    if(live){runStart=start;l1.textContent='focusing: '+name;l2.style.display='block';tick();tickT=setInterval(tick,1000)}
    else{runStart=0;l1.textContent=idleText;l2.style.display='none'}
  }
  function poll(){
    if(document.hidden)return;
    fetch(DATA+'?t='+Date.now(),{cache:'no-store'}).then(function(r){return r.ok?r.json():null}).then(function(j){
      var s=j&&(j.state||j);
      if(s&&s.run&&Array.isArray(s.tabs)&&Date.now()-s.run.start<12*3600e3){
        var t=s.tabs.filter(function(x){return x.id===s.run.id})[0];
        setLive(t?String(t.name):null,s.run.start);
      }else setLive(null);
    }).catch(function(){setLive(null)});
  }
  poll();setInterval(poll,120000);
  document.addEventListener('visibilitychange',function(){if(!document.hidden)poll()});
})();
