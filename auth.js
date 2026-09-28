/* ============================================================
   CYCLEA — interaksi halaman Daftar & Masuk
   ============================================================ */
(function () {
  "use strict";

  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  /* ---------- util ---------- */
  const showField = (field, ok) => {
    field.classList.toggle("is-error", !ok);
    return ok;
  };

  const showAlert = (el, text, ok) => {
    if (!el) return;
    el.innerHTML = text;
    el.classList.toggle("ok", !!ok);
    el.classList.toggle("show", true);
  };

  const firstInvalid = (fields) => fields.find((f) => f.classList.contains("is-error"));

  /* ---------- tampil / sembunyikan kata sandi ---------- */
  $$("[data-toggle-pw]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const inp = document.getElementById(btn.dataset.togglePw);
      if (!inp) return;
      const showing = inp.type === "text";
      inp.type = showing ? "password" : "text";
      btn.classList.toggle("is-on", !showing);
      btn.setAttribute("aria-label", showing ? "Tampilkan kata sandi" : "Sembunyikan kata sandi");
      inp.focus();
    });
  });

  /* ============================================================
     HALAMAN DAFTAR
     ============================================================ */
  const regForm = $("#regForm");

  if (regForm) {
    const alertBox = $("#regAlert");
    const steps = $$(".form-step", regForm);
    const cards = $$("#stepCards .acard");
    let current = 1;

    const goStep = (n) => {
      current = n;
      steps.forEach((s) => (s.hidden = Number(s.dataset.step) !== n));
      cards.forEach((c) => c.classList.toggle("is-active", Number(c.dataset.card) === n));
      if (alertBox) alertBox.classList.remove("show");
      const panel = $(".auth-panel");
      if (panel) panel.scrollTo({ top: 0, behavior: "smooth" });
      const first = $(".form-step:not([hidden]) .control", regForm);
      if (first && n === 1) first.focus({ preventScroll: true });
      if (n === 3) startResend();
    };

    /* --- aturan kata sandi --- */
    const pwRules = $("#pwRules");
    const checkPassword = (val) => {
      const res = {
        min: val.length >= 12,
        max: val.length > 0 && val.length <= 20,
        case: /[a-z]/.test(val) && /[A-Z]/.test(val),
        num: /\d/.test(val) && /[^A-Za-z0-9]/.test(val),
      };
      if (pwRules) {
        $$("li", pwRules).forEach((li) => li.classList.toggle("ok", !!res[li.dataset.r]));
      }
      return res.min && res.max && res.case && res.num;
    };

    const pwInput = $("#password");
    if (pwInput) pwInput.addEventListener("input", () => checkPassword(pwInput.value));

    /* --- username tersedia --- */
    const username = $("#username");
    const usernameField = username ? username.closest(".field") : null;
    const usernameOk = (v) => /^[A-Za-z0-9_.]{3,16}$/.test(v);
    if (username) {
      username.addEventListener("input", () => {
        const ok = usernameOk(username.value.trim());
        usernameField.classList.toggle("is-ok", ok);
        if (ok) usernameField.classList.remove("is-error");
      });
    }

    /* --- validasi per langkah --- */
    const validate = (step) => {
      const F = (sel) => $(sel, regForm);

      if (step === 1) {
        const phone = F("#phone").value.replace(/\D/g, "");
        const name = F("#fullname").value.trim();
        const user = F("#username").value.trim();
        const ok = [
          showField(F("#phone").closest(".field"), phone.length >= 9),
          showField(F("#fullname").closest(".field"), name.length >= 3),
          showField(F("#username").closest(".field"), usernameOk(user)),
          showField(F("#password").closest(".field"), checkPassword(F("#password").value)),
        ];
        return ok.every(Boolean);
      }

      if (step === 2) {
        const email = F("#email").value.trim();
        const ok = [
          showField(F("#email").closest(".field"), /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email)),
          showField(F("#city").closest(".field"), F("#city").value !== ""),
          showField(F("#address").closest(".field"), F("#address").value.trim().length >= 10),
        ];
        return ok.every(Boolean);
      }

      const digits = $$("#otp input").map((i) => i.value.trim()).join("");
      const ok = showField($("#otp").closest(".field"), digits.length === 6);
      return ok;
    };

    /* --- input OTP --- */
    const otpInputs = $$("#otp input");
    otpInputs.forEach((inp, i) => {
      inp.addEventListener("input", () => {
        inp.value = inp.value.replace(/\D/g, "").slice(0, 1);
        if (inp.value && otpInputs[i + 1]) otpInputs[i + 1].focus();
        inp.closest(".field").classList.remove("is-error");
      });
      inp.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && !inp.value && otpInputs[i - 1]) otpInputs[i - 1].focus();
      });
      inp.addEventListener("paste", (e) => {
        const cd = e.clipboardData || window.clipboardData;
        if (!cd || typeof cd.getData !== "function") return;
        const txt = (cd.getData("text") || "").replace(/\D/g, "").slice(0, 6);
        if (!txt) return;
        e.preventDefault();
        txt.split("").forEach((d, idx) => { if (otpInputs[idx]) otpInputs[idx].value = d; });
        otpInputs[Math.min(txt.length, 5)].focus();
      });
    });

    /* --- kirim ulang kode --- */
    let resendTimer = null;
    function startResend() {
      const btn = $("#resendBtn");
      const out = $("#resendTimer");
      if (!btn || !out) return;
      let s = 60;
      btn.disabled = true;
      btn.innerHTML = 'Kirim ulang dalam <span id="resendTimer">60</span>d';
      clearInterval(resendTimer);
      resendTimer = setInterval(() => {
        s -= 1;
        const span = $("#resendTimer");
        if (span) span.textContent = s;
        if (s <= 0) {
          clearInterval(resendTimer);
          btn.disabled = false;
          btn.textContent = "Kirim ulang kode";
        }
      }, 1000);
    }

    const resendBtn = $("#resendBtn");
    if (resendBtn) {
      resendBtn.addEventListener("click", () => {
        if (resendBtn.disabled) return;
        showAlert(alertBox, "Kode verifikasi baru telah dikirim ke nomor kamu.", true);
        startResend();
      });
    }

    /* --- tombol navigasi --- */
    $$("[data-back]", regForm).forEach((b) =>
      b.addEventListener("click", () => goStep(Number(b.dataset.back) - 1))
    );

    cards.forEach((c) =>
      c.addEventListener("click", () => {
        const n = Number(c.dataset.card);
        if (n <= current) goStep(n);
      })
    );

    /* --- submit --- */
    regForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validate(current)) {
        const bad = firstInvalid($$(".form-step:not([hidden]) .field", regForm));
        if (bad) bad.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      if (current < 3) { goStep(current + 1); return; }

      /* selesai */
      if (alertBox) alertBox.classList.remove("show");
      const data = {
        name: $("#fullname").value.trim(),
        username: $("#username").value.trim(),
        phone: "+62" + $("#phone").value.replace(/\D/g, ""),
        email: $("#email").value.trim(),
        city: $("#city").value,
        address: $("#address").value.trim(),
        password: $("#password").value,
        createdAt: new Date().toISOString(),
      };
      try {
        localStorage.setItem("cyclea_account", JSON.stringify(data));
      } catch (err) { /* mode privat: abaikan */ }

      $("#welcomeName").textContent = data.name.split(" ")[0];
      regForm.hidden = true;
      const foot = $("#authFooter");
      if (foot) foot.hidden = true;
      $("#regSuccess").hidden = false;
      $(".auth-panel").scrollTo({ top: 0, behavior: "smooth" });
    });

    /* --- tombol Google --- */
    const gBtn = $("#googleBtn");
    if (gBtn) gBtn.addEventListener("click", () =>
      showAlert(alertBox, "Integrasi Google akan aktif pada fase pengembangan berikutnya. Silakan daftar dengan email terlebih dahulu.", false)
    );
  }

  /* ============================================================
     HALAMAN MASUK
     ============================================================ */
  const loginForm = $("#loginForm");

  if (loginForm) {
    const alertBox = $("#loginAlert");
    const identity = $("#identity");
    const loginpw = $("#loginpw");

    try {
      const remembered = localStorage.getItem("cyclea_identity");
      if (remembered) {
        identity.value = remembered;
        $("#remember").checked = true;
      }
    } catch (err) { /* abaikan */ }

    [identity, loginpw].forEach((inp) =>
      inp.addEventListener("input", () => inp.closest(".field").classList.remove("is-error"))
    );

    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const idOk = showField(identity.closest(".field"), identity.value.trim().length >= 3);
      const pwOk = showField(loginpw.closest(".field"), loginpw.value.length >= 8);
      if (!idOk || !pwOk) return;

      let account = null;
      try { account = JSON.parse(localStorage.getItem("cyclea_account")); } catch (err) { account = null; }

      const id = identity.value.trim().toLowerCase();
      const passwordMatch = account && account.password === loginpw.value;
      const identityMatch =
        account &&
        (account.username.toLowerCase() === id ||
          account.email.toLowerCase() === id ||
          account.phone.replace(/\D/g, "") === identity.value.replace(/\D/g, ""));

      try {
        if ($("#remember").checked) localStorage.setItem("cyclea_identity", identity.value.trim());
        else localStorage.removeItem("cyclea_identity");
      } catch (err) { /* abaikan */ }

      if (account && identityMatch && passwordMatch) {
        if (alertBox) alertBox.classList.remove("show");
        $("#loginName").textContent = account.name.split(" ")[0];
        loginForm.hidden = true;
        $("#loginSuccess").hidden = false;
        $(".auth-panel").scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      if (!account) {
        showAlert(alertBox, "Akun belum terdaftar di perangkat ini. Silakan <a href='register.html'>mendaftar</a> terlebih dahulu.");
      } else if (!identityMatch) {
        showAlert(alertBox, "Email atau username tidak ditemukan. Periksa kembali datamu.");
      } else {
        showAlert(alertBox, "Kata sandi salah. Coba lagi atau gunakan <a href='#'>lupa kata sandi</a>.");
      }
    });

    const forgot = $("#forgot");
    if (forgot) forgot.addEventListener("click", (e) => {
      e.preventDefault();
      showAlert(alertBox, "Fitur reset kata sandi tersedia pada Fase 4 (Akun &amp; Menu Profil). Hubungi tim CYCLEA untuk bantuan.");
    });

    const gBtn = $("#googleBtn");
    if (gBtn) gBtn.addEventListener("click", () =>
      showAlert(alertBox, "Login Google akan aktif setelah integrasi OAuth. Silakan masuk dengan email CYCLEA-mu.")
    );
  }
  /* ============================================================
     MODAL DETAIL STATISTIK (panel kiri halaman masuk)
     ============================================================ */
  const statModal = document.getElementById("statModal");

  if (statModal) {
    const DATA = {
      liters: {
        tag: "Dampak · Total Terkumpul",
        title: "12.840 liter jelantah terkumpul",
        desc: "Total minyak jelantah bekas gorengan yang disetorkan pengguna CYCLEA dan diselamatkan dari saluran air sejak program berjalan.",
        specs: [
          ["Setara air", "±1,28 miliar liter air tidak tercemar"],
          ["Per bulan", "Rata-rata 1.070 liter"],
          ["Setara produk", "±38.520 batang sabun cuci piring"],
          ["Periode", "Januari 2024 – September 2026"],
        ],
        note: "Diperbarui setiap bulan dari seluruh titik pengumpulan, berdasarkan asumsi 1 liter jelantah dapat mencemari 100.000 liter air bila dibuang ke drainase.",
      },
      points: {
        tag: "Jaringan · Titik Pengumpulan",
        title: "76 titik & agen aktif",
        desc: "Sebaran titik pengumpulan CYCLEA yang siap menerima setoran minyak jelantah dari rumah tangga sekitar.",
        specs: [
          ["Agen warga", "42 agen di lingkungan RW"],
          ["Dropbox tetap", "21 kotak di pasar & permukiman"],
          ["Jemput ke rumah", "13 armada dengan jadwal mingguan"],
          ["Cakupan", "Yogyakarta, Sleman, Semarang"],
        ],
        note: "Buka setiap hari pukul 07.00–17.00 WIB. Layanan jemput gratis untuk setoran minimal 5 kg.",
      },
      families: {
        tag: "Komunitas · Partisipasi",
        title: "2.150 keluarga berkontribusi",
        desc: "Jumlah rumah tangga yang rutin menyetorkan minyak jelantahnya melalui CYCLEA.",
        specs: [
          ["Setoran rata-rata", "6 kg per keluarga / tahun"],
          ["Aktif bulan ini", "1.480 keluarga"],
          ["Poin terbagi", "322.500 poin CYCLEA"],
          ["Testimoni", "“Jelantah tak lagi dibuang, dapurnya bersih, dapat saldo.”"],
        ],
        note: "Setiap 1 kg setoran bernilai Rp4.500 dan 50 poin yang dapat ditukar dengan produk CYCLEA.",
      },
    };

    const statTag = document.getElementById("statTag");
    const statTitle = document.getElementById("statTitle");
    const statDesc = document.getElementById("statDesc");
    const statSpecs = document.getElementById("statSpecs");
    const statNote = document.getElementById("statNote");
    const statClose = document.getElementById("statClose");
    let lastTrigger = null;

    const closeStat = () => {
      statModal.hidden = true;
      document.body.style.overflow = "";
      if (lastTrigger) lastTrigger.focus();
    };

    const openStat = (key, trigger) => {
      const d = DATA[key];
      if (!d) return;
      statTag.textContent = d.tag;
      statTitle.textContent = d.title;
      statDesc.textContent = d.desc;
      statNote.textContent = d.note;
      statSpecs.innerHTML = d.specs
        .map(([k, v]) => "<div><dt>" + k + "</dt><dd>" + v + "</dd></div>")
        .join("");
      lastTrigger = trigger;
      statModal.hidden = false;
      document.body.style.overflow = "hidden";
      statClose.focus();
    };

    document.querySelectorAll("[data-stat]").forEach((btn) => {
      btn.addEventListener("click", () => openStat(btn.dataset.stat, btn));
    });

    statClose.addEventListener("click", closeStat);
    statModal.addEventListener("click", (e) => { if (e.target === statModal) closeStat(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !statModal.hidden) closeStat(); });
  }
})();
