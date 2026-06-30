/* ============================================================
   재재환경연구소 홈페이지 인터랙션 — 외부 스크립트
   아임웹 본문(직접입력)은 <script>를 제거하므로, 이 파일을
   아임웹 [사이트 설정 > 헤더/푸터 스크립트 삽입]에 아래 한 줄로 로드:
     <script src="https://cdn.jsdelivr.net/gh/Brrriann/jaejae@master/jjlab.js"></script>

   - 인라인 onclick에 의존하지 않고 document 이벤트 위임 사용
   - 늦게/일찍 로드돼도 안전 (요소 존재 가드 + 재실행 안전)
   ============================================================ */
(function () {
  'use strict';

  // reveal 숨김 활성화 (이 클래스가 없으면 .reveal 은 그냥 보임)
  document.documentElement.className += ' jjs';

  /* ── 1. 클릭 이벤트 위임 (탭 전환 + 햄버거 메뉴) ── */
  document.addEventListener('click', function (e) {
    // 1-a. 프로그램 탭
    var tab = e.target.closest ? e.target.closest('.ptab') : null;
    if (tab) {
      var idx = parseInt(tab.getAttribute('data-panel'), 10) || 0;
      var tabs = document.querySelectorAll('.ptab');
      var panels = document.querySelectorAll('.ppanel');
      for (var i = 0; i < tabs.length; i++) tabs[i].classList.remove('is-active');
      for (var j = 0; j < panels.length; j++) panels[j].classList.remove('is-active');
      tab.classList.add('is-active');
      if (panels[idx]) panels[idx].classList.add('is-active');
      return;
    }
    // 1-b. 햄버거 토글
    var ham = e.target.closest ? e.target.closest('#navHam') : null;
    if (ham) {
      var mob = document.getElementById('navMobile');
      if (mob) {
        var open = mob.classList.toggle('open');
        ham.classList.toggle('open', open);
      }
      return;
    }
    // 1-c. 모바일 메뉴 항목 클릭 시 닫기
    var mlink = e.target.closest ? e.target.closest('#navMobile a') : null;
    if (mlink) {
      var m = document.getElementById('navMobile');
      var h = document.getElementById('navHam');
      if (m) m.classList.remove('open');
      if (h) h.classList.remove('open');
    }
  }, false);

  /* ── 메인 초기화 (DOM 준비 후) ── */
  function init() {
    var d = document;

    // 2. NAV 스크롤 감지
    var nav = d.getElementById('nav');
    if (nav) {
      window.addEventListener('scroll', function () {
        nav.classList.toggle('scrolled', window.scrollY > 40);
      }, { passive: true });
    }

    // 3. 히어로 Ken Burns + 패럴랙스
    var heroPhoto = d.getElementById('heroPhoto');
    var hero = d.getElementById('hero');
    if (heroPhoto) {
      setTimeout(function () { heroPhoto.classList.add('loaded'); }, 100);
      if (hero) {
        window.addEventListener('scroll', function () {
          var y = window.scrollY;
          var maxY = hero.offsetHeight;
          var ty = -Math.min(y, maxY) * 0.08;
          heroPhoto.style.transform = 'scale(1.2) translateY(' + ty + 'px)';
        }, { passive: true });
      }
    }

    // 4. 스크롤 reveal
    var revealEls = d.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    if ('IntersectionObserver' in window && revealEls.length) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
        });
      }, { threshold: 0.12 });
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      // 옵저버 미지원: 전부 표시
      revealEls.forEach(function (el) { el.classList.add('in'); });
    }

    // 5. 카운터 애니메이션
    function runCount(el) {
      var target = parseFloat(el.dataset.to);
      var dec = parseInt(el.dataset.dec, 10) || 0;
      var dur = 1600, t0 = null;
      function tick(now) {
        if (t0 === null) t0 = now;
        var p = Math.min((now - t0) / dur, 1);
        var ease = 1 - Math.pow(1 - p, 3);
        el.textContent = (ease * target).toFixed(dec);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target.toFixed(dec);
      }
      requestAnimationFrame(tick);
    }
    var cnts = d.querySelectorAll('.cnt');
    if ('IntersectionObserver' in window && cnts.length) {
      var cntIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { runCount(en.target); cntIO.unobserve(en.target); }
        });
      }, { threshold: 0.6 });
      cnts.forEach(function (el) { cntIO.observe(el); });
    }

    // 6. 벤토 카드 마우스 틸트 (데스크톱만)
    var mq = window.matchMedia('(hover: hover) and (min-width: 769px)');
    if (mq.matches) {
      d.querySelectorAll('.bcard').forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
          var r = card.getBoundingClientRect();
          var x = (e.clientX - r.left) / r.width - 0.5;
          var y = (e.clientY - r.top) / r.height - 0.5;
          var rx = -y * 10, ry = x * 10;
          card.style.transform = 'perspective(900px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateZ(6px)';
          card.style.boxShadow = (-ry * 2) + 'px ' + (rx * 2) + 'px 40px rgba(0,0,0,.5)';
        });
        card.addEventListener('mouseleave', function () {
          card.style.transform = '';
          card.style.boxShadow = '';
        });
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
