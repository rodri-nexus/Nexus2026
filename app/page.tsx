"use client";

import { useEffect } from "react";

export default function LandingPage() {
  useEffect(() => {
    // --- LÓGICA JAVASCRIPT EXACTA DEL ARCHIVO PROPORCIONADO ---
    var $ = function (s: string, r?: Document | Element) {
      return (r || document).querySelector(s);
    };
    var $$ = function (s: string, r?: Document | Element) {
      return Array.prototype.slice.call((r || document).querySelectorAll(s));
    };
    var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.classList.add("js");

    var tour = $("#tour") as HTMLElement;
    var chaps = $$(".chap") as HTMLElement[];
    var segs = $$(".prog i") as HTMLElement[];
    var page = $("#page") as HTMLElement;
    var phone = $("#phone") as HTMLElement;
    var fit = $("#fit") as HTMLElement;

    if (!tour || !page || !phone || !fit) return;

    var active = -1,
      cur = 0,
      target = 0,
      targets = [0, 0, 0, 0];

    function fitPhone() {
      var st = $(".stage") as HTMLElement;
      var narrow = matchMedia("(max-width:820px)").matches;
      var txtH = narrow ? ($(".txt") as HTMLElement).offsetHeight + 10 : 0;
      var availH = st.clientHeight - txtH - (narrow ? 26 : 60);
      var availW = fit.parentElement?.clientWidth || 320;
      var k = Math.max(0.4, Math.min(1.12, availH / 560, availW / 280));
      fit.style.width = 280 * k + "px";
      fit.style.height = 560 * k + "px";
      phone.style.transform = "scale(" + k + ")";
    }

    function measure() {
      var h = ($(".screen") as HTMLElement).clientHeight;
      var maxY = Math.max(0, page.scrollHeight - h);
      var off = function (id: string) {
        var el = $(id) as HTMLElement;
        return Math.min(maxY, Math.max(0, (el ? el.offsetTop : 0) - 52));
      };
      targets = [0, off("#w-packs"), off("#w-reviews"), 0];
      target = targets[Math.max(0, active)] || 0;
    }

    /* stock + shipping animations */
    function countTo(el: Element, from: number, to: number, ms: number) {
      if (reduce) {
        el.textContent = String(to);
        return;
      }
      var t0 = performance.now();
      (function f(now) {
        var t = Math.min(1, (now - t0) / ms);
        el.textContent = String(Math.round(from + (to - from) * t));
        if (t < 1) requestAnimationFrame(f);
      })(t0);
    }

    function runShip() {
      var f = $("#shipFill") as HTMLElement;
      if (f) {
        f.style.width = "0";
        setTimeout(function () {
          f.style.width = "82%";
        }, 60);
      }
      var stockN = $("#stockN");
      if (stockN) countTo(stockN, 12, 7, 1400);
      var stockFill = $("#stockFill") as HTMLElement;
      if (stockFill) stockFill.style.width = "18%";
    }

    /* packs */
    var packData: Record<number, string[]> = {
      1: ["$32.900", "Llevá 1"],
      2: ["$55.930", "Llevá 2 · 15% OFF"],
      3: ["$78.960", "Llevá 3 · 20% OFF"],
    };
    function selectPack(n: number) {
      $$(".pack").forEach(function (b) {
        (b as HTMLElement).classList.toggle(
          "sel",
          +(b as HTMLElement).dataset.n! === n
        );
      });
      var sbPrice = $("#sbPrice");
      var sbSub = $("#sbSub");
      if (sbPrice) sbPrice.textContent = packData[n][0];
      if (sbSub) sbSub.textContent = packData[n][1];
    }
    $$(".pack").forEach(function (b) {
      b.addEventListener("click", function () {
        selectPack(+(b as HTMLElement).dataset.n!);
      });
    });

    /* toast cycle */
    var msgs = [
      ["Alguien de Córdoba compró 2", "hace 3 minutos"],
      ["Alguien de Rosario compró 1", "hace 8 minutos"],
      ["Alguien de Mendoza compró 3", "hace 12 minutos"],
    ];
    var mi = 0,
      toastTimer: any = 0;
    function showToast() {
      var t = $("#toast");
      if (!t) return;
      t.classList.remove("in");
      setTimeout(function () {
        var tt = $("#toastT");
        var ts = $("#toastS");
        if (tt) tt.textContent = msgs[mi][0];
        if (ts) ts.textContent = msgs[mi][1];
        t.classList.add("in");
        mi = (mi + 1) % msgs.length;
      }, 300);
    }
    function startToast() {
      stopToast();
      setTimeout(showToast, 500);
      toastTimer = setInterval(showToast, 3600);
    }
    function stopToast() {
      clearInterval(toastTimer);
      var t = $("#toast");
      if (t) t.classList.remove("in");
    }

    /* scratch card */
    var cv = $("#scratch") as HTMLCanvasElement;
    var cx = cv ? cv.getContext("2d") : null;
    var W = 220,
      H = 110,
      scTimer: any = 0,
      scRaf = 0;

    function cover() {
      if (!cx) return;
      cx.globalCompositeOperation = "source-over";
      var g = cx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, "#9aa1ad");
      g.addColorStop(0.5, "#d3d8e0");
      g.addColorStop(1, "#8f97a4");
      cx.fillStyle = g;
      cx.fillRect(0, 0, W, H);
      cx.fillStyle = "#454b56";
      cx.font = "700 15px Geist, Arial, sans-serif";
      cx.textAlign = "center";
      cx.fillText("RASPÁ ACÁ", W / 2, H / 2 + 5);
    }
    function scratchAt(x: number, y: number) {
      if (!cx) return;
      cx.globalCompositeOperation = "destination-out";
      cx.beginPath();
      cx.arc(x, y, 17, 0, 7);
      cx.fill();
    }
    function autoScratch() {
      cancelAnimationFrame(scRaf);
      var t0 = performance.now(),
        dur = reduce ? 1 : 1900,
        rows = 4;
      (function s(now) {
        var t = Math.min(1, (now - t0) / dur),
          u = t * rows,
          row = Math.min(rows - 1, Math.floor(u)),
          f = u - row;
        var x = (row % 2 ? 1 - f : f) * (W + 20) - 10,
          y = 14 + (row * (H - 28)) / (rows - 1);
        scratchAt(x, y);
        if (t < 1) {
          scRaf = requestAnimationFrame(s);
        } else {
          var ov = $("#ov");
          if (ov) ov.classList.add("won");
        }
      })(t0);
    }
    function startScratch() {
      stopScratch();
      cover();
      var ov = $("#ov");
      if (ov) {
        ov.classList.remove("won");
        ov.classList.add("on");
      }
      scTimer = setTimeout(autoScratch, 900);
    }
    function stopScratch() {
      clearTimeout(scTimer);
      cancelAnimationFrame(scRaf);
      var ov = $("#ov");
      if (ov) ov.classList.remove("on");
    }
    if (cv) {
      cv.addEventListener("pointermove", function (e) {
        if (e.buttons || e.pointerType === "touch") {
          var r = cv.getBoundingClientRect(),
            k = W / r.width;
          scratchAt((e.clientX - r.left) * k, (e.clientY - r.top) * k);
        }
      });
    }

    /* chapters */
    function setChapter(c: number) {
      if (c === active) return;
      active = c;
      chaps.forEach(function (el, i) {
        el.classList.toggle("on", i === c);
      });
      segs.forEach(function (el, i) {
        el.classList.toggle("on", i === c);
        el.classList.toggle("done", i < c);
      });
      $$("[data-w]").forEach(function (el) {
        (el as HTMLElement).classList.toggle(
          "hl",
          +(el as HTMLElement).dataset.w! === c
        );
      });
      target = targets[c] || 0;
      if (c !== 3) stopScratch();
      if (c !== 2) stopToast();
      if (c === 0) runShip();
      if (c === 1) {
        selectPack(1);
        setTimeout(function () {
          if (active === 1) selectPack(2);
        }, 700);
      }
      if (c === 2) startToast();
      if (c === 3) startScratch();
    }
    function onScroll() {
      if (!tour) return;
      var r = tour.getBoundingClientRect(),
        total = tour.offsetHeight - innerHeight;
      var p = Math.min(1, Math.max(0, -r.top / total));
      setChapter(Math.min(3, Math.floor(p * 4)));
    }
    function tick() {
      cur += (target - cur) * (reduce ? 1 : 0.085);
      if (Math.abs(target - cur) < 0.3) cur = target;
      if (page) page.style.transform = "translate3d(0," + -cur + "px,0)";
      requestAnimationFrame(tick);
    }

    /* reveal on scroll */
    var io = new IntersectionObserver(
      function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.remove("pre");
          e.target.classList.add("in");
          var c = $("[data-count]", e.target) as HTMLElement;
          if (c) {
            $$("[data-count]", e.target).forEach(function (n) {
              countTo(
                n,
                0,
                +((n as HTMLElement).dataset.count || 0),
                1200
              );
            });
          }
          io.unobserve(e.target);
        });
      },
      { threshold: 0.15 }
    );
    $$(".rv").forEach(function (el) {
      if (el.getBoundingClientRect().top > innerHeight)
        el.classList.add("pre");
      io.observe(el);
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", function () {
      fitPhone();
      measure();
      onScroll();
    });

    fitPhone();
    measure();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        fitPhone();
        measure();
      });
    }
    onScroll();
    if (active < 0) setChapter(0);
    tick();

    return () => {
      window.removeEventListener("scroll", onScroll);
      stopToast();
      stopScratch();
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..800&family=Geist:wght@400..700&family=Geist+Mono:wght@400..600&display=swap');
        
        :root{
          --bg:#EDEFF2; --fg:#0A0B0D; --muted:#5B616B; --line:#D3D8DF; --card:#FFFFFF;
          --accent:#2F4BFF; --accent-fg:#FFFFFF; --ok:#0E9F6E; --warn:#E5484D;
          --screen:#FFFFFF; --vis1:#F4F6FA; --vis2:#DDE3EE; --soft:#F2F4F7;
          --f-display:'Bricolage Grotesque','Helvetica Neue',Arial,sans-serif;
          --f-body:'Geist','Helvetica Neue',Arial,sans-serif;
          --f-mono:'Geist Mono',ui-monospace,Menlo,Consolas,monospace;
        }
        @media (prefers-color-scheme: dark){
          :root:not([data-theme="light"]){
            --bg:#0A0B0D; --fg:#F2F3F5; --muted:#9AA1AC; --line:#24272D; --card:#121418;
            --accent:#6F83FF; --accent-fg:#0A0B0D; --ok:#2FD39A; --warn:#FF6B6F;
            --screen:#14161A; --vis1:#1B1E25; --vis2:#0F1115; --soft:#1B1E24; color-scheme:dark;
          }
        }
        :root[data-theme="dark"]{
          --bg:#0A0B0D; --fg:#F2F3F5; --muted:#9AA1AC; --line:#24272D; --card:#121418;
          --accent:#6F83FF; --accent-fg:#0A0B0D; --ok:#2FD39A; --warn:#FF6B6F;
          --screen:#14161A; --vis1:#1B1E25; --vis2:#0F1115; --soft:#1B1E24; color-scheme:dark;
        }
        *{box-sizing:border-box}
        html{scroll-behavior:smooth}
        body{
          background:var(--bg) !important;
          color:var(--fg) !important;
          font-family:var(--f-body) !important;
          font-size:16px;
          line-height:1.55;
          padding-left:max(16px,env(safe-area-inset-left,0px));
          padding-right:max(16px,env(safe-area-inset-right,0px));
          padding-block:0;
          overflow-x:hidden;
          margin: 0;
        }
        h1,h2,h3{font-family:var(--f-display);font-weight:700;letter-spacing:-.03em;line-height:1.02;margin:0;text-wrap:balance}
        p{margin:0}
        em{font-style:normal;color:var(--accent)}
        a{color:inherit}
        :focus-visible{outline:2px solid var(--accent);outline-offset:3px;border-radius:6px}
        .wrap{max-width:1120px;margin-inline:auto}
        .eyebrow{font-family:var(--f-mono);font-size:.74rem;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}

        /* header */
        .top{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding-block:18px}
        .brand{display:flex;align-items:center;gap:.6rem;font-family:var(--f-display);font-weight:700;font-size:1.25rem;letter-spacing:-.02em;text-decoration:none}
        .brand svg{width:30px;height:30px;border-radius:8px;border:1px solid var(--line);display:block}
        .btn{display:inline-flex;align-items:center;gap:.5rem;background:var(--fg);color:var(--bg);font-weight:600;font-size:.95rem;text-decoration:none;padding:.8rem 1.3rem;border-radius:999px;border:0;cursor:pointer;transition:transform .2s,background .2s}
        .btn:hover{transform:translateY(-2px);background:var(--accent);color:var(--accent-fg)}
        .btn.ghost{background:transparent;color:var(--fg);border:1px solid var(--line)}
        .btn.ghost:hover{background:var(--card);color:var(--fg);border-color:var(--fg)}

        /* intro */
        .intro{padding-block:clamp(36px,8vw,88px) clamp(28px,5vw,56px);display:grid;gap:1.4rem;justify-items:start}
        .intro h1{font-size:clamp(2.5rem,8.2vw,6rem);max-width:13ch}
        .intro p{color:var(--muted);font-size:1.15rem;max-width:34ch}
        .skip{font-family:var(--f-mono);font-size:.8rem;text-decoration:none;color:var(--muted);border-bottom:1px solid var(--line);padding-bottom:2px}
        .skip:hover{color:var(--fg);border-color:var(--fg)}

        /* tour */
        .tour{height:calc(100svh * 4.6);position:relative}
        .stage{position:sticky;top:env(safe-area-inset-top,0px);height:100svh;display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:clamp(32px,7vw,110px);max-width:1120px;margin-inline:auto}
        .txt{display:grid;gap:1.6rem;min-width:0}
        .chaps{display:grid}
        .chap{grid-area:1/1;display:grid;gap:1.1rem;align-content:center;opacity:0;visibility:hidden;transform:translateY(22px);transition:opacity .5s,transform .5s,visibility 0s .5s}
        .chap.on{opacity:1;visibility:visible;transform:none;transition:opacity .5s .1s,transform .5s .1s}
        .chap h2{font-size:clamp(2rem,4.6vw,3.7rem)}
        .chap p{color:var(--muted);max-width:34ch;font-size:1.08rem}
        .chips{display:flex;flex-wrap:wrap;gap:.5rem}
        .chip{font-family:var(--f-mono);font-size:.74rem;padding:.35rem .7rem;border:1px solid var(--line);border-radius:999px;background:var(--card)}
        .chip::before{content:"";display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--accent);margin-right:.5rem;vertical-align:1px}
        .prog{display:flex;gap:6px;max-width:320px}
        .prog i{flex:1;height:3px;border-radius:3px;background:var(--line);position:relative;overflow:hidden}
        .prog i::after{content:"";position:absolute;inset:0;background:var(--fg);transform:scaleX(0);transform-origin:left;transition:transform .6s}
        .prog i.done::after,.prog i.on::after{transform:scaleX(1)}
        .prog i.on::after{background:var(--accent)}
        .phone-col{display:grid;justify-items:center;gap:.7rem}
        .fit{position:relative}
        .cap{font-family:var(--f-mono);font-size:.7rem;color:var(--muted);letter-spacing:.06em}

        /* phone */
        .phone{width:280px;height:560px;padding:8px;border-radius:42px;background:#050506;box-shadow:0 0 0 1px #2a2d33,0 30px 70px -20px rgba(10,11,13,.45);transform-origin:0 0;position:absolute;left:0;top:0}
        .screen{position:relative;height:100%;border-radius:34px;overflow:hidden;background:var(--screen);color:var(--fg);font-size:12px;line-height:1.4}
        .page{will-change:transform;padding-bottom:150px}
        .shead{display:flex;align-items:center;justify-content:space-between;padding:14px 16px 8px;font-family:var(--f-display);font-weight:700;letter-spacing:.14em;font-size:13px}
        .shead span{font-family:var(--f-mono);font-size:10px;letter-spacing:0;font-weight:500;color:var(--muted)}
        .w{position:relative;margin:8px 12px;transition:outline-color .3s}
        .w.hl{outline:2px solid var(--accent);outline-offset:4px;border-radius:12px;animation:pulse 1.8s ease-in-out infinite}
        @keyframes pulse{50%{outline-color:transparent}}
        .wtag{position:absolute;top:-17px;left:6px;z-index:3;font-family:var(--f-mono);font-size:8.5px;letter-spacing:.06em;text-transform:uppercase;background:var(--accent);color:var(--accent-fg);padding:2px 7px;border-radius:99px;opacity:0;transform:translateY(4px);transition:.3s;white-space:nowrap}
        .w.hl .wtag{opacity:1;transform:none}
        .ship{background:var(--soft);border-radius:10px;padding:9px 11px;display:grid;gap:6px}
        .ship b{font-weight:600}
        .bar{height:6px;border-radius:6px;background:var(--line);overflow:hidden}
        .bar i{display:block;height:100%;width:0;background:var(--ok);border-radius:6px;transition:width 1.2s cubic-bezier(.2,.8,.2,1)}
        .vis{height:218px;margin:6px 0 0;background:linear-gradient(var(--vis1),var(--vis2));position:relative;overflow:hidden}
        .ufo{position:absolute;left:50%;bottom:34px;width:150px;height:96px;transform:translateX(-50%);animation:float 4s ease-in-out infinite}
        @keyframes float{50%{transform:translate(-50%,-7px)}}
        .dome{position:absolute;left:34px;top:0;width:82px;height:46px;border-radius:82px 82px 0 0;background:linear-gradient(160deg,rgba(255,255,255,.9),rgba(160,175,205,.45));border:1px solid rgba(120,135,165,.4);border-bottom:0}
        .hull{position:absolute;left:0;bottom:8px;width:150px;height:44px;border-radius:50%;background:linear-gradient(#fff,#b9c0cf 70%,#8c95a8);box-shadow:0 8px 14px -6px rgba(10,11,13,.35)}
        .leds{position:absolute;left:0;right:0;bottom:22px;display:flex;justify-content:center;gap:11px}
        .leds b{width:7px;height:7px;border-radius:50%;background:var(--accent);box-shadow:0 0 10px 2px var(--accent);animation:led 3s linear infinite}
        .leds b:nth-child(2){animation-delay:-.6s}.leds b:nth-child(3){animation-delay:-1.2s}.leds b:nth-child(4){animation-delay:-1.8s}.leds b:nth-child(5){animation-delay:-2.4s}
        @keyframes led{0%{filter:hue-rotate(0)}100%{filter:hue-rotate(360deg)}}
        .mist{position:absolute;left:50%;bottom:118px;width:0;height:0}
        .mist i{position:absolute;left:-18px;width:36px;height:36px;border-radius:50%;background:#fff;filter:blur(9px);opacity:0;animation:rise 4.5s ease-out infinite}
        .mist i:nth-child(2){animation-delay:-1.1s;left:-30px}.mist i:nth-child(3){animation-delay:-2.2s;left:-6px}.mist i:nth-child(4){animation-delay:-3.3s;left:-24px}
        @keyframes rise{0%{opacity:0;transform:translateY(0) scale(.6)}25%{opacity:.85}100%{opacity:0;transform:translateY(-80px) scale(2)}}
        .badge{position:absolute;top:10px;left:12px;background:var(--fg);color:var(--bg);font-family:var(--f-mono);font-size:9px;padding:2px 8px;border-radius:99px}
        .pinfo{padding:12px 16px 0;display:grid;gap:5px}
        .pinfo h4{margin:0;font-family:var(--f-display);font-size:17px;line-height:1.15;letter-spacing:-.02em}
        .stars{color:#F5A524;letter-spacing:1px;font-size:11px}
        .price{font-family:var(--f-display);font-size:24px;font-weight:700;letter-spacing:-.03em}
        .sub{color:var(--muted);font-size:11px}
        .stock{display:grid;gap:6px;padding:9px 11px;border:1px solid var(--line);border-radius:10px}
        .stock .row{display:flex;justify-content:space-between;align-items:center}
        .stock .bar i{background:var(--warn)}
        .dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--warn);margin-right:6px;animation:blink 1.4s infinite}
        @keyframes blink{50%{opacity:.25}}
        .sec-t{font-family:var(--f-mono);font-size:9.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);padding:14px 16px 0}
        .packs{display:grid;gap:7px}
        .pack{display:flex;justify-content:space-between;align-items:center;gap:8px;text-align:left;font:inherit;color:inherit;background:var(--screen);border:1.5px solid var(--line);border-radius:10px;padding:9px 11px;cursor:pointer;position:relative;transition:border-color .25s,background .25s,transform .25s}
        .pack small{display:block;color:var(--muted);font-size:10px}
        .pack.sel{border-color:var(--accent);background:var(--soft);transform:scale(1.02)}
        .pack .am{text-align:right;font-weight:700;font-variant-numeric:tabular-nums}
        .pack s{display:block;color:var(--muted);font-weight:400;font-size:10px}
        .pack em{position:absolute;top:-8px;right:10px;background:var(--accent);color:var(--accent-fg);font-family:var(--f-mono);font-size:8px;padding:1px 6px;border-radius:99px}
        .vid{height:96px;border-radius:10px;background:linear-gradient(135deg,#0A0B0D,#2a3045);display:grid;place-items:center;color:#fff}
        .vid span{width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.18);display:grid;place-items:center;backdrop-filter:blur(4px)}
        .rev{display:grid;gap:7px}
        .rc{border:1px solid var(--line);border-radius:10px;padding:9px 11px;display:grid;gap:3px}
        .rc b{font-weight:600}
        table.cmp{width:100%;border-collapse:collapse;font-size:11px}
        table.cmp th,table.cmp td{padding:6px 4px;border-bottom:1px solid var(--line);text-align:center}
        table.cmp th:first-child,table.cmp td:first-child{text-align:left}
        table.cmp th{font-family:var(--f-mono);font-size:9px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted)}
        .y{color:var(--ok);font-weight:700}.n{color:var(--warn);font-weight:700}
        .faq{display:grid;gap:0;margin:8px 16px}
        .faq div{display:flex;justify-content:space-between;padding:9px 0;border-bottom:1px solid var(--line)}
        .sbar{position:absolute;left:0;right:0;bottom:0;z-index:5;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 12px 14px;background:var(--screen);border-top:1px solid var(--line)}
        .sbar .pr{font-family:var(--f-display);font-weight:700;font-size:16px;letter-spacing:-.02em;line-height:1.1}
        .sbar .pr small{display:block;font-family:var(--f-body);font-weight:400;font-size:9.5px;color:var(--muted);letter-spacing:0}
        .sbar button{flex:0 0 auto;background:var(--fg);color:var(--bg);border:0;border-radius:99px;font:600 12px var(--f-body);padding:10px 16px}
        .toast{position:absolute;left:12px;right:12px;bottom:68px;z-index:6;display:flex;gap:9px;align-items:center;background:var(--fg);color:var(--bg);padding:9px 12px;border-radius:12px;box-shadow:0 10px 24px -8px rgba(0,0,0,.45);opacity:0;transform:translateY(16px) scale(.97);transition:opacity .35s,transform .45s cubic-bezier(.2,1.2,.3,1);pointer-events:none}
        .toast.in{opacity:1;transform:none}
        .toast .av{flex:0 0 auto;width:26px;height:26px;border-radius:50%;background:var(--accent);color:var(--accent-fg);display:grid;place-items:center;font-weight:700;font-size:12px}
        .toast b{font-weight:600}.toast small{display:block;opacity:.65;font-size:10px}
        .ov{position:absolute;inset:0;z-index:8;background:rgba(5,5,8,.6);display:grid;align-items:end;opacity:0;visibility:hidden;transition:opacity .4s,visibility 0s .4s}
        .ov.on{opacity:1;visibility:visible;transition:opacity .4s}
        .ovc{background:var(--screen);border-radius:24px 24px 0 0;padding:18px 16px 22px;display:grid;gap:10px;justify-items:center;text-align:center;transform:translateY(40px);transition:transform .55s cubic-bezier(.2,.9,.2,1)}
        .ov.on .ovc{transform:none}
        .ovc h5{margin:0;font-family:var(--f-display);font-size:20px;letter-spacing:-.03em}
        .sc{position:relative;width:220px;height:110px;border-radius:14px;overflow:hidden;background:var(--soft);display:grid;place-items:center;align-content:center}
        .sc .pz{font-family:var(--f-display);font-weight:800;font-size:38px;letter-spacing:-.04em;line-height:1;color:var(--accent)}
        .sc .pz small{display:block;font-family:var(--f-body);font-weight:500;font-size:10px;letter-spacing:0;color:var(--muted);margin-top:4px}
        .sc canvas{position:absolute;inset:0;width:100%;height:100%;touch-action:none;cursor:crosshair;transition:opacity .5s}
        .ov.won .sc canvas{opacity:0;pointer-events:none}
        .fk{width:220px;border:1px solid var(--line);border-radius:10px;padding:9px 11px;text-align:left;color:var(--muted)}
        .ovc .go{width:220px;background:var(--accent);color:var(--accent-fg);border-radius:99px;padding:10px;font-weight:600;opacity:.45;transition:opacity .4s}
        .ov.won .go{opacity:1}

        /* generic sections */
        section.blk{padding-block:clamp(56px,9vw,120px)}
        .head{display:grid;gap:.9rem;margin-bottom:clamp(28px,5vw,56px)}
        .head h2{font-size:clamp(2rem,5.2vw,4rem);max-width:16ch}
        .head p{color:var(--muted);max-width:40ch;font-size:1.1rem}
        .rv{transition:opacity .7s,transform .7s}
        .rv.pre{opacity:0;transform:translateY(20px)}

        /* marquee */
        .mq{overflow:hidden;border-block:1px solid var(--line);padding-block:14px;display:grid;gap:10px;-webkit-mask:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);mask:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}
        .mq .tr{display:flex;width:max-content;animation:mq 38s linear infinite}
        .mq .tr.rev2{animation-direction:reverse;animation-duration:46s}
        .mq:hover .tr{animation-play-state:paused}
        .mq span{font-family:var(--f-display);font-weight:600;font-size:clamp(1.3rem,3.2vw,2.1rem);letter-spacing:-.02em;padding-inline:1.4rem;white-space:nowrap;display:flex;align-items:center;gap:2.8rem}
        .mq span::after{content:"";width:8px;height:8px;border-radius:50%;background:var(--accent)}
        .mq .tr.rev2 span{color:var(--muted)}
        @keyframes mq{to{transform:translateX(-50%)}}

        /* numbers */
        .nums{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem;border-top:1px solid var(--fg);padding-top:1.6rem}
        .nums div{display:grid;gap:.3rem}
        .nums b{font-family:var(--f-display);font-size:clamp(2.6rem,9vw,6.5rem);font-weight:700;letter-spacing:-.05em;line-height:.95;font-variant-numeric:tabular-nums}
        .nums span{color:var(--muted);font-size:.95rem}

        /* groups */
        .groups{display:grid}
        .gr{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1.4fr) minmax(0,1.5fr);gap:1.4rem;align-items:baseline;padding:1.5rem .4rem;border-top:1px solid var(--line);position:relative;isolation:isolate}
        .gr:last-child{border-bottom:1px solid var(--line)}
        .gr::before{content:"";position:absolute;inset:0;background:var(--card);transform:scaleY(0);transform-origin:bottom;transition:transform .35s cubic-bezier(.3,.8,.2,1);z-index:-1}
        .gr:hover::before{transform:scaleY(1)}
        .gr h3{font-size:clamp(1.3rem,2.6vw,1.9rem)}
        .gr p{color:var(--muted)}
        .gr .chips{justify-content:flex-start}

        /* steps */
        .steps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(1rem,3vw,2.5rem);position:relative}
        .steps .line{position:absolute;left:0;right:0;top:18px;height:2px;background:var(--fg);transform-origin:left;transition:transform 1.4s cubic-bezier(.3,.8,.2,1)}
        .js .steps .line{transform:scaleX(0)}
        .js .steps.in .line{transform:scaleX(1)}
        .st{position:relative;display:grid;gap:.6rem;padding-top:3.2rem}
        .st .n{position:absolute;top:0;left:0;width:38px;height:38px;border-radius:50%;background:var(--bg);border:2px solid var(--fg);display:grid;place-items:center;font-family:var(--f-mono);font-weight:600;font-size:.85rem}
        .st h3{font-size:1.5rem}
        .st p{color:var(--muted)}

        /* cta */
        .cta{background:var(--fg);color:var(--bg);border-radius:clamp(20px,3vw,36px);padding:clamp(36px,7vw,96px) clamp(22px,5vw,72px);display:grid;gap:1.4rem;justify-items:start;margin-bottom:clamp(36px,6vw,72px);position:relative;overflow:hidden}
        .cta h2{font-size:clamp(2.2rem,6.4vw,5rem);max-width:12ch}
        .cta p{opacity:.7;max-width:36ch;font-size:1.1rem}
        .cta .btn{background:var(--bg);color:var(--fg)}
        .cta .btn:hover{background:var(--accent);color:var(--accent-fg)}
        .cta .btn.ghost{background:transparent;color:var(--bg);border-color:rgba(128,128,128,.5)}
        .cta .row{display:flex;flex-wrap:wrap;gap:.7rem}
        .cta .orb{position:absolute;right:-8%;bottom:-40%;width:min(60vw,520px);aspect-ratio:1;border-radius:50%;background:radial-gradient(circle at 35% 35%,var(--accent),transparent 65%);opacity:.55;filter:blur(10px);animation:drift 9s ease-in-out infinite;pointer-events:none}
        @keyframes drift{50%{transform:translate(-6%,-8%) scale(1.08)}}
        footer{display:flex;flex-wrap:wrap;justify-content:space-between;gap:1rem;padding-block:0 40px;color:var(--muted);font-size:.85rem}

        @media (max-width:820px){
          .stage{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr) auto;gap:10px;align-content:stretch;padding-block:10px 14px}
          .phone-col{align-self:center;order:-1}
          .cap{display:none}
          .txt{gap:.9rem}
          .chap{gap:.6rem}
          .chap h2{font-size:1.75rem}
          .chap p{font-size:.95rem}
          .gr{grid-template-columns:1fr;gap:.6rem}
          .steps{grid-template-columns:1fr;gap:2rem}
          .steps .line{left:18px;right:auto;top:0;bottom:0;width:2px;height:auto;transform-origin:top}
          .js .steps .line{transform:scaleY(0)}
          .js .steps.in .line{transform:scaleY(1)}
          .st{padding-top:0;padding-left:3.4rem}
        }
        @media (prefers-reduced-motion: reduce){
          html{scroll-behavior:auto}
          *,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}
          .mq .tr{animation:none}
        }
      `}} />

      <div className="wrap">
        <header className="top">
          <a className="brand" href="#top" aria-label="Nevux">
            <svg viewBox="0 0 32 32" aria-hidden="true">
              <rect width="32" height="32" fill="#0A0B0D" />
              <path d="M9 24V8h3.2l7.6 10V8H23v16h-3.2L12.2 14v10z" fill="#fff" />
            </svg>
            Nevux
          </a>
          <a className="btn" data-cta href="#cta">
            Probar Nevux
          </a>
        </header>

        <section className="intro" id="top">
          <span className="eyebrow">Mirala por dentro</span>
          <h1>
            Una tienda con <em>Nevux</em>, de punta a punta.
          </h1>
          <p>Deslizá y recorrela como la ve tu cliente.</p>
          <a className="skip" href="#cta">
            Saltar ↓
          </a>
        </section>
      </div>

      <section
        className="tour"
        id="tour"
        aria-label="Recorrido por una tienda con Nevux"
      >
        <div className="stage">
          <div className="txt">
            <div className="chaps">
              <article className="chap on">
                <span className="eyebrow">Conversión</span>
                <h2>
                  Más ventas con las <em>mismas visitas</em>.
                </h2>
                <p>
                  Una barra de envío gratis y un contador de stock empujan la
                  decisión mientras la persona todavía mira el producto.
                </p>
                <div className="chips">
                  <span className="chip">Barra de envío gratis</span>
                  <span className="chip">Contador de stock</span>
                </div>
              </article>
              <article className="chap">
                <span className="eyebrow">Ticket promedio</span>
                <h2>
                  Que la gente <em>lleve más</em>.
                </h2>
                <p>
                  Llevá 1, llevá 2: el descuento crece con la cantidad y el
                  carrito sube solo.
                </p>
                <div className="chips">
                  <span className="chip">Combos por cantidad</span>
                </div>
              </article>
              <article className="chap">
                <span className="eyebrow">Confianza</span>
                <h2>
                  Que <em>confíen</em> antes de comprar.
                </h2>
                <p>
                  Reseñas, comparativa y avisos de compras recientes sacan la
                  última duda.
                </p>
                <div className="chips">
                  <span className="chip">Reseñas</span>
                  <span className="chip">Comparativa</span>
                  <span className="chip">Prueba social</span>
                </div>
              </article>
              <article className="chap">
                <span className="eyebrow">Captura</span>
                <h2>
                  Que no se vayan <em>sin dejar su contacto</em>.
                </h2>
                <p>
                  Un Raspá y Gana ofrece 15% OFF a cambio de WhatsApp o mail. Tu
                  base de contactos crece con cada visita.
                </p>
                <div className="chips">
                  <span className="chip">Raspá y Gana</span>
                </div>
              </article>
            </div>
            <div className="prog" aria-hidden="true">
              <i className="on"></i>
              <i></i>
              <i></i>
              <i></i>
            </div>
          </div>

          <div className="phone-col">
            <div className="fit" id="fit">
              <div className="phone" id="phone" aria-hidden="true">
                <div className="screen">
                  <div className="page" id="page">
                    <div className="shead">
                      BRUMA <span>Carrito (0)</span>
                    </div>

                    <div className="w ship" data-w="0">
                      <span className="wtag">Barra de envío gratis</span>
                      <div>
                        <b id="shipTxt">Te faltan $7.100</b> para el envío
                        gratis
                      </div>
                      <div className="bar">
                        <i id="shipFill"></i>
                      </div>
                    </div>

                    <div className="vis">
                      <span className="badge">NUEVO</span>
                      <div className="mist">
                        <i></i>
                        <i></i>
                        <i></i>
                        <i></i>
                      </div>
                      <div className="ufo">
                        <div className="dome"></div>
                        <div className="hull"></div>
                        <div className="leds">
                          <b></b>
                          <b></b>
                          <b></b>
                          <b></b>
                          <b></b>
                        </div>
                      </div>
                    </div>

                    <div className="pinfo">
                      <h4>Humidificador OVNI LED con efecto niebla</h4>
                      <div>
                        <span className="stars">★★★★★</span>{" "}
                        <span className="sub">4,8 · 214 opiniones</span>
                      </div>
                      <div className="price">$32.900</div>
                      <div className="sub">3 cuotas sin interés de $10.967</div>
                      <div className="sub">
                        <b style={{ color: "var(--ok)" }}>$31.255</b> con
                        transferencia
                      </div>
                    </div>

                    <div className="w stock" data-w="0">
                      <span className="wtag">Contador de stock</span>
                      <div className="row">
                        <span>
                          <i className="dot"></i>
                          <b>
                            Quedan <span id="stockN">7</span> unidades
                          </b>
                        </span>
                        <span className="sub">hoy</span>
                      </div>
                      <div className="bar">
                        <i id="stockFill" style={{ width: "18%" }}></i>
                      </div>
                    </div>

                    <div id="w-packs">
                      <div className="sec-t">Elegí tu pack</div>
                      <div className="w packs" data-w="1">
                        <span className="wtag">Combos por cantidad</span>
                        <button className="pack" type="button" data-n="1">
                          <span>
                            <b>Llevá 1</b>
                            <small>Precio de lista</small>
                          </span>
                          <span className="am">$32.900</span>
                        </button>
                        <button
                          className="pack sel"
                          type="button"
                          data-n="2"
                        >
                          <em>MÁS ELEGIDO</em>
                          <span>
                            <b>Llevá 2 · 15% OFF</b>
                            <small>Ahorrás $9.870</small>
                          </span>
                          <span className="am">
                            <s>$65.800</s>$55.930
                          </span>
                        </button>
                        <button className="pack" type="button" data-n="3">
                          <span>
                            <b>Llevá 3 · 20% OFF</b>
                            <small>Ahorrás $19.740</small>
                          </span>
                          <span className="am">
                            <s>$98.700</s>$78.960
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="sec-t">Miralo en uso</div>
                    <div className="w">
                      <div className="vid">
                        <span>▶</span>
                      </div>
                    </div>

                    <div id="w-reviews">
                      <div className="sec-t">Opiniones</div>
                      <div className="w rev" data-w="2">
                        <span className="wtag">Reseñas</span>
                        <div className="rc">
                          <span className="stars">★★★★★</span>
                          <b>Cami R. · Rosario</b>
                          <span className="sub">
                            Lo uso de noche y la luz es suave. Llegó en 3 días.
                          </span>
                        </div>
                        <div className="rc">
                          <span className="stars">★★★★★</span>
                          <b>Nico P. · Mendoza</b>
                          <span className="sub">
                            Silencioso y el tanque rinde toda la noche.
                          </span>
                        </div>
                      </div>
                      <div className="sec-t">OVNI vs. genérico</div>
                      <div className="w" data-w="2">
                        <span className="wtag">Comparativa</span>
                        <table className="cmp">
                          <tbody>
                            <tr>
                              <th></th>
                              <th>OVNI</th>
                              <th>Genérico</th>
                            </tr>
                            <tr>
                              <td>Luz LED</td>
                              <td className="y">✓</td>
                              <td className="n">✕</td>
                            </tr>
                            <tr>
                              <td>Apagado automático</td>
                              <td className="y">✓</td>
                              <td className="n">✕</td>
                            </tr>
                            <tr>
                              <td>Silencioso</td>
                              <td className="y">✓</td>
                              <td className="n">✕</td>
                            </tr>
                            <tr>
                              <td>Garantía</td>
                              <td className="y">✓</td>
                              <td className="n">✕</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="faq">
                      <div>
                        <span>Preguntas frecuentes</span>
                        <span>＋</span>
                      </div>
                      <div>
                        <span>Envíos</span>
                        <span>＋</span>
                      </div>
                      <div>
                        <span>Cambios</span>
                        <span>＋</span>
                      </div>
                    </div>
                  </div>

                  <div className="toast" id="toast">
                    <span className="av">B</span>
                    <span>
                      <b id="toastT">Alguien de Córdoba compró 2</b>
                      <small id="toastS">hace 3 minutos</small>
                    </span>
                  </div>

                  <div className="sbar">
                    <div className="pr">
                      <span id="sbPrice">$55.930</span>
                      <small id="sbSub">Llevá 2 · 15% OFF</small>
                    </div>
                    <button type="button" tabIndex={-1}>
                      Agregar al carrito
                    </button>
                  </div>

                  <div className="ov" id="ov">
                    <div className="ovc">
                      <span className="eyebrow">Antes de irte</span>
                      <h5>¡Raspá y ganá!</h5>
                      <div className="sc">
                        <div className="pz">
                          15% OFF<small>en tu primera compra</small>
                        </div>
                        <canvas id="scratch" width={220} height={110}></canvas>
                      </div>
                      <div className="fk">Tu WhatsApp o mail</div>
                      <div className="go">Quiero mi descuento</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <span className="cap">TIENDA DE EJEMPLO</span>
          </div>
        </div>
      </section>

      <div className="wrap">
        <section
          className="blk"
          style={{ paddingTop: "clamp(36px,6vw,72px)" }}
        >
          <div className="mq rv" aria-label="Algunos widgets de Nevux">
            <div className="tr">
              <span>Raspá y Gana</span>
              <span>Barra de envío gratis</span>
              <span>Contador de stock</span>
              <span>Reseñas</span>
              <span>Combos por cantidad</span>
              <span>Prueba social</span>
              <span>Captura de WhatsApp</span>
              <span>Comparativa</span>
              <span>Raspá y Gana</span>
              <span>Barra de envío gratis</span>
              <span>Contador de stock</span>
              <span>Reseñas</span>
              <span>Combos por cantidad</span>
              <span>Prueba social</span>
              <span>Captura de WhatsApp</span>
              <span>Comparativa</span>
            </div>
            <div className="tr rev2">
              <span>Más ticket</span>
              <span>Más confianza</span>
              <span>Más contactos</span>
              <span>Más urgencia</span>
              <span>Más conversión</span>
              <span>Más ticket</span>
              <span>Más confianza</span>
              <span>Más contactos</span>
              <span>Más urgencia</span>
              <span>Más conversión</span>
              <span>Más ticket</span>
              <span>Más confianza</span>
              <span>Más contactos</span>
              <span>Más urgencia</span>
              <span>Más conversión</span>
              <span>Más ticket</span>
            </div>
          </div>
        </section>

        <section className="blk" style={{ paddingTop: 0 }}>
          <div className="nums rv">
            <div>
              <b data-count="50">50</b>
              <span>widgets para tu tienda</span>
            </div>
            <div>
              <b data-count="5">5</b>
              <span>grupos de objetivos</span>
            </div>
            <div>
              <b>1</b>
              <span>clic para instalar</span>
            </div>
          </div>
        </section>

        <section className="blk" style={{ paddingTop: 0 }}>
          <div className="head rv">
            <span className="eyebrow">Por qué vende</span>
            <h2>Cada widget tiene un trabajo.</h2>
            <p>
              Los 50 se reparten en cinco objetivos. Elegís los que van con cada
              categoría y no saturás la tienda.
            </p>
          </div>
          <div className="groups">
            <div className="gr rv">
              <h3>Prueba social y urgencia</h3>
              <p>Muestra que otros compran y que el momento es ahora.</p>
              <div className="chips">
                <span className="chip">Prueba social</span>
                <span className="chip">Contador de stock</span>
              </div>
            </div>
            <div className="gr rv">
              <h3>Ticket promedio</h3>
              <p>Hace que cada carrito valga más.</p>
              <div className="chips">
                <span className="chip">Combos por cantidad</span>
                <span className="chip">Barra de envío gratis</span>
              </div>
            </div>
            <div className="gr rv">
              <h3>Captura y retención</h3>
              <p>Convierte visitas en contactos que podés volver a escribir.</p>
              <div className="chips">
                <span className="chip">Raspá y Gana</span>
              </div>
            </div>
            <div className="gr rv">
              <h3>Confianza, envíos y pagos</h3>
              <p>Responde las dudas antes de que frenen la compra.</p>
              <div className="chips">
                <span className="chip">Reseñas</span>
                <span className="chip">Comparativa</span>
              </div>
            </div>
            <div className="gr rv">
              <h3>IA e interacción</h3>
              <p>Conversa con quien visita y lo guía hacia el producto.</p>
              <div className="chips">
                <span className="chip">Asistente</span>
              </div>
            </div>
          </div>
        </section>

        <section className="blk" style={{ paddingTop: 0 }}>
          <div className="head rv">
            <span className="eyebrow">Cómo se pone en tu tienda</span>
            <h2>Tres pasos y ya está.</h2>
          </div>
          <div className="steps rv" id="steps">
            <div className="line"></div>
            <div className="st">
              <span className="n">1</span>
              <h3>Elegís los widgets</h3>
              <p>Los que van con tu producto y tu categoría.</p>
            </div>
            <div className="st">
              <span className="n">2</span>
              <h3>Cambiás textos y colores</h3>
              <p>Lo dejás con la voz de tu marca.</p>
            </div>
            <div className="st">
              <span className="n">3</span>
              <h3>Lo instalás con 1 clic</h3>
              <p>Se conecta una sola vez y queda andando.</p>
            </div>
          </div>
        </section>

        <section className="cta rv" id="cta">
          <div className="orb"></div>
          <span className="eyebrow" style={{ color: "inherit", opacity: 0.6 }}>
            Tu tienda
          </span>
          <h2>Tu tienda, con estos widgets.</h2>
          <p>Armalo en minutos, sin tocar código.</p>
          <div className="row">
            <a className="btn" data-cta href="#cta">
              Probar Nevux
            </a>
            <a className="btn ghost" href="#tour">
              Ver el recorrido
            </a>
          </div>
        </section>

        <footer>
          <span>Nevux © 2026</span>
          <span>La tienda del recorrido es un ejemplo.</span>
        </footer>
      </div>
    </>
  );
                                }
