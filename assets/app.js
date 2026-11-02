/* 썬그룹 홈페이지 — 공통 스크립트 (외부 라이브러리 없음) */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- 연락처 · 상담 폼 전송처 ----------
     아래 세 줄만 고치면 페이지 전체(단추·폼)에 반영된다.
     FORM_ENDPOINT 가 비어 있으면 휴대폰에서는 문자 앱이 열리고, PC 에서는 내용을 복사해 준다.
     Apps Script(문의 서버) 주소를 넣으면 그쪽으로 JSON 이 간다. */
  var FORM_ENDPOINT = '';
  var SMS_TO = '010-0000-0000';                       /* ← 담당자 휴대폰 (확인 필요) */
  var KAKAO = 'https://open.kakao.com/o/g3UAohGi';    /* ← 카카오 오픈채팅 (확인 필요) */
  var COMPANY = '썬그룹';

  $$('[data-tel]').forEach(function (a) { a.href = 'tel:' + SMS_TO.replace(/-/g, ''); var t = $('.num', a); if (t) t.textContent = SMS_TO; });
  $$('[data-kakao]').forEach(function (a) { a.href = KAKAO; });

  /* ---------- 상단 띠 · 메뉴 강조 · 떠 있는 단추 ---------- */
  var bar = $('#bar'), floating = $('#floating'), totop = $('#totop');
  var sections = $$('main section[id]');
  var menuLinks = $$('.menu a');
  var fx = $$('.fx');
  function reveal() {
    var h = window.innerHeight;
    fx.forEach(function (el) {
      if (el.classList.contains('in')) return;
      var r = el.getBoundingClientRect();
      if (r.top < h * 0.92 && r.bottom > 0) el.classList.add('in');
    });
  }
  function onScroll() {
    var y = window.scrollY;
    if (bar) bar.classList.toggle('stuck', y > 10);
    if (floating) floating.classList.toggle('show', y > 420);
    if (totop) totop.classList.toggle('show', y > 900);
    var cur = '';
    sections.forEach(function (s) { if (s.getBoundingClientRect().top <= 120) cur = s.id; });
    menuLinks.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + cur); });
    reveal();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', reveal);
  onScroll();
  setTimeout(reveal, 150);
  setInterval(reveal, 800); /* 미리보기 pane 에서 scroll 이벤트가 안 올 때 대비 */
  if (totop) totop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* ---------- 모바일 메뉴 ---------- */
  var ham = $('#ham'), mnav = $('#mnav');
  if (ham && mnav) {
    ham.addEventListener('click', function () { mnav.classList.toggle('open'); });
    $$('a', mnav).forEach(function (a) { a.addEventListener('click', function () { mnav.classList.remove('open'); }); });
  }

  /* ---------- 탭 (헬스케어 서비스) ---------- */
  $$('.tabs').forEach(function (tabs) {
    var btns = $$('button', tabs);
    var panes = $$('.tabp', tabs.parentNode);
    btns.forEach(function (b, i) {
      b.addEventListener('click', function () {
        btns.forEach(function (x, k) { x.classList.toggle('on', k === i); });
        panes.forEach(function (p, k) { p.classList.toggle('on', k === i); });
      });
    });
  });

  /* ---------- 관심 분야 미리 고르기 (#consult?i=svf 같은 링크) ---------- */
  $$('[data-interest]').forEach(function (a) {
    a.addEventListener('click', function () {
      var v = a.getAttribute('data-interest');
      $$('#consultForm input[name=interest]').forEach(function (c) { if (c.value === v) c.checked = true; });
    });
  });

  /* ---------- 상담 폼 ---------- */
  function isMobile() { return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent); }
  var form = $('#consultForm');
  if (form) {
    var done = $('#formDone');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.name.value.trim(), phone = form.phone.value.trim();
      if (!name) { form.name.focus(); return; }
      if (!/^[0-9\-\s]{9,14}$/.test(phone)) { form.phone.focus(); form.phone.setCustomValidity('연락처를 숫자로 적어 주세요'); form.phone.reportValidity(); form.phone.setCustomValidity(''); return; }
      if (!form.agree.checked) { form.agree.focus(); return; }
      var interests = $$('input[name=interest]:checked', form).map(function (c) { return c.value; });
      var data = { name: name, phone: phone, region: form.region.value.trim(), interest: interests.join(', '), memo: form.memo.value.trim(), when: form.when.value };
      var text = '[' + COMPANY + ' 상담 신청]\n이름: ' + data.name + '\n연락처: ' + data.phone +
        (data.region ? '\n지역: ' + data.region : '') +
        (data.interest ? '\n관심 분야: ' + data.interest : '') +
        (data.when ? '\n통화 가능 시간: ' + data.when : '') +
        (data.memo ? '\n문의: ' + data.memo : '');
      var finish = function (sent) {
        form.hidden = true;
        done.classList.add('show');
        $('.t', done).textContent = sent ? '상담 신청이 접수되었습니다' : '아래 내용을 복사해 문자로 보내 주세요';
        $('.p', done).textContent = sent ? '담당자가 확인 후 빠르게 연락드리겠습니다.' : ('PC 에서는 문자 앱을 열 수 없어 내용을 복사해 두었습니다. ' + SMS_TO + ' 로 보내 주시거나 카카오톡 상담을 눌러 주세요.');
        var ta = $('textarea', done); ta.value = text; ta.hidden = sent;
      };
      if (FORM_ENDPOINT) {
        data.at = new Date().toISOString(); data.page = location.href; data.message = text;
        fetch(FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(data) }).catch(function () {}).then(function () { finish(true); });
        return;
      }
      if (isMobile()) { var ios = /iPhone|iPad/i.test(navigator.userAgent); location.href = 'sms:' + SMS_TO + (ios ? '&' : '?') + 'body=' + encodeURIComponent(text); finish(true); return; }
      if (navigator.clipboard) navigator.clipboard.writeText(text).catch(function () {});
      finish(false);
    });
  }

  /* ---------- 숫자 올라가기 (히어로 통계) ---------- */
  var counted = false;
  function count() {
    if (counted) return;
    var s = $('.stats'); if (!s) return;
    if (s.getBoundingClientRect().top > window.innerHeight) return;
    counted = true;
    $$('[data-count]', s).forEach(function (el) {
      var to = parseFloat(el.getAttribute('data-count')), suf = el.getAttribute('data-suf') || '', t0 = null;
      var step = function (t) {
        if (!t0) t0 = t; var p = Math.min(1, (t - t0) / 1200); p = 1 - Math.pow(1 - p, 3);
        el.firstChild.nodeValue = Math.round(to * p).toLocaleString('ko-KR') + suf;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }
  window.addEventListener('scroll', count, { passive: true });
  setTimeout(count, 300);
  setInterval(count, 800);
})();

/* ---------- 문의 중복 전송 막기 (큰길브리지 2026-11-02) ----------
   문의 서버(구글 앱스 스크립트)가 답하는 데 몇 초 걸려, 그사이 「보내기」를 여러 번 누르면 메일이 여러 통 갔다.
   폼을 보낸 직후 서버로 가는 요청이 시작되면 그 폼을 잠그고 단추에 「보내는 중…」을 띄운다. 답이 오면 풀린다. */
(function () {
  if (window.__formGuard) return; window.__formGuard = true;
  var last = null, lastAt = 0;
  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (f && f.getAttribute && f.getAttribute('data-sending')) { e.preventDefault(); e.stopImmediatePropagation(); return; }
    last = f; lastAt = Date.now();
  }, true);
  function lock(f, on) {
    var bs = f.querySelectorAll('button[type="submit"], button:not([type]), input[type="submit"]');
    if (on) f.setAttribute('data-sending', '1'); else f.removeAttribute('data-sending');
    Array.prototype.forEach.call(bs, function (b) {
      if (on) { if (b.getAttribute('data-label') === null) b.setAttribute('data-label', b.innerHTML); b.disabled = true; b.style.opacity = '.6'; b.style.cursor = 'wait'; if (b.tagName === 'BUTTON') b.textContent = '보내는 중…'; }
      else if (b.getAttribute('data-label') !== null) { b.disabled = false; b.style.opacity = ''; b.style.cursor = ''; if (b.tagName === 'BUTTON') b.innerHTML = b.getAttribute('data-label'); b.removeAttribute('data-label'); }
    });
  }
  var of = window.fetch; if (!of) return;
  window.fetch = function (url, opt) {
    var p = of.apply(this, arguments);
    var f = last;
    if (f && Date.now() - lastAt < 3000 && opt && /post/i.test(opt.method || '') && /script\.google\.com\/macros/.test(String(url))) {
      last = null; lock(f, true);
      var un = function () { lock(f, false); };
      p.then(un, un);
    }
    return p;
  };
})();
