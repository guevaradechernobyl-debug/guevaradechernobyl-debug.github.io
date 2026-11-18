/* keeping-tabs-sprite.js
   Floating "click me" sprite for the homepage. Add ONE line before </body> in index.html:
   <script src="keeping-tabs-sprite.js"></script>
   Needs in the same folder: kt-sprite.webp, kt-sprite-still.png, keeping-tabs.html */
(function(){
  if(window.__ktSprite)return;window.__ktSprite=true;

  /* ---- easy settings ---- */
  var SCALE_DESKTOP=3;       // big screens: 3 = 147x129 px (whole numbers keep the pixels sharp)
  var SCALE_SMALL=2;         // used when there is less room beside the intro box
  var SCALE_MOBILE=2;        // phones: 2 = 98x86 px
  var GAP=0.38;              // gap between the sprite and the intro box, as a fraction of the sprite's width
  var NUDGE_Y=0;             // move up (-) or down (+) in px from the spot at the bottom-left of the intro box
  var FOLLOW_SCROLL=true;    // true = stays on screen while scrolling, false = scrolls away with the page
  var LABEL_Y=0.6;           // label height on the sprite: 0 = top, 1 = bottom
  var TEXT_COLOR='#ffffff';  // label text
  var TIMER_COLOR='#ffd426'; // timer
  var LABEL_SIZE=14;         // px
  var LABEL_FONT='"Pixelify Sans","VT323",ui-monospace,Menlo,Consolas,monospace';
  var PHONE_BELOW=760;       // screens narrower than this use the corner spot
  var CORNER=12;             // px from the right/bottom edge in the corner spot
  /* ----------------------- */

  var cs=document.currentScript,base=cs&&cs.src?cs.src.replace(/[^\/]*$/,''):'';
  var PAGE=base+'keeping-tabs.html',DATA=base+'keeping-tabs-data.json';
  var reduced=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var PAD=12;

  var F='font-family:'+LABEL_FONT+'!important;font-weight:400!important;font-style:normal!important;text-transform:none!important;letter-spacing:0!important;';
  var css=
  '#kt-sprite{position:fixed;z-index:9999;display:block;padding:'+PAD+'px;line-height:0;text-decoration:none;-webkit-tap-highlight-color:transparent;touch-action:manipulation}'+
  '#kt-sprite .kt-in{position:relative;display:block;animation:kt-bob 1.6s ease-in-out infinite}'+
  '#kt-sprite img{display:block;image-rendering:pixelated;image-rendering:crisp-edges;image-rendering:pixelated;transform-origin:50% 100%;animation:kt-wig 5s ease-in-out infinite;transition:transform .15s}'+
  '#kt-sprite:hover .kt-in,#kt-sprite:focus-visible .kt-in{animation-play-state:paused}'+
  '#kt-sprite:hover img,#kt-sprite:focus-visible img{animation:none;transform:scale(1.08)}'+
  '#kt-sprite:focus-visible{outline:2px solid #fff;outline-offset:-2px}'+
  '#kt-sprite .kt-sp{position:absolute;width:6px;height:6px;background:#fff;opacity:0;animation:kt-tw 2.4s steps(1,end) infinite;pointer-events:none}'+
  '#kt-sprite .kt-sp.a{top:-2px;right:-6px}'+
  '#kt-sprite .kt-sp.b{top:34%;left:-10px;width:4px;height:4px;animation-delay:.8s;background:'+TIMER_COLOR+'}'+
  '#kt-sprite .kt-sp.c{bottom:6px;right:-12px;width:4px;height:4px;animation-delay:1.6s}'+
  /* label: no box, no border, sits on the sprite's body */
  '#kt-sprite .kt-tip{position:absolute;left:50%;transform:translateX(-50%);text-align:center;white-space:nowrap;pointer-events:none;opacity:0;transition:opacity .15s;'+
    'background:none!important;border:0!important;box-shadow:none!important;padding:0!important;margin:0!important;'+F+'font-size:'+LABEL_SIZE+'px!important;line-height:1!important;'+
    'text-shadow:1px 1px 0 #000}'+
  '#kt-sprite .kt-tip span{display:block;max-width:min(260px,calc(100vw - 24px));overflow:hidden;text-overflow:ellipsis;'+F+'}'+
  '#kt-sprite .kt-l{color:'+TEXT_COLOR+'!important}'+
  '#kt-sprite .kt-t{color:'+TIMER_COLOR+'!important;margin-top:3px}'+
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

  /* keep the label inside the screen */
  function clampTip(){
    tip.style.transform='translateX(-50%)';
    var r=tip.getBoundingClientRect(),dx=0,vw=document.documentElement.clientWidth||innerWidth;
    if(r.width){if(r.left<6)dx=6-r.left;else if(r.right>vw-6)dx=vw-6-r.right}
    if(dx)tip.style.transform='translateX(calc(-50% + '+Math.round(dx)+'px))';
  }

  /* ---- position ---- */
  function size(sc){img.style.width=(49*sc)+'px';img.style.height=(43*sc)+'px';tip.style.top=Math.round(43*sc*LABEL_Y)+'px'}
  function layout(){
    var pan=document.querySelector('.main-column .pixel-panel')||document.querySelector('.pixel-panel');
    var placed=false;
    if(innerWidth>=PHONE_BELOW&&pan){
      var r=pan.getBoundingClientRect();
      [SCALE_DESKTOP,SCALE_SMALL].some(function(sc){
        var W=49*sc,H=43*sc,l=r.left-W*GAP-W;
        if(r.width>0&&l>=6){
          size(sc);
          var t=r.bottom+W*0.1-H/2+NUDGE_Y,abs=!FOLLOW_SCROLL;
          a.style.position=abs?'absolute':'fixed';
          a.style.right='auto';a.style.bottom='auto';
          a.style.left=Math.round(l-PAD+(abs?scrollX:0))+'px';
          a.style.top=Math.round(t+scrollY-PAD)+'px';
          placed=true;return true;
        }
        return false;
      });
    }
    if(!placed){            /* phones and narrow windows: bottom-right corner, clear of the notch/home bar */
      size(SCALE_MOBILE);
      a.style.position='fixed';a.style.left='auto';a.style.top='auto';
      a.style.right='calc('+(CORNER-PAD)+'px + env(safe-area-inset-right,0px))';
      a.style.bottom='calc('+(CORNER-PAD)+'px + env(safe-area-inset-bottom,0px))';
    }
    clampTip();
  }
  layout();
  addEventListener('resize',layout);
  addEventListener('load',layout);
  if(window.ResizeObserver){var ro=new ResizeObserver(layout);ro.observe(document.body);var p0=document.querySelector('.pixel-panel');if(p0)ro.observe(p0)}
  setTimeout(layout,600);setTimeout(layout,2000);

  /* hide while the mobile menu drawer is open */
  var aside=document.querySelector('aside');
  function syncHidden(){a.style.display=(aside&&aside.classList.contains('open'))?'none':'block'}
  if(aside&&window.MutationObserver){new MutationObserver(syncHidden).observe(aside,{attributes:true,attributeFilter:['class']});syncHidden()}

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
    clampTip();
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
