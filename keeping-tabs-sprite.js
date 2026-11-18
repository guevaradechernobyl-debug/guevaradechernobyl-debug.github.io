/* keeping-tabs-sprite.js
   Floating "click me" sprite for the homepage. Add ONE line before </body> in index.html:
   <script src="keeping-tabs-sprite.js"></script>
   Needs in the same folder: kt-sprite.webp, kt-sprite-still.png, keeping-tabs.html */
(function(){
  if(window.__ktSprite)return;window.__ktSprite=true;

  /* ---- easy settings ---- */
  var LEFT=14;              // px from the left edge
  var TOP_DESKTOP=12;       // px from the top on desktop
  var TOP_MOBILE=66;        // px from the top on phones (sits under your mobile top bar)
  var SCALE_DESKTOP=3;      // 3 = 147x129 px (whole numbers keep the pixels sharp)
  var SCALE_MOBILE=2;       // 2 = 98x86 px
  /* ----------------------- */

  var cs=document.currentScript,base=cs&&cs.src?cs.src.replace(/[^\/]*$/,''):'';
  var PAGE=base+'keeping-tabs.html',DATA=base+'keeping-tabs-data.json';
  var reduced=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mobile=function(){return innerWidth<760};
  var PAD=10;

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
  '#kt-sprite .kt-tip{position:absolute;top:100%;left:'+PAD+'px;margin-top:-4px;white-space:nowrap;line-height:1;font:18px/1 "VT323",ui-monospace,Menlo,Consolas,monospace;color:#6df0cf;background:#050608;border:2px solid #2f9e8a;box-shadow:3px 3px 0 #000;padding:5px 9px;opacity:0;pointer-events:none;transition:opacity .15s;max-width:calc(100vw - 40px);overflow:hidden;text-overflow:ellipsis}'+
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
  var tip=document.createElement('span');tip.className='kt-tip';tip.textContent=idleText;
  a.appendChild(inner);a.appendChild(tip);
  document.body.appendChild(a);

  function layout(){
    var sc=mobile()?SCALE_MOBILE:SCALE_DESKTOP;
    img.style.width=(49*sc)+'px';img.style.height=(43*sc)+'px';
    a.style.left=(LEFT-PAD)+'px';
    a.style.top=((mobile()?TOP_MOBILE:TOP_DESKTOP)-PAD)+'px';
  }
  layout();addEventListener('resize',layout);

  function setLive(name){
    var live=!!name;a.classList.toggle('live',live);
    tip.textContent=live?('focusing: '+name):idleText;
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
