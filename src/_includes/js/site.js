(function(){
  var root=document.documentElement;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Page-load sequence (homepage hero only) */
  if(!reduce&&document.querySelector('.headline')){
    root.classList.add('anim');
    var start=function(){requestAnimationFrame(function(){requestAnimationFrame(function(){root.classList.add('go')})})};
    if(document.fonts&&document.fonts.ready){Promise.race([document.fonts.ready,new Promise(function(r){setTimeout(r,300)})]).then(start)}else{start()}
  }

  /* Header: transparent over hero, solid after */
  var hdr=document.getElementById('hdr'),hero=document.getElementById('hero'),pill=document.getElementById('pill');
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(e){
      var past=!e[0].isIntersecting;
      hdr.classList.toggle('solid',past);
      pill.classList.toggle('show',past);
    },{rootMargin:'-140px 0px 0px 0px'}).observe(hero);
  }

  /* Portrait ring draws when it comes into view */
  var por=document.getElementById('portrait');
  if(por){
    if('IntersectionObserver' in window){
      var po=new IntersectionObserver(function(e){if(e[0].isIntersecting){por.classList.add('seen');po.disconnect()}},{threshold:.4});
      po.observe(por);
    }else{por.classList.add('seen')}
  }

  /* Mobile menu */
  var btn=document.getElementById('menuBtn');
  function setMenu(open){
    hdr.classList.toggle('open',open);
    btn.setAttribute('aria-expanded',open);
    btn.setAttribute('aria-label',open?'Close menu':'Open menu');
    document.body.style.overflow=open?'hidden':'';
  }
  btn.addEventListener('click',function(){setMenu(!hdr.classList.contains('open'))});
  document.querySelectorAll('#nav a').forEach(function(a){a.addEventListener('click',function(){setMenu(false)})});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')setMenu(false)});

  /* Testimonials */
  var qs=[].slice.call(document.querySelectorAll('.quote')),i=0,count=document.getElementById('count');
  function show(n){qs[i].classList.remove('on');i=(n+qs.length)%qs.length;qs[i].classList.add('on');count.textContent=(i+1)+' / '+qs.length}
  if(qs.length){
    document.getElementById('prev').addEventListener('click',function(){show(i-1)});
    document.getElementById('next').addEventListener('click',function(){show(i+1)});
  }

  /* FAQ smooth open/close */
  document.querySelectorAll('.qa details').forEach(function(d){
    var s=d.querySelector('summary'),a=d.querySelector('.ans'),busy=false;
    s.addEventListener('click',function(e){
      if(reduce||!a.animate)return;
      e.preventDefault(); if(busy)return; busy=true;
      if(d.open){
        var h=a.offsetHeight;
        var an=a.animate([{height:h+'px',opacity:1},{height:'0px',opacity:0}],{duration:450,easing:'cubic-bezier(.19,1,.22,1)'});
        an.onfinish=function(){d.open=false;busy=false};
      }else{
        d.open=true; var h2=a.offsetHeight;
        var an2=a.animate([{height:'0px',opacity:0},{height:h2+'px',opacity:1}],{duration:600,easing:'cubic-bezier(.19,1,.22,1)'});
        an2.onfinish=function(){busy=false};
      }
    });
  });
})();
