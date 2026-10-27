(() => {
  const content = window.BIRTHDAY_CONTENT;
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const themes = ["dusk", "dusk", "dusk", "dusk", "garden", "dusk", "midnight", "letter", "finale", "letter", "finale", "endless"];
  const chapterMessages = ["", "Opening your little universe…", "One memory unlocked…", "A little surprise is waiting…", "Let's go to the garden…", "Something is floating your way…", "Look up…", "Slowing everything down…", "One last thing…", "Four tiny notes are waiting…", "For all our tomorrows…", "A little forever is still unfolding…"];
  const chapters = $$(".chapter");
  const lastChapter = chapters.length - 1;
  const bouquetReveal = $("#bouquet-reveal");
  let bouquetTrigger = null;
  let currentChapter = 0;
  let endlessFrameObserver = null;
  let endlessLoadObserver = null;
  let activeGiftAudio = null;

  function toast(message) {
    const element = $("#toast");
    element.textContent = message;
    element.classList.add("show");
    setTimeout(() => element.classList.remove("show"), 2600);
  }

  function unlock(chapter) { $("#chapter-" + chapter + " .next")?.classList.add("show"); }

  function closeBouquetReveal(restoreFocus = true) {
    bouquetReveal.classList.remove("show");
    bouquetReveal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("bouquet-open");
    if (restoreFocus && bouquetTrigger instanceof HTMLElement) bouquetTrigger.focus();
    bouquetTrigger = null;
  }

  function showBouquetReveal(trigger) {
    bouquetTrigger = trigger || document.activeElement;
    $("#bouquet-reveal-copy").textContent = content.bouquet;
    bouquetReveal.classList.add("show");
    bouquetReveal.setAttribute("aria-hidden", "false");
    document.body.classList.add("bouquet-open");
    setTimeout(() => $("#close-bouquet").focus(), reduceMotion ? 0 : 180);
  }

  function showChapter(chapter, withTransition = true) {
    if (!Number.isInteger(chapter) || chapter < 0 || chapter > lastChapter) return;
    const activeSection = $("#chapter-" + chapter);
    if (!activeSection) return;
    const transitionMessage = activeSection.dataset.transition || chapterMessages[chapter] || "";
    const reveal = () => {
      closeBouquetReveal(false);
      if (chapter !== 11) {
        endlessFrameObserver?.disconnect();
        endlessLoadObserver?.disconnect();
      }
      chapters.forEach((section, index) => section.classList.toggle("active", index === chapter));
      $("#chapter-restart").hidden = chapter !== 11;
      currentChapter = chapter;
      document.body.dataset.theme = activeSection.dataset.theme || themes[chapter] || "dusk";
      $("#progress").textContent = String(chapter).padStart(2, "0") + " / " + String(lastChapter).padStart(2, "0") + " · Our Little Journey";
      localStorage.setItem("birthday-universe-chapter", chapter);
      scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      initialise[chapter]?.();
    };
    if (!withTransition || reduceMotion || !transitionMessage) return reveal();
    const transition = $("#transition");
    transition.textContent = transitionMessage;
    transition.classList.add("show");
    setTimeout(() => { reveal(); transition.classList.remove("show"); }, 1050);
  }

  function typeText(element, text, complete) {
    if (reduceMotion) { element.textContent = text; complete?.(); return; }
    element.textContent = "";
    let index = 0;
    const type = () => { element.textContent = text.slice(0, ++index); index < text.length ? setTimeout(type, 20) : complete?.(); };
    type();
  }

  function confetti(count = 55, originX = innerWidth / 2, originY = innerHeight / 2) {
    if (reduceMotion) return;
    const colors = ["#ffb4c7", "#f26e97", "#ffe6a1", "#b9c5ff"];
    for (let index = 0; index < count; index++) {
      const particle = document.createElement("i");
      particle.className = "burst";
      particle.style.left = originX + "px"; particle.style.top = originY + "px";
      particle.style.background = colors[index % colors.length];
      particle.style.setProperty("--x", (Math.random() - .5) * 360 + "px");
      particle.style.setProperty("--y", (-Math.random() * 300 + 80) + "px");
      document.body.append(particle);
      setTimeout(() => particle.remove(), 1450);
    }
  }

  function petalBurst(count = 28, originX = innerWidth / 2, originY = innerHeight / 2) {
    if (reduceMotion) return;
    for (let index = 0; index < count; index++) {
      const petal = document.createElement("i");
      petal.className = "petal-burst";
      petal.style.left = originX + "px";
      petal.style.top = originY + "px";
      petal.style.setProperty("--x", (Math.random() - 0.5) * 360 + "px");
      petal.style.setProperty("--y", (Math.random() * 220 + 70) + "px");
      document.body.append(petal);
      setTimeout(() => petal.remove(), 1650);
    }
  }

  function releaseMusicNotes() {
    if (reduceMotion) return;
    const origin = $("#music-button").getBoundingClientRect();
    ["♪", "♫", "♡", "♪"].forEach((note, index) => {
      const element = document.createElement("i");
      element.className = "music-note";
      element.textContent = note;
      element.style.left = origin.left + origin.width / 2 + "px";
      element.style.top = origin.bottom + "px";
      element.style.setProperty("--x", (index - 1.5) * 21 + "px");
      element.style.setProperty("--y", -(55 + index * 19) + "px");
      document.body.append(element);
      setTimeout(() => element.remove(), 1600);
    });
  }

  const initialise = {
    1() {
      const envelope = $("#envelope"), letter = $("#envelope-text");
      letter.textContent = ""; envelope.hidden = false;
      envelope.onclick = () => { envelope.hidden = true; confetti(32); typeText(letter, content.envelope, () => unlock(1)); };
    },
    2() {
      const holder = $("#polaroids");
      const renderYear = yearIndex => {
        const album = content.memoryYears[yearIndex];
        const opened = new Set();
        const albumPhotos = Array.isArray(album.photos) ? album.photos : [1, 2, 3, 4, 5, 6].map(photo => String(photo).padStart(2, "0") + ".jpg");
        holder.innerHTML = `<div class="year-picker">${content.memoryYears.map((year, index) => `<button class="year-tab ${index === yearIndex ? "selected" : ""}" data-year="${index}" type="button">${year.year}</button>`).join("")}</div><p class="album-note">${album.note}</p><p class="album-progress">Open each little Polaroid · <b>0 / ${albumPhotos.length}</b></p><div class="year-album">${albumPhotos.map((file, index) => { const photo = index + 1; return `<button class="memory-photo" data-photo="${photo}" type="button" aria-label="Open ${album.year} memory ${photo}"><img src="assets/images/memories/${album.year}/${encodeURIComponent(file)}" alt="${album.year} memory ${photo}" onerror="this.closest('.memory-photo').classList.add('is-placeholder');this.remove()"><em class="memory-placeholder">Place photo ${photo}<br>right here ♡</em><span>${album.year} · ${photo}</span></button>`; }).join("")}</div>`;
        $$(".year-tab", holder).forEach(tab => tab.onclick = () => renderYear(Number(tab.dataset.year)));
        $$(".memory-photo", holder).forEach(photo => photo.onclick = () => {
          photo.classList.toggle("open");
          opened.add(photo.dataset.photo);
          $(".album-progress b", holder).textContent = opened.size + " / 6";
          if (opened.size === albumPhotos.length) unlock(2);
        });
      };
      renderYear(content.memoryYears.length - 1);
    },
    3() {
      const holder = $("#quiz"); let questionIndex = 0;
      const ask = () => {
        const question = content.quiz[questionIndex];
        holder.innerHTML = `<p class="eyebrow">${questionIndex + 1} / ${content.quiz.length}</p><h3>${question.question}</h3>${question.options.map((option, index) => `<button class="quiz-option" data-answer="${index}" type="button">${option}</button>`).join("")}<p class="quiz-note"></p>`;
        $$(".quiz-option", holder).forEach(button => button.onclick = () => {
          const correct = Number(button.dataset.answer) === question.answer;
          $$(".quiz-option", holder).forEach(option => option.disabled = true);
          button.classList.add(correct ? "correct" : "wrong"); if (correct) confetti(55);
          $(".quiz-note", holder).textContent = (correct ? question.correct : question.wrong) + " " + question.detail;
          const next = document.createElement("button"); next.className = "button"; next.textContent = questionIndex + 1 === content.quiz.length ? "Finish 💗" : "Next question →";
          next.onclick = () => { questionIndex++; questionIndex < content.quiz.length ? ask() : (holder.innerHTML = '<p class="script">You know us so well. 💗</p>', unlock(3)); };
          holder.append(next);
        });
      };
      ask();
    },
    4() {
      const holder = $("#garden"); let grown = 0;
      $("#flower-reason").textContent = ""; $("#bouquet").textContent = "";
      holder.innerHTML = content.reasons.map((_, index) => `<button class="plot" data-index="${index}" type="button" aria-label="Plant flower ${index + 1}"></button>`).join("");
      $$(".plot", holder).forEach(plot => plot.onclick = () => {
        if (plot.firstChild) return;
        const index = Number(plot.dataset.index);
        plot.innerHTML = `<span class="tulip tulip-${index % 3}" aria-hidden="true"><i class="tulip-stem"></i><i class="tulip-leaf tulip-leaf-left"></i><i class="tulip-leaf tulip-leaf-right"></i><span class="tulip-head"><b></b><b></b><b></b></span></span>`;
        const plotRect = plot.getBoundingClientRect();
        $("#flower-reason").textContent = content.reasons[index];
        confetti(12, plotRect.x + plotRect.width / 2, plotRect.y + 45);
        petalBurst(7, plotRect.x + plotRect.width / 2, plotRect.y + 30);
        if (++grown !== content.reasons.length) return;
        const gardenRect = holder.getBoundingClientRect();
        $$(".tulip", holder).forEach((tulip, tulipIndex) => {
          const tulipRect = tulip.getBoundingClientRect();
          tulip.animate([
            { transform: "translate(0, 0) scale(1)", opacity: 1 },
            { transform: `translate(${gardenRect.left + gardenRect.width / 2 - (tulipRect.left + tulipRect.width / 2)}px, ${gardenRect.top + gardenRect.height * 0.35 - (tulipRect.top + tulipRect.height / 2)}px) scale(0.45) rotate(${(tulipIndex - 2) * 15}deg)`, opacity: 0.25 }
          ], { duration: reduceMotion ? 0 : 650 + tulipIndex * 55, easing: "cubic-bezier(.2,.9,.25,1)", fill: "forwards" });
        });
        petalBurst(46, gardenRect.left + gardenRect.width / 2, gardenRect.top + gardenRect.height / 2);
        setTimeout(() => {
          $("#flower-reason").textContent = "";
          const bouquet = $("#bouquet");
          bouquet.innerHTML = `<button class="bouquet-reopen" type="button"><img class="real-bouquet" src="assets/images/tulip-bouquet.png" alt="A bouquet of pink tulips"><span></span><small>Tap to hold your bouquet close ♡</small></button>`;
          $("span", bouquet).textContent = content.bouquet;
          const reopen = $(".bouquet-reopen", bouquet);
          reopen.onclick = () => showBouquetReveal(reopen);
          confetti(75, gardenRect.left + gardenRect.width / 2, gardenRect.top + gardenRect.height / 2);
          unlock(4);
          setTimeout(() => { if (currentChapter === 4) showBouquetReveal(reopen); }, reduceMotion ? 0 : 380);
        }, reduceMotion ? 0 : 700);
      });
    },
    5() {
      const holder = $("#gifts"), message = $("#gift-message"); message.innerHTML = "";
      const keepsakes = [
        `<span class="keepsake keepsake-letter" aria-hidden="true"><i class="paper"></i><i class="flap"></i><i class="seal">♥</i></span><span class="gift-label">a love note</span>`,
        `<span class="keepsake keepsake-music" aria-hidden="true"><i class="record"></i></span><span class="gift-label">our soundtrack</span>`,
        `<span class="keepsake keepsake-music" aria-hidden="true"><i class="record"></i></span><span class="gift-label">our second song</span>`
      ];
      holder.innerHTML = content.gifts.map((gift, index) => `<button class="gift gift-${index + 1}" data-index="${index}" type="button" aria-label="Open ${gift.title}">${keepsakes[index]}</button>`).join("");
      $$(".gift", holder).forEach(button => button.onclick = () => {
        const gift = content.gifts[button.dataset.index];
        const giftRect = button.getBoundingClientRect();
        holder.classList.add("has-open");
        $$(".gift", holder).forEach(item => item.classList.toggle("open", item === button));
        message.innerHTML = `<h3>${gift.title}</h3><p>${gift.body}</p>`;
        if (gift.audio) {
          if (activeGiftAudio) { activeGiftAudio.pause(); activeGiftAudio = null; }
          $("#song").pause();
          $("#music-button").textContent = "♪";
          $("#music-button").setAttribute("aria-pressed", "false");
          activeGiftAudio = new Audio(gift.audio);
          activeGiftAudio.play().catch(() => toast("Couldn't start this song. Please check the MP3 file."));
          activeGiftAudio.onended = () => { activeGiftAudio = null; };
          const playing = document.createElement("p");
          playing.className = "gift-now-playing";
          playing.textContent = "♫ Now playing from our 2021 soundtrack";
          message.append(playing);
        }
        if (gift.link) {
          const link = document.createElement("a");
          link.className = "gift-link";
          link.href = gift.link;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          link.textContent = gift.linkLabel || "Open this little surprise ↗";
          message.append(link);
        }
        confetti(58, giftRect.x + giftRect.width / 2, giftRect.y + giftRect.height / 2);
        petalBurst(22, giftRect.x + giftRect.width / 2, giftRect.y + giftRect.height / 2);
        unlock(5);
      });
    },
    6() {
      const holder = $("#constellation"), positions = [[14,30],[35,70],[54,22],[75,61],[88,28],[50,49]]; let lit = new Set(); $("#wish").textContent = "";
      const lines = positions.slice(1).map((position, index) => `<line class="constellation-line line-${index}" x1="${positions[index][0]}" y1="${positions[index][1]}" x2="${position[0]}" y2="${position[1]}" />`).join("");
      holder.innerHTML = `<svg class="constellation-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${lines}</svg>${content.wishes.map((_, index) => `<button class="star" style="left:${positions[index % positions.length][0]}%;top:${positions[index % positions.length][1]}%" data-index="${index}" type="button" aria-label="Light star ${index + 1}">✦</button>`).join("")}`;
      $$(".star", holder).forEach(star => star.onclick = () => {
        const index = Number(star.dataset.index);
        const starRect = star.getBoundingClientRect();
        star.classList.add("lit");
        if (!lit.has(index)) {
          lit.add(index);
          holder.querySelector(`.line-${index - 1}`)?.classList.add("lit");
          holder.querySelector(`.line-${index}`)?.classList.add("lit");
          confetti(18, starRect.x + starRect.width / 2, starRect.y + starRect.height / 2);
          petalBurst(5, starRect.x + starRect.width / 2, starRect.y + starRect.height / 2);
        }
        typeText($("#wish"), content.wishes[index]);
        if (lit.size === content.wishes.length) { toast("Every wish is waiting for us ✨"); unlock(6); }
      });
    },
    7() {
      const letter = $("#long-letter"), button = $("#read-letter"); letter.innerHTML = ""; button.hidden = false;
      button.onclick = () => {
        button.hidden = true;
        const chapterRect = $("#chapter-7").getBoundingClientRect();
        petalBurst(18, chapterRect.left + chapterRect.width / 2, chapterRect.top + chapterRect.height * 0.3);
        content.letter.forEach((line, index) => setTimeout(() => {
          const paragraph = document.createElement("p");
          paragraph.textContent = line;
          letter.append(paragraph);
          if (index === content.letter.length - 1) unlock(7);
        }, reduceMotion ? 0 : index * 1700));
      };
    },
    8() {
      const cake = $("#cake"), blow = $("#blow-candles"), final = $("#final-message");
      cake.classList.remove("out"); $("#chapter-8").classList.remove("blowing"); final.textContent = ""; blow.hidden = false;
      $("#chapter-8 .next")?.classList.remove("show");
      blow.onclick = () => {
        const cakeRect = cake.getBoundingClientRect();
        cake.classList.add("out");
        $("#chapter-8").classList.add("blowing");
        blow.hidden = true;
        confetti(180, cakeRect.left + cakeRect.width / 2, cakeRect.top + cakeRect.height / 2);
        petalBurst(72, cakeRect.left + cakeRect.width / 2, cakeRect.top + cakeRect.height / 2);
        typeText(final, content.final, () => { if (currentChapter === 8) unlock(8); });
      };
    },
    9() {
      const holder = $("#pocket-notes"), message = $("#pocket-message"), next = $("#chapter-9 .next");
      const notes = content.afterglow?.notes || [];
      const opened = new Set();
      holder.innerHTML = "";
      message.innerHTML = "";
      message.classList.remove("all-open");
      next?.classList.remove("show");
      const showMessage = note => {
        message.innerHTML = "";
        const title = document.createElement("h3");
        title.textContent = note.title;
        const body = document.createElement("p");
        body.textContent = note.body;
        message.append(title, body);
      };
      notes.forEach((note, index) => {
        const button = document.createElement("button");
        const icon = document.createElement("span");
        const label = document.createElement("span");
        button.className = "pocket-note";
        button.type = "button";
        button.setAttribute("aria-label", "Open note: " + note.label);
        icon.className = "pocket-note-icon";
        icon.textContent = "✉";
        label.className = "pocket-note-label";
        label.textContent = note.label;
        button.append(icon, label);
        button.onclick = () => {
          const wasOpened = opened.has(index);
          button.classList.add("open");
          opened.add(index);
          showMessage(note);
          if (!wasOpened) {
            const noteRect = button.getBoundingClientRect();
            confetti(22, noteRect.left + noteRect.width / 2, noteRect.top + noteRect.height / 2);
            petalBurst(10, noteRect.left + noteRect.width / 2, noteRect.top + noteRect.height / 2);
          }
          if (opened.size === notes.length && notes.length) {
            message.classList.add("all-open");
            toast("Every little note is yours now ♡");
            unlock(9);
          }
        };
        holder.append(button);
      });
    },
    10() {
      const afterglow = content.afterglow || {};
      const lock = $("#love-lock"), input = $("#forever-code"), button = $("#unlock-forever"), feedback = $("#lock-feedback"), note = $("#forever-note"), replay = $("#replay");
      const secretWord = String(afterglow.secretWord || "").trim().toLocaleLowerCase();
      let unlocked = false;
      lock.classList.remove("unlocked");
      input.disabled = false;
      input.value = "";
      button.disabled = false;
      feedback.textContent = "";
      note.innerHTML = "";
      replay.hidden = true;
      $("#chapter-10 .next")?.classList.remove("show");
      $("#forever-prompt").textContent = afterglow.secretPrompt || "Enter the little word that belongs to us.";
      const revealPromise = () => {
        if (unlocked) return;
        unlocked = true;
        lock.classList.add("unlocked");
        input.disabled = true;
        button.disabled = true;
        feedback.textContent = afterglow.success || "You found the promise I wanted to keep for us.";
        const title = document.createElement("h3");
        title.textContent = "For every version of tomorrow…";
        note.append(title);
        (afterglow.promise || []).forEach(line => {
          const paragraph = document.createElement("p");
          paragraph.textContent = line;
          note.append(paragraph);
        });
        const lockRect = lock.getBoundingClientRect();
        confetti(110, lockRect.left + lockRect.width / 2, lockRect.top + lockRect.height / 2);
        petalBurst(52, lockRect.left + lockRect.width / 2, lockRect.top + lockRect.height / 2);
        replay.hidden = false;
        unlock(10);
      };
      const trySecret = () => {
        const answer = input.value.trim().toLocaleLowerCase();
        if (!secretWord || answer === secretWord) revealPromise();
        else feedback.textContent = afterglow.incorrect || "Almost… try the word that feels most like home.";
      };
      button.onclick = trySecret;
      input.oninput = () => { if (!unlocked) feedback.textContent = ""; };
      input.onkeydown = event => { if (event.key === "Enter") trySecret(); };
      replay.onclick = () => { localStorage.removeItem("birthday-universe-chapter"); showChapter(0); };
    },
    11() {
      const gallery = content.endlessGallery || {};
      const photoTemplates = Array.isArray(gallery.photos) ? gallery.photos.filter(photo => photo && typeof photo === "object") : [];
      const galleryFiles = Array.isArray(gallery.files) ? gallery.files.filter(file => typeof file === "string" && file.trim()) : [];
      const photos = galleryFiles.length && photoTemplates.length
        ? galleryFiles.map((file, index) => ({ ...photoTemplates[index % photoTemplates.length], image: "assets/images/forever/" + encodeURIComponent(file), eyebrow: String(index + 1).padStart(2, "0") + " · a little forever" }))
        : photoTemplates;
      const reel = $("#endless-reel"), ambient = $("#endless-ambient"), layers = $$(".ambient-layer", ambient);
      const decorations = ["♡", "✦", "♥", "✧", "❀", "⌁"];
      let cycle = 0;
      let activePalette = "";
      let activeLayer = 0;
      endlessFrameObserver?.disconnect();
      endlessLoadObserver?.disconnect();
      reel.innerHTML = "";
      $("#endless-intro-copy").textContent = gallery.intro || "Keep scrolling. There is no last page when it comes to all the reasons I love you.";
      const restartUniverse = () => { localStorage.removeItem("birthday-universe-chapter"); showChapter(0); };
      $("#endless-replay").onclick = restartUniverse;
      $("#chapter-restart").onclick = restartUniverse;
      if (!photos.length) {
        const empty = document.createElement("p");
        empty.className = "gallery-empty";
        empty.textContent = "Add your gallery moments in assets/js/content.js to begin the little forever.";
        reel.append(empty);
        return;
      }
      const setAmbient = palette => {
        if (palette === activePalette || layers.length < 2) return;
        const nextLayer = layers[(activeLayer + 1) % layers.length];
        const previousLayer = layers[activeLayer];
        nextLayer.className = "ambient-layer palette-" + palette;
        nextLayer.offsetWidth;
        nextLayer.classList.add("is-visible");
        previousLayer.classList.remove("is-visible");
        activeLayer = (activeLayer + 1) % layers.length;
        activePalette = palette;
      };
      const createFrame = (photo, index, galleryCycle) => {
        const palette = photo.palette || "blush";
        const motion = photo.motion || "float-left";
        const position = (index % photos.length) + 1;
        const frame = document.createElement("article");
        const scene = document.createElement("div");
        const sparkles = document.createElement("div");
        const imageWrap = document.createElement("div");
        const image = document.createElement("img");
        const placeholder = document.createElement("div");
        const placeholderIcon = document.createElement("span");
        const placeholderLabel = document.createElement("strong");
        const placeholderFile = document.createElement("small");
        const copy = document.createElement("div");
        const eyebrow = document.createElement("p");
        const title = document.createElement("h3");
        const body = document.createElement("p");
        const counter = document.createElement("p");
        frame.className = "forever-frame palette-" + palette + " motion-" + motion + ((index + galleryCycle) % 2 ? " frame-reverse" : "");
        frame.dataset.palette = palette;
        scene.className = "frame-scene";
        sparkles.className = "frame-sparkles";
        decorations.forEach((decoration, decorationIndex) => {
          const sparkle = document.createElement("span");
          sparkle.textContent = decorations[(decorationIndex + index) % decorations.length];
          sparkles.append(sparkle);
        });
        scene.append(sparkles);
        imageWrap.className = "forever-photo-wrap";
        image.alt = photo.alt || photo.title || "A treasured memory";
        image.decoding = "async";
        image.loading = galleryCycle || index > 1 ? "lazy" : "eager";
        image.addEventListener("load", () => frame.classList.add("photo-loaded"), { once: true });
        image.addEventListener("error", () => { frame.classList.add("is-placeholder"); image.remove(); }, { once: true });
        image.src = photo.image || "assets/images/forever/" + String(position).padStart(2, "0") + ".jpg";
        placeholder.className = "forever-photo-placeholder";
        placeholderIcon.textContent = "♡";
        placeholderLabel.textContent = "Place her photo here";
        placeholderFile.textContent = String(position).padStart(2, "0") + ".jpg";
        placeholder.append(placeholderIcon, placeholderLabel, placeholderFile);
        imageWrap.append(image, placeholder);
        copy.className = "forever-copy";
        eyebrow.className = "eyebrow";
        eyebrow.textContent = photo.eyebrow || "a little forever";
        title.textContent = photo.title || "A photo I never want to forget.";
        body.textContent = photo.body || "Write your own little memory here.";
        counter.className = "forever-counter";
        counter.textContent = String(position).padStart(2, "0") + " / " + String(photos.length).padStart(2, "0") + " · and then again";
        copy.append(eyebrow, title, body, counter);
        frame.append(scene, imageWrap, copy);
        return frame;
      };
      const observeNewFrames = frames => {
        frames.forEach(frame => {
          if (endlessFrameObserver) endlessFrameObserver.observe(frame);
          else frame.classList.add("is-visible");
        });
      };
      const appendCycle = () => {
        const fragment = document.createDocumentFragment();
        const frames = photos.map((photo, index) => createFrame(photo, index, cycle));
        const sentinel = document.createElement("div");
        sentinel.className = "forever-sentinel";
        sentinel.setAttribute("aria-hidden", "true");
        frames.forEach(frame => fragment.append(frame));
        fragment.append(sentinel);
        reel.append(fragment);
        observeNewFrames(frames);
        if (endlessLoadObserver) endlessLoadObserver.observe(sentinel);
        cycle++;
      };
      if ("IntersectionObserver" in window) {
        endlessFrameObserver = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            setAmbient(entry.target.dataset.palette || "blush");
          });
        }, { rootMargin: "-38% 0px -42% 0px", threshold: 0 });
        endlessLoadObserver = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            endlessLoadObserver.unobserve(entry.target);
            appendCycle();
          });
        }, { rootMargin: "1200px 0px 1400px 0px", threshold: 0 });
      }
      layers.forEach((layer, index) => {
        layer.className = "ambient-layer" + (index === 0 ? " palette-" + (photos[0].palette || "blush") + " is-visible" : "");
      });
      activePalette = photos[0].palette || "blush";
      activeLayer = 0;
      appendCycle();
      if (!endlessLoadObserver) appendCycle();
    }
  };

  document.addEventListener("click", event => { const button = event.target.closest("[data-go]"); if (button) showChapter(Number(button.dataset.go)); });
  const song = $("#song"), music = $("#music-button");
  music.setAttribute("aria-pressed", "false");
  music.onclick = () => song.paused
    ? (activeGiftAudio?.pause(), activeGiftAudio = null, song.play().then(() => { music.textContent = "❚❚"; music.setAttribute("aria-pressed", "true"); releaseMusicNotes(); }).catch(() => toast("Couldn't start the soundtrack. Please check its MP3 file.")))
    : (song.pause(), music.textContent = "♪", music.setAttribute("aria-pressed", "false"));
  song.onerror = () => toast("Couldn't load Jo Tum Mere Ho. Please check the 2021 MP3 file.");
  song.onpause = () => { music.textContent = "♪"; music.setAttribute("aria-pressed", "false"); };
  $("#close-bouquet").onclick = () => closeBouquetReveal();
  bouquetReveal.onclick = event => { if (event.target === bouquetReveal) closeBouquetReveal(); };
  addEventListener("keydown", event => { if (event.key === "Escape" && bouquetReveal.classList.contains("show")) closeBouquetReveal(); });
  $("#easter-egg").onclick = () => { toast("Secret found: you are my favourite person 🤍"); confetti(25); };
  let lastHeart = 0;
  addEventListener("pointermove", event => { if (event.pointerType !== "mouse" || reduceMotion || Date.now() - lastHeart < 80) return; lastHeart = Date.now(); const heart = document.createElement("span"); heart.className = "cursor-heart"; heart.textContent = "♥"; heart.style.left = event.clientX + "px"; heart.style.top = event.clientY + "px"; $("#cursor-hearts").append(heart); setTimeout(() => heart.remove(), 850); });
  const chapterParam = new URLSearchParams(location.search).get("chapter");
  const requested = chapterParam === null ? null : Number(chapterParam);
  const saved = Number(localStorage.getItem("birthday-universe-chapter"));
  showChapter(Number.isInteger(requested) && requested >= 0 && requested <= lastChapter ? requested : (saved >= 0 && saved <= lastChapter ? saved : 0), false);
})();
