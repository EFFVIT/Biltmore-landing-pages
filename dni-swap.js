/* Biltmore Dynamic Number Insertion — vanilla port of the mollura DniSwap component.
 * Paid sessions (gclid/gbraid/wbraid) lease a tracking number from control.effvit.com
 * and every visible instance of the static number is swapped, so an inbound call maps
 * back to this exact session's click id. Organic/direct sessions never lease — they keep
 * the static number, by design. Any failure leaves the page untouched. */
(function () {
  var DNI_ENDPOINT = 'https://control.effvit.com/api/dni/lease';
  var CLIENT = 'biltmore';
  var DEFAULT_DIGITS = '9283930454'; // Google Ads CTN currently on the page

  function formatDashes(e164) {
    var d = e164.replace(/\D/g, '').replace(/^1/, '');
    return d.slice(0, 3) + '-' + d.slice(3, 6) + '-' + d.slice(6);
  }
  function swapNumber(e164) {
    var digits = e164.replace(/\D/g, '').replace(/^1/, '');
    if (digits.length !== 10) return;
    var formatted = formatDashes(e164);
    document.querySelectorAll('a[href^="tel:"]').forEach(function (a) {
      if (a.href.replace(/\D/g, '').indexOf(DEFAULT_DIGITS) !== -1) a.href = 'tel:+1' + digits;
    });
    var pattern = new RegExp(
      '\\(?' + DEFAULT_DIGITS.slice(0, 3) + '\\)?[\\s.\\-]?' + DEFAULT_DIGITS.slice(3, 6) + '[\\s.\\-]?' + DEFAULT_DIGITS.slice(6),
      'g'
    );
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    var hits = [];
    while (walker.nextNode()) {
      var t = walker.currentNode;
      if (t.nodeValue && pattern.test(t.nodeValue)) hits.push(t);
      pattern.lastIndex = 0;
    }
    hits.forEach(function (t) { t.nodeValue = t.nodeValue.replace(pattern, formatted); });
  }

  try {
    var params = new URLSearchParams(window.location.search);
    function grab(k) { var v = params.get(k); if (v) sessionStorage.setItem(k, v); return v || sessionStorage.getItem(k); }
    var gclid = grab('gclid'), gbraid = grab('gbraid'), wbraid = grab('wbraid');
    if (!gclid && !gbraid && !wbraid) return; // organic/direct: keep static number

    var sessionKey = sessionStorage.getItem('dni_sk');
    if (!sessionKey) { sessionKey = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()) + Math.random(); sessionStorage.setItem('dni_sk', sessionKey); }

    var cached = sessionStorage.getItem('dni_lease');
    if (cached) { try { var c = JSON.parse(cached); if (c.number && c.exp > Date.now()) swapNumber(c.number); } catch (e) {} }

    var utm = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(function (k) {
      var v = params.get(k) || sessionStorage.getItem(k); if (v) { utm[k] = v; sessionStorage.setItem(k, v); }
    });

    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, 2500);
    fetch(DNI_ENDPOINT, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client: CLIENT, sessionKey: sessionKey, gclid: gclid, gbraid: gbraid, wbraid: wbraid, utm: utm, page: window.location.pathname }),
      signal: ctrl.signal
    })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        var lease = res && res.lease;
        if (lease && lease.number) {
          sessionStorage.setItem('dni_lease', JSON.stringify({ number: lease.number, exp: Date.now() + (lease.ttlSeconds || 1800) * 1000 }));
          swapNumber(lease.number);
          var pending = null;
          var observer = new MutationObserver(function () {
            if (pending) return;
            pending = setTimeout(function () { pending = null; swapNumber(lease.number); }, 250);
          });
          observer.observe(document.body, { childList: true, subtree: true, characterData: true });
        }
      })
      .catch(function () { /* static number stays — correct fallback */ })
      .finally(function () { clearTimeout(timer); });
  } catch (e) { /* never break the page */ }
})();
