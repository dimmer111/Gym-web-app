(() => {
  const K = "ol_users",
    S = "ol_session",
    A = document.body.dataset.access || "user";
  const L = [
    ["index.html", "Home"],
    ["attekintes.html", "My Overview"],
    ["edzesterv.html", "My Weekly Plan"],
    ["gyakorlattar.html", "Exercise Library"],
    ["profil.html", "My Profile"],
    ["kapcsolat.html", "Contact &amp; FAQ"],
  ];
  const raw = () => JSON.parse(localStorage.getItem(K) || "[]"),
    put = (u) => localStorage.setItem(K, JSON.stringify(u));
  const hex = (b) =>
    [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
  const salt = () => hex(crypto.getRandomValues(new Uint8Array(16)));
  const hs = async (p, s) =>
    hex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s + p)));
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => "&#" + c.charCodeAt(0) + ";");
  const mk = async (name, email, pw, role, x = {}) => {
    const s = salt();
    return {
      id: salt().slice(0, 12),
      name,
      email: email.toLowerCase().trim(),
      role,
      salt: s,
      hash: await hs(pw, s),
      goal: "Build strength",
      level: "Beginner",
      created: new Date().toISOString(),
      lastLogin: null,
      active: true,
      ...x,
    };
  };
  const me = () =>
    raw().find((u) => u.email === localStorage.getItem(S) && u.active) || null;
  const admin = () => me()?.role === "admin";
  function toast(m, err) {
    let t = document.getElementById("toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "toast";
      t.className = "toast-message";
      document.body.append(t);
    }
    t.textContent = m;
    t.classList.toggle("err", !!err);
    t.classList.add("visible");
    setTimeout(() => t.classList.remove("visible"), 2800);
  }
  const Auth = (window.Auth = {
    me,
    toast,
    esc,
    // admins never receive the salt or password hash
    users: () => (admin() ? raw().map(({ salt, hash, ...r }) => r) : []),
    async login(email, pw) {
      const u = raw().find((x) => x.email === email.toLowerCase().trim());
      if (!u || u.hash !== (await hs(pw, u.salt)))
        throw "Incorrect email address or password.";
      if (!u.active)
        throw "This account has been disabled. Email us at info@offlimits.hu";
      u.lastLogin = new Date().toISOString();
      put(raw().map((x) => (x.id === u.id ? u : x)));
      localStorage.setItem(S, u.email);
    },
    async register(name, email, pw) {
      email = email.toLowerCase().trim();
      if (raw().some((x) => x.email === email))
        throw "An account with this email address already exists.";
      put([...raw(), await mk(name.trim(), email, pw, "user")]);
      localStorage.setItem(S, email);
    },
    logout() {
      localStorage.removeItem(S);
      location.href = "index.html";
    },
    update({ name, goal, level }) {
      const m = me();
      put(raw().map((u) => (u.id === m.id ? { ...u, name, goal, level } : u)));
    },
    setActive(id, v) {
      if (admin())
        put(
          raw().map((u) =>
            u.id === id && u.role !== "admin" ? { ...u, active: v } : u,
          ),
        );
    },
    remove(id) {
      if (admin()) {
        put(raw().filter((u) => u.id !== id || u.role === "admin"));
        localStorage.removeItem("ol_data_" + id);
      }
    },
    async changePassword(o, n) {
      const m = me(),
        u = raw().find((x) => x.id === m.id);
      if (u.hash !== (await hs(o, u.salt))) throw "The current password is incorrect.";
      if (n.length < 8) throw "The new password must be at least 8 characters.";
      const s = salt(),
        h = await hs(n, s);
      put(raw().map((x) => (x.id === u.id ? { ...x, salt: s, hash: h } : x)));
    },
    msgs: () => JSON.parse(localStorage.getItem("ol_msgs") || "[]"),
    sendMsg(m) {
      const a = Auth.msgs();
      a.unshift({
        id: salt().slice(0, 12),
        date: new Date().toISOString(),
        read: false,
        ...m,
      });
      localStorage.setItem("ol_msgs", JSON.stringify(a));
    },
    messages: () => (admin() ? Auth.msgs() : []),
    setRead(id, v) {
      if (admin())
        localStorage.setItem(
          "ol_msgs",
          JSON.stringify(
            Auth.msgs().map((m) => (m.id === id ? { ...m, read: v } : m)),
          ),
        );
    },
    delMsg(id) {
      if (admin())
        localStorage.setItem(
          "ol_msgs",
          JSON.stringify(Auth.msgs().filter((m) => m.id !== id)),
        );
    },
    async onLogin(e) {
      e.preventDefault();
      const i = e.target.querySelectorAll("input");
      try {
        await Auth.login(i[0].value, i[1].value);
        const n = new URLSearchParams(location.search).get("next");
        location.href = [...L.map((l) => l[0]), "admin.html"].includes(n)
          ? n
          : "attekintes.html";
      } catch (x) {
        toast(String(x), 1);
      }
    },
    async onRegister(e) {
      e.preventDefault();
      const i = e.target.querySelectorAll("input");
      if (i[2].value.length < 8)
        return toast("Password must be at least 8 characters.", 1);
      if (i[2].value !== i[3].value)
        return toast("The two passwords do not match.", 1);
      try {
        await Auth.register(i[0].value, i[1].value, i[2].value);
        location.href = "attekintes.html";
      } catch (x) {
        toast(String(x), 1);
      }
    },
  });
  function nav(u) {
    const h = document.getElementById("site-nav");
    if (!h) return;
    const cur = location.pathname.split("/").pop() || "index.html";
    const links = u
      ? [...L, ...(u.role === "admin" ? [["admin.html", "Admin Panel"]] : [])]
          .map(
            ([f, t]) =>
              `<li class="nav-item"><a class="nav-link${f === cur ? " active" : ""}" href="${f}">${t}</a></li>`,
          )
          .join("")
      : "";
    const g = u && u.name.trim().split(/\s+/)[0];
    const right = u
      ? `<li class="nav-item ms-lg-2"><span class="nav-user"><i class="bi bi-person-circle"></i> ${esc(g)}</span></li><li class="nav-item"><button class="btn btn-outline-light btn-sm" onclick="Auth.logout()">Log out</button></li>`
      : `<li class="nav-item"><a class="btn btn-outline-light" href="#belepes">Log in</a></li><li class="nav-item"><a class="btn btn-pulse" href="#regisztracio">Sign up</a></li>`;
    h.outerHTML = `<nav class="navbar navbar-expand-lg navbar-dark fixed-top iron-nav" aria-label="Main navigation"><div class="container"><a class="navbar-brand fw-bold" href="index.html">OFF <span>LIMITS</span></a><button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button><div class="collapse navbar-collapse" id="mainNav"><ul class="navbar-nav ms-auto align-items-lg-center gap-lg-2">${links}${right}</ul></div></div></nav>`;
  }
  function bind(u) {
    if (!u) return;
    const p = u.name.trim().split(/\s+/), g = p[0];
    const v = {
      first: g,
      firstEx: g + "!",
      name: u.name,
      email: u.email,
      initials: (p.length > 1 ? g[0] + p[p.length - 1][0] : g.slice(0, 2)).toUpperCase(),
      heroName:
        esc(g) +
        (p.length > 1 ? " <span>" + esc(p.slice(1).join(" ")) + "</span>" : ""),
    };
    document.querySelectorAll("[data-bind]").forEach((e) => {
      const k = e.dataset.bind;
      k === "heroName" ? (e.innerHTML = v[k]) : (e.textContent = v[k]);
    });
  }
  addEventListener("DOMContentLoaded", async () => {
    if (!raw().length)
      put([
        await mk("Admin", "admin@offlimits.hu", "Admin123!", "admin"),
        await mk("Csanád Tóth", "csanad@example.com", "Csanad123!", "user", { level: "Advanced", }),
      ]);
    // One-time upgrade of accounts saved before the English translation
    const GOALS = {
        "Erőnövelés": "Build strength",
        "Izomtömeg növelése": "Build muscle",
        "Állóképesség": "Endurance",
      },
      LEVELS = { Kezdő: "Beginner", Középhaladó: "Intermediate", Haladó: "Advanced" };
    const before = JSON.stringify(raw()),
      upgraded = raw().map((x) => ({
        ...x,
        name: x.name === "Tóth Csanád" ? "Csanád Tóth" : x.name,
        goal: GOALS[x.goal] || x.goal,
        level: LEVELS[x.level] || x.level,
      }));
    if (JSON.stringify(upgraded) !== before) put(upgraded);
    const u = me();
    if (A !== "public" && !u) {
      location.replace(
        "index.html?next=" + location.pathname.split("/").pop() + "#belepes",
      );
      return;
    }
    if (A === "admin" && u.role !== "admin") {
      location.replace("attekintes.html");
      return;
    }
    document
      .querySelectorAll(u ? "[data-guest-only]" : "[data-user-only]")
      .forEach((e) => e.remove());
    nav(u);
    bind(u);
    document.body.classList.add("ready");
    dispatchEvent(new Event("authready"));
  });
})();
