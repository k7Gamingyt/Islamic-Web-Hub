const BASE_URL = "https://api.aladhan.com/v1";

export interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  Midnight: string;
}

export interface PrayerTimesResponse {
  timings: PrayerTimes;
  date: {
    readable: string;
    timestamp: string;
    hijri: {
      date: string;
      day: string;
      month: { number: number; en: string; ar: string };
      year: string;
    };
    gregorian: {
      date: string;
      day: string;
      month: { number: number; en: string };
      year: string;
    };
  };
  meta: {
    timezone: string;
    method: { id: number; name: string };
  };
}

export interface NextPrayer {
  name: string;
  time: string;
  timeRemaining: string;
  minutesRemaining: number;
}

const PRAYER_NAMES = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
type PrayerName = (typeof PRAYER_NAMES)[number];

export const PrayerService = {
  async getByCity(city: string, country: string, method = 4): Promise<PrayerTimesResponse> {
    const url = `${BASE_URL}/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch prayer times");
    const data = await res.json();
    if (data.code !== 200) throw new Error(data.data || "Prayer times error");
    return data.data;
  },

  async getByCoords(lat: number, lng: number, method = 4): Promise<PrayerTimesResponse> {
    const url = `${BASE_URL}/timings?latitude=${lat}&longitude=${lng}&method=${method}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch prayer times");
    const data = await res.json();
    if (data.code !== 200) throw new Error(data.data || "Prayer times error");
    return data.data;
  },

  getNextPrayer(timings: PrayerTimes): NextPrayer | null {
    const now = new Date();
    const todayStr = now.toDateString();

    for (const name of PRAYER_NAMES) {
      const timeStr = timings[name as PrayerName];
      const [hours, minutes] = timeStr.split(":").map(Number);
      const prayerTime = new Date(todayStr);
      prayerTime.setHours(hours, minutes, 0, 0);

      if (prayerTime > now) {
        const diff = prayerTime.getTime() - now.getTime();
        const totalMinutes = Math.floor(diff / 60000);
        const h = Math.floor(totalMinutes / 60);
        const m = totalMinutes % 60;
        const timeRemaining = h > 0 ? `${h}h ${m}m` : `${m}m`;
        return { name, time: timeStr, timeRemaining, minutesRemaining: totalMinutes };
      }
    }

    // All prayers passed — next is Fajr tomorrow
    const fajrStr = timings.Fajr;
    const [fh, fm] = fajrStr.split(":").map(Number);
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(fh, fm, 0, 0);
    const diff = tomorrow.getTime() - now.getTime();
    const totalMinutes = Math.floor(diff / 60000);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return { name: "Fajr", time: fajrStr, timeRemaining: `${h}h ${m}m`, minutesRemaining: totalMinutes };
  },

  formatTime(timeStr: string): string {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const d = new Date();
    d.setHours(hours, minutes, 0, 0);
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  },
};
