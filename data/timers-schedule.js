// Horarios comunitarios AION 2 (referencia cruzada 2026-10-09).
// No son telemetría en vivo ni aviso oficial de NCSOFT; el juego manda.
window.TIMERS_META = {
  verified: "2026-10-09",
  sources: [
    { id: "shugo", label: "Shugo.GG", url: "https://shugo.gg/timers" },
    { id: "questlog", label: "Questlog", url: "https://questlog.gg/aion-2/en/boss-schedule" },
    { id: "maps", label: "Aion 2 Maps", url: "https://aion2maps.com/guides/abyss/" },
    { id: "meta", label: "Aion2 Meta", url: "https://aion2-meta.com/timers/" }
  ]
};

window.TIMERS_REGIONS = {
  eu: { es: "Europa", en: "Europe", tz: "Europe/Berlin", profile: "global" },
  "na-east": { es: "NA Este", en: "NA East", tz: "America/New_York", profile: "global" },
  "na-west": { es: "NA Oeste", en: "NA West", tz: "America/Los_Angeles", profile: "global" },
  sa: { es: "Sudamérica", en: "South America", tz: "America/Sao_Paulo", profile: "global" },
  asia: { es: "Asia", en: "Asia", tz: "Asia/Tokyo", profile: "global" },
  kr: { es: "Corea", en: "Korea", tz: "Asia/Seoul", profile: "kr" },
  tw: { es: "Taiwán", en: "Taiwan", tz: "Asia/Taipei", profile: "tw" }
};

// Eventos por perfil de servicio
window.TIMERS_EVENTS = {
  global: [
    {
      id: "rift",
      cat: "rift",
      type: "daily",
      times: ["02:00", "05:00", "08:00", "11:00", "14:00", "17:00", "20:00", "23:00"],
      portalMin: 10,
      durationMin: 60,
      status: "confirmed"
    },
    {
      id: "shugo",
      cat: "shugo",
      type: "hourly",
      minute: 0,
      durationMin: 10,
      status: "confirmed"
    },
    {
      id: "invasion",
      cat: "invasion",
      type: "hourly",
      minute: 30,
      durationMin: 15,
      status: "confirmed"
    },
    {
      id: "dailyReset",
      cat: "reset",
      type: "daily",
      times: ["07:00"],
      tzFixed: "UTC",
      status: "confirmed"
    },
    {
      id: "weeklyReset",
      cat: "reset",
      type: "weekly",
      days: [3],
      times: ["07:00"],
      tzFixed: "UTC",
      status: "confirmed"
    },
    {
      id: "kaira",
      cat: "boss",
      type: "daily",
      times: ["01:00", "04:00", "07:00", "10:00", "13:00", "16:00", "19:00", "22:00"],
      durationMin: 30,
      status: "unconfirmed"
    },
    {
      id: "siege",
      cat: "boss",
      type: "weekly",
      days: [1, 4, 6],
      times: ["21:00"],
      durationMin: 30,
      status: "confirmed"
    },
    {
      id: "siegeBosses",
      cat: "boss",
      type: "weekly",
      days: [1, 4, 6],
      times: ["21:30"],
      durationMin: 30,
      status: "confirmed"
    },
    {
      id: "nahma",
      cat: "boss",
      type: "weekly",
      days: [5, 0],
      times: ["21:00"],
      durationMin: 30,
      status: "unconfirmed"
    }
  ],
  kr: [
    {
      id: "rift",
      cat: "rift",
      type: "daily",
      times: ["02:00", "05:00", "08:00", "11:00", "14:00", "17:00", "20:00", "23:00"],
      portalMin: 10,
      durationMin: 60,
      status: "confirmed"
    },
    {
      id: "shugo",
      cat: "shugo",
      type: "hourly",
      minute: 0,
      durationMin: 10,
      status: "confirmed"
    },
    {
      id: "invasion",
      cat: "invasion",
      type: "hourly",
      minute: 30,
      durationMin: 15,
      status: "unconfirmed"
    },
    {
      id: "dailyReset",
      cat: "reset",
      type: "daily",
      times: ["05:00"],
      status: "confirmed"
    },
    {
      id: "weeklyReset",
      cat: "reset",
      type: "weekly",
      days: [3],
      times: ["05:00"],
      status: "confirmed"
    },
    {
      id: "kaira",
      cat: "boss",
      type: "daily",
      times: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
      durationMin: 30,
      status: "unconfirmed"
    },
    {
      id: "siege",
      cat: "boss",
      type: "weekly",
      days: [3, 6],
      times: ["21:20"],
      durationMin: 30,
      status: "confirmed"
    },
    {
      id: "siegeBosses",
      cat: "boss",
      type: "weekly",
      days: [3, 6],
      times: ["21:45"],
      durationMin: 30,
      status: "confirmed"
    },
    {
      id: "nahma",
      cat: "boss",
      type: "weekly",
      days: [5, 0],
      times: ["22:00"],
      durationMin: 30,
      status: "confirmed"
    }
  ],
  tw: [
    {
      id: "rift",
      cat: "rift",
      type: "daily",
      times: ["02:00", "05:00", "08:00", "11:00", "14:00", "17:00", "20:00", "23:00"],
      portalMin: 10,
      durationMin: 60,
      status: "confirmed"
    },
    {
      id: "shugo",
      cat: "shugo",
      type: "hourly",
      minute: 0,
      durationMin: 10,
      status: "confirmed"
    },
    {
      id: "invasion",
      cat: "invasion",
      type: "hourly",
      minute: 30,
      durationMin: 15,
      status: "unconfirmed"
    },
    {
      id: "dailyReset",
      cat: "reset",
      type: "daily",
      times: ["05:00"],
      status: "confirmed"
    },
    {
      id: "weeklyReset",
      cat: "reset",
      type: "weekly",
      days: [3],
      times: ["05:00"],
      status: "confirmed"
    },
    {
      id: "kaira",
      cat: "boss",
      type: "daily",
      times: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
      durationMin: 30,
      status: "unconfirmed"
    },
    {
      id: "siege",
      cat: "boss",
      type: "weekly",
      days: [3, 6],
      times: ["21:30"],
      durationMin: 30,
      status: "confirmed"
    },
    {
      id: "siegeBosses",
      cat: "boss",
      type: "weekly",
      days: [3, 6],
      times: ["21:45"],
      durationMin: 30,
      status: "confirmed"
    },
    {
      id: "nahma",
      cat: "boss",
      type: "weekly",
      days: [5, 0],
      times: ["22:00"],
      durationMin: 30,
      status: "confirmed"
    }
  ]
};
