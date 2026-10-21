(() => {
  const DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  // Data saved before the English translation used Hungarian labels; map them on read.
  const WORDS = {
    Hétfő: "Monday",
    Kedd: "Tuesday",
    Szerda: "Wednesday",
    Csütörtök: "Thursday",
    Péntek: "Friday",
    Szombat: "Saturday",
    Vasárnap: "Sunday",
    Mell: "Chest",
    Hát: "Back",
    Láb: "Legs",
    Váll: "Shoulders",
    Kar: "Arms",
    Egyéb: "Other",
    Tricepsz: "Triceps",
    Bicepsz: "Biceps",
    Edzés: "Workout",
  };
  const tr = (w) => WORDS[w] || w;
  const migrate = (d) => {
    const plan = {};
    for (const [k, v] of Object.entries(d.plan || {}))
      plan[tr(k)] = v.map((e) => ({ ...e, cat: tr(e.cat) }));
    d.plan = plan;
    d.log = (d.log || []).map((l) => ({
      ...l,
      day: tr(l.day),
      name: l.name.replace(/[^\s+–-]+/g, tr),
    }));
    return d;
  };
  const key = () => "ol_data_" + Auth.me().id;
  const get = () =>
    migrate(
      JSON.parse(localStorage.getItem(key()) || "null") || {
        plan: {},
        log: [],
        pr: {},
      },
    );
  const set = (d) => localStorage.setItem(key(), JSON.stringify(d));
  const id = () => Math.random().toString(36).slice(2, 10);
  const weekStart = () => {
    const n = new Date();
    n.setHours(0, 0, 0, 0);
    n.setDate(n.getDate() - ((n.getDay() + 6) % 7));
    return n;
  };
  const dayOf = (t) => DAYS[(t.getDay() + 6) % 7];
  window.Data = {
    DAYS,
    get,
    set,
    today: () => dayOf(new Date()),
    addEx(day, { name, cat }) {
      const d = get();
      (d.plan[day] = d.plan[day] || []).push({
        id: id(),
        name,
        cat: cat || "Other",
        sets: 3,
        reps: 10,
        kg: 0,
      });
      set(d);
    },
    upd(day, i, p) {
      const d = get();
      d.plan[day] = (d.plan[day] || []).map((e) =>
        e.id === i ? { ...e, ...p } : e,
      );
      set(d);
    },
    del(day, i) {
      const d = get();
      d.plan[day] = (d.plan[day] || []).filter((e) => e.id !== i);
      set(d);
    },
    finish(day, minutes) {
      const d = get(),
        ex = d.plan[day] || [];
      ex.forEach((e) => {
        if (e.kg > 0) d.pr[e.name] = Math.max(d.pr[e.name] || 0, e.kg);
      });
      d.log.unshift({
        id: id(),
        date: new Date().toISOString(),
        day,
        name:
          day +
          " – " +
          ([...new Set(ex.map((e) => e.cat))].join(" + ") || "Workout"),
        count: ex.length,
        volume: ex.reduce((a, e) => a + e.sets * e.reps * e.kg, 0),
        minutes,
        ex: ex.map(({ name, sets, reps, kg }) => ({ name, sets, reps, kg })),
      });
      set(d);
    },
    delLog(i) {
      const d = get();
      d.log = d.log.filter((l) => l.id !== i);
      set(d);
    },
    week() {
      const d = get(),
        s = weekStart(),
        days = [
          ...new Set(
            d.log.filter((l) => new Date(l.date) >= s).map((l) => l.day),
          ),
        ];
      return {
        days,
        planned: DAYS.filter((x) => (d.plan[x] || []).length),
        done: days.length,
      };
    },
    stats() {
      const d = get(),
        L = d.log,
        now = new Date(),
        ws = weekStart(),
        days = new Set(L.map((l) => new Date(l.date).toDateString()));
      let s = 0,
        c = new Date();
      if (!days.has(c.toDateString())) c.setDate(c.getDate() - 1);
      while (days.has(c.toDateString())) {
        s++;
        c.setDate(c.getDate() - 1);
      }
      return {
        streak: s,
        total: L.length,
        minutes: L.reduce((a, l) => a + l.minutes, 0),
        pr: d.pr,
        weekVol: L.filter((l) => new Date(l.date) >= ws).reduce(
          (a, l) => a + l.volume,
          0,
        ),
        month: L.filter((l) => {
          const t = new Date(l.date);
          return (
            t.getMonth() === now.getMonth() &&
            t.getFullYear() === now.getFullYear()
          );
        }).length,
      };
    },
    csv: () => {
      const q = (v) => '"' + String(v).replace(/"/g, '""') + '"';
      return (
        "\ufeffDate,Workout,Exercises,Total weight (kg),Duration (min)\n" +
        get()
          .log.map((l) =>
            [
              q(new Date(l.date).toLocaleDateString("en-US")),
              q(l.name),
              l.count,
              l.volume,
              l.minutes,
            ].join(","),
          )
          .join("\n")
      );
    },
    seedDemo() {
      const d = get();
      const mk = (ago, cat, list, min) => {
        const t = new Date();
        t.setDate(t.getDate() - ago);
        list.forEach(([n, , , kg]) => {
          if (kg > 0) d.pr[n] = Math.max(d.pr[n] || 0, kg);
        });
        return {
          id: id(),
          date: t.toISOString(),
          day: dayOf(t),
          name: dayOf(t) + " – " + cat,
          count: list.length,
          volume: list.reduce((a, e) => a + e[1] * e[2] * e[3], 0),
          minutes: min,
          ex: list.map(([name, sets, reps, kg]) => ({ name, sets, reps, kg })),
        };
      };
      d.log = [
        mk(
          0,
          "Chest + Triceps",
          [
            ["Barbell Bench Press", 4, 8, 80],
            ["Triceps Pushdown", 3, 12, 35],
          ],
          55,
        ),
        mk(
          1,
          "Legs",
          [
            ["Barbell Squat", 4, 8, 100],
            ["Leg Press", 3, 12, 180],
          ],
          61,
        ),
        mk(
          2,
          "Back + Biceps",
          [
            ["Deadlift", 3, 5, 140],
            ["Bent-Over Row", 3, 10, 60],
          ],
          48,
        ),
        mk(
          4,
          "Shoulders + Core",
          [
            ["Shoulder Press", 3, 10, 24],
            ["Plank", 3, 1, 0],
          ],
          40,
        ),
      ];
      set(d);
    },
  };
})();
