(() => {
  "use strict";
  const book = window.AVPSalesHandbook;
  if (!book) return;

  const $ = id => document.getElementById(id);
  const key = "avp_sales_handbook_v1";
  const state = (() => {
    try { return JSON.parse(localStorage.getItem(key) || "{}"); } catch (_) { return {}; }
  })();
  state.read = Array.isArray(state.read) ? state.read : [];
  state.bookmarks = Array.isArray(state.bookmarks) ? state.bookmarks : [];
  let index = Math.max(0, Math.min(Number(state.index || 0), book.chapters.length - 1));

  function save() {
    state.index = index;
    localStorage.setItem(key, JSON.stringify(state));
  }

  function esc(s) {
    return String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  }

  function renderList() {
    $("chapterList").innerHTML = book.chapters.map((c, i) => {
      const active = i === index ? " active" : "";
      const done = state.read.includes(c.id) ? " done" : "";
      return `<button class="phb-toc-item${active}${done}" data-i="${i}" type="button">
        <span>${esc(c.no)}</span><strong>${esc(c.title)}</strong><small>${state.read.includes(c.id) ? "✓ Đã đọc" : esc(c.short)}</small>
      </button>`;
    }).join("");
    $("chapterList").querySelectorAll("[data-i]").forEach(btn => {
      btn.onclick = () => {
        index = Number(btn.dataset.i);
        save(); render();
        document.body.classList.remove("phb-toc-open");
        window.scrollTo({top:0,behavior:"smooth"});
      };
    });
  }

  function revealBlock(s, idx) {
    return `<section class="phb-block phb-reveal" data-reveal="${idx}">
      <button class="phb-reveal-btn" type="button">${esc(s.label || "▶ Xem")}</button>
      <div class="phb-reveal-panel" hidden>
        <span>PROFESSIONAL NOTE</span>
        <h3>${esc(s.title)}</h3>
        <p class="phb-type-target" data-text="${esc(s.text)}"></p>
        <button class="phb-skip-type" type="button">Hiện toàn bộ</button>
      </div>
    </section>`;
  }

  function checkpointBlock(s, idx) {
    return `<section class="phb-block phb-checkpoint" data-checkpoint="${idx}">
      <span>MINI CHECKPOINT</span>
      <h3>${esc(s.title)}</h3>
      <p>${esc(s.question)}</p>
      <div class="phb-options">${s.options.map((o,i)=>`<button type="button" data-option="${i}">${esc(o)}</button>`).join("")}</div>
      <div class="phb-answer" hidden></div>
    </section>`;
  }

  function renderSection(s, idx) {
    if (s.type === "reveal") return revealBlock(s, idx);
    if (s.type === "checkpoint") return checkpointBlock(s, idx);
    const cls = {
      section:"phb-section",
      example:"phb-example",
      check:"phb-check",
      warning:"phb-warning"
    }[s.type] || "phb-section";
    return `<section class="phb-block ${cls}">
      ${s.type !== "section" ? `<span>${s.type === "example" ? "WORK EXAMPLE" : s.type === "check" ? "PROFESSIONAL CHECK" : "COMMON MISTAKE"}</span>` : ""}
      <h3>${esc(s.title)}</h3>${s.html || ""}
    </section>`;
  }

  function typeText(target, text) {
    if (!target || target.dataset.typing === "1") return;
    target.dataset.typing = "1";
    target.textContent = "";
    let i = 0, timer = 0;
    const tick = () => {
      if (i >= text.length) {
        target.dataset.typing = "0";
        return;
      }
      const ch = text[i++];
      target.textContent += ch;
      let delay = 24;
      if (/[.!?]/.test(ch)) delay = 115;
      else if (/[,;:]/.test(ch)) delay = 65;
      else if (ch === " ") delay = 12;
      timer = window.setTimeout(tick, delay);
      target._typeTimer = timer;
    };
    tick();
  }

  function bindInteractive(ch) {
    document.querySelectorAll(".phb-reveal").forEach(el => {
      const btn = el.querySelector(".phb-reveal-btn");
      const panel = el.querySelector(".phb-reveal-panel");
      const target = el.querySelector(".phb-type-target");
      const skip = el.querySelector(".phb-skip-type");
      const text = target.dataset.text || "";
      btn.onclick = () => {
        panel.hidden = false;
        btn.hidden = true;
        typeText(target, text);
      };
      skip.onclick = () => {
        clearTimeout(target._typeTimer);
        target.dataset.typing = "0";
        target.textContent = text;
        skip.hidden = true;
      };
    });

    document.querySelectorAll(".phb-checkpoint").forEach((el, si) => {
      const sec = ch.sections.filter(s => s.type === "checkpoint")[si];
      if (!sec) return;
      el.querySelectorAll("[data-option]").forEach(btn => {
        btn.onclick = () => {
          const chosen = Number(btn.dataset.option);
          el.querySelectorAll("[data-option]").forEach(x => x.disabled = true);
          btn.classList.add(chosen === sec.answer ? "correct" : "wrong");
          if (chosen !== sec.answer) {
            const correct = el.querySelector(`[data-option="${sec.answer}"]`);
            if (correct) correct.classList.add("correct");
          }
          const ans = el.querySelector(".phb-answer");
          ans.hidden = false;
          ans.innerHTML = `<strong>${chosen === sec.answer ? "✓ Chính xác" : "Chưa chính xác"}</strong><p>${esc(sec.explain)}</p>`;
        };
      });
    });
  }

  function updateProgress() {
    const total = book.chapters.length;
    const pct = Math.round((state.read.length / total) * 100);
    $("readingPercent").textContent = `${pct}%`;
    $("readingBar").style.width = `${pct}%`;
    $("chapterCounter").textContent = `Chương ${index + 1} / ${total}`;
  }

  function render() {
    const ch = book.chapters[index];
    $("bookTitle").textContent = book.title;
    $("chapterNo").textContent = ch.no;
    $("chapterTitle").textContent = ch.title;
    $("chapterSummary").textContent = ch.summary;
    $("sideChapterTitle").textContent = ch.title;
    $("sideChapterDesc").textContent = ch.short;
    $("chapterContent").innerHTML = ch.sections.map(renderSection).join("");
    $("prevChapter").disabled = index === 0;
    $("nextChapter").disabled = index === book.chapters.length - 1;

    const marked = state.bookmarks.includes(ch.id);
    $("bookmarkBtn").textContent = marked ? "★ Đã đánh dấu" : "☆ Đánh dấu";
    const read = state.read.includes(ch.id);
    $("markReadBtn").textContent = read ? "✓ Đã đọc" : "✓ Đánh dấu đã đọc";
    $("markReadBtn").classList.toggle("is-read", read);

    bindInteractive(ch);
    renderList();
    updateProgress();
    save();
  }

  $("prevChapter").onclick = () => { if (index > 0) { index--; render(); window.scrollTo({top:0,behavior:"smooth"}); } };
  $("nextChapter").onclick = () => { if (index < book.chapters.length - 1) { index++; render(); window.scrollTo({top:0,behavior:"smooth"}); } };
  $("markReadBtn").onclick = () => {
    const id = book.chapters[index].id;
    if (!state.read.includes(id)) state.read.push(id);
    else state.read = state.read.filter(x => x !== id);
    render();
  };
  $("bookmarkBtn").onclick = () => {
    const id = book.chapters[index].id;
    if (!state.bookmarks.includes(id)) state.bookmarks.push(id);
    else state.bookmarks = state.bookmarks.filter(x => x !== id);
    render();
  };
  $("tocToggle").onclick = () => document.body.classList.add("phb-toc-open");
  $("tocClose").onclick = () => document.body.classList.remove("phb-toc-open");

  render();
})();