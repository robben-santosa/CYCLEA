/* ============================================================
   CYCLEA — interaksi website
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Mobile menu ---------- */
  const burger = document.getElementById("burger");
  const navLinks = document.getElementById("navLinks");

  burger.addEventListener("click", () => {
    burger.classList.toggle("open");
    navLinks.classList.toggle("open");
  });
  navLinks.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      burger.classList.remove("open");
      navLinks.classList.remove("open");
    }
  });

  /* ---------- Nav aktif mengikuti scroll ---------- */
  const sections = [...document.querySelectorAll("section[id]")];
  const linkMap = {};
  document.querySelectorAll(".nav-links a").forEach((a) => {
    linkMap[a.getAttribute("href").slice(1)] = a;
  });

  const setActive = () => {
    const pos = window.scrollY + 160;
    let current = sections[0]?.id;
    sections.forEach((s) => { if (s.offsetTop <= pos) current = s.id; });
    Object.entries(linkMap).forEach(([id, a]) => a.classList.toggle("active", id === current));
  };
  window.addEventListener("scroll", setActive, { passive: true });
  setActive();

  /* ---------- Reveal on scroll ---------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((en, i) => {
        if (en.isIntersecting) {
          setTimeout(() => en.target.classList.add("in"), (i % 4) * 90);
          revealObserver.unobserve(en.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  /* ---------- Counter animasi ---------- */
  const formatID = (n) => n.toLocaleString("id-ID");

  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const dur = 1600;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = formatID(Math.floor(target * eased));
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = formatID(target);
    };
    requestAnimationFrame(tick);
  };

  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          animateCount(en.target);
          countObserver.unobserve(en.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  document.querySelectorAll("[data-count]").forEach((el) => countObserver.observe(el));

  /* ---------- Estimator setoran ---------- */
  const berat = document.getElementById("berat");
  const beratOut = document.getElementById("beratOut");
  const estHarga = document.getElementById("estHarga");
  const estPoin = document.getElementById("estPoin");
  const HARGA_PER_KG = 4500;
  const POIN_PER_KG = 50;

  const updateEstimator = () => {
    const v = parseInt(berat.value, 10);
    const pct = ((v - berat.min) / (berat.max - berat.min)) * 100;
    berat.style.setProperty("--p", pct + "%");
    beratOut.textContent = v + " kg";
    estHarga.textContent = "Rp " + formatID(v * HARGA_PER_KG);
    estPoin.textContent = "+" + formatID(v * POIN_PER_KG) + " poin CYCLEA";
  };
  berat.addEventListener("input", updateEstimator);
  updateEstimator();

  /* ---------- Tombol cari (membuka estimator) ---------- */
  document.getElementById("searchBtn").addEventListener("click", () => {
    document.getElementById("setor").scrollIntoView({ behavior: "smooth", block: "center" });
  });

  /* ---------- Grafik pengumpulan ---------- */
  const chartData = [
    { m: "Jan", v: 720 }, { m: "Feb", v: 810 }, { m: "Mar", v: 760 },
    { m: "Apr", v: 940 }, { m: "Mei", v: 1020 }, { m: "Jun", v: 980 },
    { m: "Jul", v: 1130 }, { m: "Agu", v: 1240 }, { m: "Sep", v: 1190 },
    { m: "Okt", v: 1360 }, { m: "Nov", v: 1480 }, { m: "Des", v: 1610 },
  ];
  const chartEl = document.getElementById("chart");
  const max = Math.max(...chartData.map((d) => d.v));

  chartData.forEach((d) => {
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.innerHTML =
      '<span class="bar-val">' + formatID(d.v) + "</span>" +
      '<div class="bar-fill" data-h="' + Math.round((d.v / max) * 100) + '"></div>' +
      '<span class="bar-label">' + d.m + "</span>";
    chartEl.appendChild(bar);
  });

  const chartObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          chartEl.classList.add("on");
          chartEl.querySelectorAll(".bar-fill").forEach((f, i) => {
            setTimeout(() => { f.style.height = f.dataset.h + "%"; }, i * 70);
          });
          chartObserver.unobserve(chartEl);
        }
      });
    },
    { threshold: 0.35 }
  );
  chartObserver.observe(chartEl);

  /* ---------- FAQ: hanya satu terbuka ---------- */
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (item.open) faqItems.forEach((o) => { if (o !== item) o.open = false; });
    });
  });

  /* ---------- Modal detail produk ---------- */
  const modal = document.getElementById("productModal");
  const mTitle = document.getElementById("mTitle");
  const mUse = document.getElementById("mUse");
  const mPrice = document.getElementById("mPrice");
  const mSize = document.getElementById("mSize");
  const mIng = document.getElementById("mIng");

  const closeModal = () => {
    modal.hidden = true;
    document.body.style.overflow = "";
  };

  document.querySelectorAll("[data-detail]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".product");
      mTitle.textContent = card.dataset.name;
      mUse.textContent = card.dataset.use;
      mPrice.textContent = card.dataset.price;
      mSize.textContent = card.dataset.size;
      mIng.textContent = card.dataset.ing;
      modal.hidden = false;
      document.body.style.overflow = "hidden";
    });
  });

  document.getElementById("modalClose").addEventListener("click", closeModal);
  document.getElementById("modalCta").addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) closeModal(); });

  /* ---------- Navbar shadow saat scroll ---------- */
  const navWrap = document.querySelector(".nav-wrap");
  window.addEventListener(
    "scroll",
    () => {
      navWrap.style.inset = window.scrollY > 40 ? "10px 0 auto" : "18px 0 auto";
    },
    { passive: true }
  );
})();
