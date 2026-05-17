export const HIJRI_MONTHS = [
  "Muharram",
  "Safar",
  "Rabi' al-Awwal",
  "Rabi' al-Akhir",
  "Jumada al-Ula",
  "Jumada al-Akhira",
  "Rajab",
  "Sha'ban",
  "Ramadan",
  "Shawwal",
  "Dhu al-Qi'da",
  "Dhu al-Hijja",
];

export const HIJRI_MONTHS_AR = [
  "مُحَرَّم",
  "صَفَر",
  "رَبِيعُ الأَوَّل",
  "رَبِيعُ الآخِر",
  "جُمَادَى الأُولَى",
  "جُمَادَى الآخِرَة",
  "رَجَب",
  "شَعْبَان",
  "رَمَضَان",
  "شَوَّال",
  "ذُو الْقَعْدَة",
  "ذُو الْحِجَّة",
];

export interface HijriDate {
  year: number;
  month: number;
  day: number;
  monthName: string;
  monthNameAr: string;
}

export function toHijri(date: Date): HijriDate {
  const gy = date.getFullYear();
  const gm = date.getMonth() + 1;
  const gd = date.getDate();

  const jd =
    Math.floor((1461 * (gy + 4800 + Math.floor((gm - 14) / 12))) / 4) +
    Math.floor((367 * (gm - 2 - 12 * Math.floor((gm - 14) / 12))) / 12) -
    Math.floor((3 * Math.floor((gy + 4900 + Math.floor((gm - 14) / 12)) / 100)) / 4) +
    gd -
    32075;

  let z = jd - 1948439 + 10632;
  const n = Math.floor(z / 10631);
  z = z - 10631 * n + 354;
  const j =
    Math.floor((10985 - z) / 5316) * Math.floor((50 * z) / 17719) +
    Math.floor(z / 5670) * Math.floor((43 * z) / 15238);
  z =
    z -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29;
  const month = Math.floor((24 * z) / 709);
  const day = z - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;

  const safeMonth = Math.max(1, Math.min(12, month));

  return {
    year,
    month: safeMonth,
    day,
    monthName: HIJRI_MONTHS[safeMonth - 1],
    monthNameAr: HIJRI_MONTHS_AR[safeMonth - 1],
  };
}

export interface IslamicEvent {
  month: number;
  day: number;
  name: string;
  arabic: string;
}

export const ISLAMIC_EVENTS: IslamicEvent[] = [
  { month: 1, day: 1, name: "Islamic New Year", arabic: "رأس السنة الهجرية" },
  { month: 1, day: 10, name: "Day of Ashura", arabic: "يوم عاشوراء" },
  { month: 3, day: 12, name: "Mawlid an-Nabi", arabic: "المولد النبوي الشريف" },
  { month: 7, day: 27, name: "Laylat al-Mi'raj", arabic: "ليلة المعراج" },
  { month: 8, day: 15, name: "Laylat al-Bara'at", arabic: "ليلة البراءة" },
  { month: 9, day: 1, name: "Start of Ramadan", arabic: "بداية رمضان" },
  { month: 9, day: 27, name: "Laylat al-Qadr", arabic: "ليلة القدر" },
  { month: 10, day: 1, name: "Eid al-Fitr", arabic: "عيد الفطر" },
  { month: 12, day: 9, name: "Day of Arafah", arabic: "يوم عرفة" },
  { month: 12, day: 10, name: "Eid al-Adha", arabic: "عيد الأضحى" },
];

export function getRamadanCountdown(hijri: HijriDate): number {
  if (hijri.month === 9) return 0;
  if (hijri.month < 9) {
    let days = 30 - hijri.day;
    for (let m = hijri.month + 1; m < 9; m++) {
      days += m % 2 === 1 ? 30 : 29;
    }
    return days + 1;
  }
  let days = 30 - hijri.day;
  for (let m = hijri.month + 1; m <= 12; m++) {
    days += m % 2 === 1 ? 30 : 29;
  }
  for (let m = 1; m < 9; m++) {
    days += m % 2 === 1 ? 30 : 29;
  }
  return days + 1;
}
