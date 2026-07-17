/* ─────────────────────────────────────────────────────────────────────────────
 * RootLogic FAB — standalone build for STATIC-HTML fleet apps (Biltmore, SkinStrand).
 * Self-contained IIFE port of fab-widget.ts. No bundler, no dependencies.
 *
 * Usage (place in the app's public root, include once before </body>):
 *   <script src="/fab-widget.js" data-client="biltmore"></script>
 * Optional: data-origin="https://control.effvit.com" (default), data-mount-delay="0".
 *
 * Keep in sync with the canonical TS core (fab-widget.ts) in effvit-lp-builder.
 * ───────────────────────────────────────────────────────────────────────────── */
(function () {
  "use strict";

  var script = document.currentScript;
  var CLIENT = script && script.getAttribute("data-client");
  if (!CLIENT) return;
  var ORIGIN = (script && script.getAttribute("data-origin")) || "https://control.effvit.com";

  var ICONS = {
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    "message-circle": '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.5-1.5"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>',
    user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
    "map-pin": '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>',
    star: '<polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>',
    heart: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
    "help-circle": '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    video: '<polygon points="23,7 16,12 23,17"/><rect x="1" y="5" width="15" height="14" rx="2"/>',
    "file-text": '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>'
  };

  var CSS = ':host{all:initial;position:fixed;bottom:calc(var(--nsw-offset-y,18px) + env(safe-area-inset-bottom,0px));right:calc(var(--nsw-offset-x,18px) + env(safe-area-inset-right,0px));z-index:999990;display:block;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;--nsw-accent:#132039;--nsw-on-accent:#fff;--nsw-surface:#fff;--nsw-text:#1b1b1f;--nsw-radius:20px}:host(.effvit-cl-pos-left){right:auto;left:calc(var(--nsw-offset-x,18px) + env(safe-area-inset-left,0px))}*,*::before,*::after{box-sizing:border-box}:host(.effvit-cl-ghl-open){display:none}@media(max-width:768px){:host(.effvit-cl-hide-mobile){display:none}}.effvit-cl-avatar{position:relative;width:64px;height:64px;min-width:44px;min-height:44px;border-radius:50%;background:var(--nsw-accent);color:var(--nsw-on-accent);border:none;outline:none;cursor:pointer;padding:0;box-shadow:0 6px 18px rgba(19,32,57,.28);font-family:inherit;display:flex;align-items:center;justify-content:center}.effvit-cl-avatar:focus-visible{outline:2px solid var(--nsw-on-accent);outline-offset:3px}.effvit-cl-avatar-inner{position:relative;z-index:1;width:100%;height:100%;border-radius:50%;overflow:hidden;display:flex;align-items:center;justify-content:center}.effvit-cl-avatar-img{width:100%;height:100%;object-fit:cover}.effvit-cl-avatar-initials{font-size:20px;font-weight:700;letter-spacing:.02em;color:var(--nsw-on-accent);text-transform:uppercase}.effvit-cl-wave{font-size:30px;line-height:1;transform-origin:70% 70%;animation:effvit-cl-wave 3.4s ease-in-out infinite}@keyframes effvit-cl-wave{0%,14%,86%,100%{transform:rotate(0)}22%{transform:rotate(20deg)}30%{transform:rotate(-12deg)}38%{transform:rotate(18deg)}46%{transform:rotate(-8deg)}54%{transform:rotate(12deg)}62%{transform:rotate(0)}}.effvit-cl-pulse-ring{position:absolute;inset:0;border-radius:50%;background:var(--nsw-accent);pointer-events:none;animation:effvit-cl-pulse 4s cubic-bezier(.4,0,.6,1) infinite}@keyframes effvit-cl-pulse{0%{transform:scale(1);opacity:.55}30%{transform:scale(1.55);opacity:0}100%{transform:scale(1.55);opacity:0}}.effvit-cl-bounce-once{animation:effvit-cl-bounce .9s cubic-bezier(.28,.84,.42,1) .4s both}@keyframes effvit-cl-bounce{0%,100%{transform:translateY(0)}30%{transform:translateY(-14px)}50%{transform:translateY(0)}68%{transform:translateY(-6px)}84%{transform:translateY(0)}}.effvit-cl-unread-dot{position:absolute;z-index:2;top:-2px;right:-2px;width:14px;height:14px;border-radius:50%;background:#e6483c;border:2px solid var(--nsw-surface,#fff)}.effvit-cl-hover-label{position:absolute;bottom:calc(64px + 14px);right:0;background:var(--nsw-surface);color:var(--nsw-text);font-size:13px;font-weight:600;white-space:nowrap;padding:8px 14px;border-radius:999px;box-shadow:0 8px 24px rgba(0,0,0,.16),0 2px 8px rgba(0,0,0,.06);cursor:pointer}:host(.effvit-cl-pos-left) .effvit-cl-hover-label{right:auto;left:0}:host(.is-open) .effvit-cl-hover-label{display:none}.effvit-cl-card{position:absolute;bottom:calc(64px + 14px);right:0;width:max-content;max-width:min(90vw,360px);background:var(--nsw-surface);color:var(--nsw-text);border-radius:var(--nsw-radius);box-shadow:0 20px 60px rgba(0,0,0,.18),0 4px 16px rgba(0,0,0,.08);padding:16px;transform-origin:bottom right;transform:scale(.85) translateY(8px);opacity:0;pointer-events:none;outline:none;transition:transform .22s cubic-bezier(.25,.1,.25,1),opacity .18s ease}:host(.is-open) .effvit-cl-card{transform:scale(1) translateY(0);opacity:1;pointer-events:auto}:host(.effvit-cl-pos-left) .effvit-cl-card{right:auto;left:0;transform-origin:bottom left}.effvit-cl-greeting{margin:0 0 12px;font-size:14px;line-height:1.4;font-weight:500;color:var(--nsw-text)}.effvit-cl-chips{display:flex;flex-wrap:wrap;gap:8px}.effvit-cl-chip{display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:8px 14px 8px 10px;border:none;border-radius:999px;cursor:pointer;text-decoration:none;font-family:inherit;font-size:13.5px;font-weight:600;color:var(--nsw-text)}.effvit-cl-chip:focus-visible{outline:2px solid var(--nsw-accent);outline-offset:2px}.effvit-cl-chip-icon{display:flex;align-items:center;justify-content:center;flex:none}.effvit-cl-chip-icon svg{width:18px;height:18px}.effvit-cl-chip-label{white-space:nowrap}@media(prefers-reduced-motion:reduce){.effvit-cl-wave,.effvit-cl-pulse-ring,.effvit-cl-bounce-once{animation:none}}@media(max-width:480px){.effvit-cl-card{max-width:90vw}}';

  function svgIcon(p) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + p + "</svg>"; }
  function hexToRgba(hex, a) {
    var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || "");
    if (!m) return "rgba(19,32,57," + a + ")";
    return "rgba(" + parseInt(m[1], 16) + "," + parseInt(m[2], 16) + "," + parseInt(m[3], 16) + "," + a + ")";
  }
  function chatReady() { return !!(window.leadConnector && window.leadConnector.chatWidget && typeof window.leadConnector.chatWidget.openWidget === "function"); }
  function openGhlChat() {
    if (chatReady()) { window.leadConnector.chatWidget.openWidget(); return; }
    var w = 0, r = setInterval(function () { w += 200; if (chatReady()) { clearInterval(r); window.leadConnector.chatWidget.openWidget(); } else if (w >= 5000) clearInterval(r); }, 200);
  }
  function watchGhlOpen(root) {
    var el = document.querySelector("chat-widget");
    if (!el) return;
    function sync() { var a = el.getAttribute("data-active") === "true"; root.classList.toggle("effvit-cl-ghl-open", a); root.style.display = a ? "none" : ""; }
    sync();
    new MutationObserver(sync).observe(el, { attributes: true, attributeFilter: ["data-active"] });
  }
  function resolveTracked(fallback) {
    try {
      var raw = sessionStorage.getItem("dni_lease");
      if (raw) { var l = JSON.parse(raw); if (l && l.number && (!l.exp || l.exp > Date.now())) return l.number; }
    } catch (e) {}
    var tel = document.querySelector('a[href^="tel:"]');
    if (tel) { var d = (tel.getAttribute("href") || "").replace(/^tel:/i, "").replace(/[^0-9+]/g, ""); if (d) return d; }
    return (fallback || "").replace(/[^0-9+]/g, "");
  }
  function phoneHref(item) {
    var d = item.phoneSource === "config" ? (item.actionValue || "").replace(/[^0-9+]/g, "") : resolveTracked(item.actionValue);
    return "tel:" + d;
  }

  function buildChip(item) {
    var isLink = item.actionType === "url" || item.actionType === "phone";
    var el = document.createElement(isLink ? "a" : "button");
    el.className = "effvit-cl-chip";
    el.setAttribute("role", "menuitem");
    if (item.actionType === "url") { el.href = item.actionValue || "#"; if (item.openNewTab) { el.target = "_blank"; el.rel = "noopener"; } }
    else if (item.actionType === "phone") { el.href = phoneHref(item); }
    else { el.type = "button"; }
    var tint = item.iconColor || "#1D9E75";
    el.style.background = hexToRgba(tint, 0.12);
    var ic = document.createElement("span"); ic.className = "effvit-cl-chip-icon"; ic.style.color = tint;
    ic.innerHTML = svgIcon(ICONS[item.icon] || ICONS["message-circle"]);
    var lb = document.createElement("span"); lb.className = "effvit-cl-chip-label"; lb.textContent = item.label;
    el.appendChild(ic); el.appendChild(lb);
    return el;
  }

  function render(cfg) {
    if (!cfg.enabled || !cfg.items || !cfg.items.length) return null;
    var root = document.createElement("div");
    root.id = "effvit-cl-widget";
    var shadow = root.attachShadow({ mode: "open" });
    var st = document.createElement("style"); st.textContent = CSS; shadow.appendChild(st);
    root.style.setProperty("--nsw-accent", cfg.accentColor || "#132039");
    root.style.setProperty("--nsw-on-accent", cfg.onAccentColor || "#ffffff");
    root.style.setProperty("--nsw-surface", cfg.cardSurfaceColor || "#ffffff");
    root.style.setProperty("--nsw-text", cfg.cardTextColor || "#1b1b1f");
    root.style.setProperty("--nsw-radius", (cfg.cardRadius != null ? cfg.cardRadius : 20) + "px");
    root.style.setProperty("--nsw-offset-x", (cfg.offsetX != null ? cfg.offsetX : 18) + "px");
    root.style.setProperty("--nsw-offset-y", (cfg.offsetY != null ? cfg.offsetY : 18) + "px");
    if (cfg.position === "bottom-left") root.classList.add("effvit-cl-pos-left");
    if (!cfg.showMobile) root.classList.add("effvit-cl-hide-mobile");
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var card = document.createElement("div"); card.className = "effvit-cl-card"; card.tabIndex = -1;
    var greeting = document.createElement("p"); greeting.className = "effvit-cl-greeting";
    greeting.textContent = cfg.greetingText || "Have a question? We're here to help.";
    var chipRow = document.createElement("div"); chipRow.className = "effvit-cl-chips"; chipRow.setAttribute("role", "menu");
    var chips = cfg.items.map(function (item) { var c = buildChip(item); chipRow.appendChild(c); return c; });
    function refreshPhones() { cfg.items.forEach(function (item, i) { if (item.actionType === "phone") chips[i].href = phoneHref(item); }); }
    chips.forEach(function (chip, index) {
      chip.addEventListener("click", function (e) {
        var item = cfg.items[index];
        if (item.actionType === "ghl_chat") { e.preventDefault(); closeCard(); openGhlChat(); }
        else if (item.actionType === "scroll") {
          e.preventDefault(); var t = null;
          if (item.actionValue) { try { t = document.querySelector(item.actionValue); } catch (err) { t = null; } }
          if (t) { closeCard(); t.scrollIntoView({ behavior: "smooth" }); }
        }
      });
    });
    card.appendChild(greeting); card.appendChild(chipRow);

    var avatar = document.createElement("button"); avatar.type = "button"; avatar.className = "effvit-cl-avatar";
    avatar.setAttribute("aria-label", cfg.fabLabel || "Contact us");
    avatar.setAttribute("aria-haspopup", "true"); avatar.setAttribute("aria-expanded", "false");
    var inner = document.createElement("span"); inner.className = "effvit-cl-avatar-inner";
    if (cfg.avatarMode === "image" && cfg.avatarImageUrl) {
      var img = document.createElement("img"); img.className = "effvit-cl-avatar-img"; img.src = cfg.avatarImageUrl; img.alt = ""; inner.appendChild(img);
    } else if (cfg.avatarMode === "initials") {
      var ini = document.createElement("span"); ini.className = "effvit-cl-avatar-initials"; ini.textContent = (cfg.avatarInitials || "Dr").slice(0, 2); inner.appendChild(ini);
    } else {
      var wv = document.createElement("span"); wv.className = "effvit-cl-wave"; wv.setAttribute("aria-hidden", "true"); wv.textContent = "👋"; inner.appendChild(wv);
    }
    avatar.appendChild(inner);
    if (cfg.attentionPulse && !reduced) { var ring = document.createElement("span"); ring.className = "effvit-cl-pulse-ring"; ring.setAttribute("aria-hidden", "true"); avatar.appendChild(ring); }
    if (cfg.showUnreadDot) { var dot = document.createElement("span"); dot.className = "effvit-cl-unread-dot"; dot.setAttribute("aria-hidden", "true"); avatar.appendChild(dot); }
    if (cfg.attentionBounce && !reduced) {
      avatar.classList.add("effvit-cl-bounce-once");
      avatar.addEventListener("animationend", function onE(e) { if (e.animationName === "effvit-cl-bounce") { avatar.classList.remove("effvit-cl-bounce-once"); avatar.removeEventListener("animationend", onE); } });
    }
    var rt = null;
    function scheduleRandom() {
      rt = setTimeout(function () {
        if (!root.classList.contains("is-open")) {
          avatar.classList.add("effvit-cl-bounce-once");
          avatar.addEventListener("animationend", function onE(e) { if (e.animationName === "effvit-cl-bounce") { avatar.classList.remove("effvit-cl-bounce-once"); avatar.removeEventListener("animationend", onE); } });
        }
        scheduleRandom();
      }, 20000 + Math.random() * 30000);
    }
    if (cfg.attentionRandomBounce && !reduced) scheduleRandom();

    var hoverLabel = null;
    if (cfg.showHoverLabel && cfg.hoverLabelText) {
      hoverLabel = document.createElement("div"); hoverLabel.className = "effvit-cl-hover-label"; hoverLabel.textContent = cfg.hoverLabelText; hoverLabel.setAttribute("aria-hidden", "true");
    }
    function openCard() { refreshPhones(); root.classList.add("is-open"); avatar.setAttribute("aria-expanded", "true"); if (rt) { clearTimeout(rt); rt = null; } if (chips.length) chips[0].focus(); else card.focus(); }
    function closeCard() { root.classList.remove("is-open"); avatar.setAttribute("aria-expanded", "false"); }
    avatar.addEventListener("click", function () { root.classList.contains("is-open") ? closeCard() : openCard(); });
    if (hoverLabel) hoverLabel.addEventListener("click", openCard);
    document.addEventListener("click", function (e) { if (!e.composedPath().includes(root)) closeCard(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && root.classList.contains("is-open")) { closeCard(); avatar.focus(); } });

    shadow.appendChild(card); if (hoverLabel) shadow.appendChild(hoverLabel); shadow.appendChild(avatar);
    watchGhlOpen(root);
    return root;
  }

  function boot() {
    fetch(ORIGIN + "/api/fab-config/" + encodeURIComponent(CLIENT), { credentials: "omit" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (cfg) { if (!cfg) return; var root = render(cfg); if (root) document.body.appendChild(root); })
      .catch(function () {});
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
