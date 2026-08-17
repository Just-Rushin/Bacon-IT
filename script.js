(function(){
  "use strict";

  /* ---------- THEME ---------- */
  var root = document.documentElement;
  var stored = localStorage.getItem('bacon-it-theme');
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var initial = stored || (prefersDark ? 'dark' : 'light');
  root.setAttribute('data-theme', initial);

  document.getElementById('themeToggle').addEventListener('click', function(){
    var current = root.getAttribute('data-theme');
    var next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('bacon-it-theme', next);
  });

  /* ---------- MOBILE NAV ---------- */
  var navToggle = document.getElementById('navToggle');
  var mobileNav = document.getElementById('mobileNav');
  navToggle.addEventListener('click', function(){
    var open = mobileNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  mobileNav.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){
      mobileNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- REVEAL ON SCROLL ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, {threshold:0.15});
  revealEls.forEach(function(el){ io.observe(el); });

  /* ---------- TAGLINE CAROUSEL ---------- */
  var tagCards = document.querySelectorAll('.tag-card');
  var tagDots = document.getElementById('tagDots');
  var tagIndex = 0;
  tagCards.forEach(function(_, i){
    var b = document.createElement('button');
    b.setAttribute('aria-label', 'Show highlight ' + (i+1));
    b.setAttribute('aria-current', i === 0 ? 'true' : 'false');
    b.addEventListener('click', function(){ goToTag(i); });
    tagDots.appendChild(b);
  });
  function goToTag(i){
    tagCards[tagIndex].classList.remove('active');
    tagDots.children[tagIndex].setAttribute('aria-current','false');
    tagIndex = i;
    tagCards[tagIndex].classList.add('active');
    tagDots.children[tagIndex].setAttribute('aria-current','true');
  }
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!reduceMotion){
    setInterval(function(){
      goToTag((tagIndex + 1) % tagCards.length);
    }, 4000);
  }

  /* ---------- TESTIMONIAL CAROUSEL ---------- */
  var testiCards = document.querySelectorAll('.testi-card');
  var testiDots = document.getElementById('testiDots');
  var testiIndex = 0;
  testiCards.forEach(function(_, i){
    var b = document.createElement('button');
    b.setAttribute('aria-label', 'Show testimonial ' + (i+1));
    b.setAttribute('aria-current', i === 0 ? 'true' : 'false');
    b.addEventListener('click', function(){ goToTesti(i); });
    testiDots.appendChild(b);
  });
  function goToTesti(i){
    testiCards[testiIndex].classList.remove('active');
    testiDots.children[testiIndex].setAttribute('aria-current','false');
    testiIndex = (i + testiCards.length) % testiCards.length;
    testiCards[testiIndex].classList.add('active');
    testiDots.children[testiIndex].setAttribute('aria-current','true');
  }
  document.getElementById('testiPrev').addEventListener('click', function(){ goToTesti(testiIndex - 1); });
  document.getElementById('testiNext').addEventListener('click', function(){ goToTesti(testiIndex + 1); });
  if(!reduceMotion){
    setInterval(function(){ goToTesti(testiIndex + 1); }, 6000);
  }

  /* ---------- STAT COUNTERS ---------- */
  var statEls = document.querySelectorAll('.stat-num[data-count]');
  var statIo = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        animateCount(entry.target);
        statIo.unobserve(entry.target);
      }
    });
  }, {threshold:0.4});
  statEls.forEach(function(el){ statIo.observe(el); });

  function animateCount(el){
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1400;
    var start = null;
    function step(ts){
      if(!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var val = Math.round(target * eased);
      el.textContent = val + suffix;
      if(progress < 1){ requestAnimationFrame(step); }
      else { el.textContent = target + suffix; }
    }
    requestAnimationFrame(step);
  }

  /* ---------- FOOTER YEAR ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

})();
