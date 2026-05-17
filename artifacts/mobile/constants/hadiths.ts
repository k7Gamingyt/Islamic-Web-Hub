export interface Hadith {
  id: number;
  arabic: string;
  text: string;
  source: string;
  category: string;
}

export const HADITHS: Hadith[] = [
  {
    id: 1,
    arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ",
    text: "Actions are but by intentions, and every person will have only what they intended.",
    source: "Bukhari & Muslim",
    category: "Intentions",
  },
  {
    id: 2,
    arabic: "الدِّينُ النَّصِيحَةُ",
    text: "The religion is sincerity and genuine advice.",
    source: "Muslim",
    category: "Character",
  },
  {
    id: 3,
    arabic: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    text: "Whoever believes in Allah and the Last Day should say what is good or keep silent.",
    source: "Bukhari & Muslim",
    category: "Speech",
  },
  {
    id: 4,
    arabic: "لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    text: "None of you truly believes until he loves for his brother what he loves for himself.",
    source: "Bukhari & Muslim",
    category: "Brotherhood",
  },
  {
    id: 5,
    arabic: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ",
    text: "A Muslim is the one from whose tongue and hand other Muslims are safe.",
    source: "Bukhari",
    category: "Character",
  },
  {
    id: 6,
    arabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
    text: "The best of you are those who learn the Quran and teach it.",
    source: "Bukhari",
    category: "Quran",
  },
  {
    id: 7,
    arabic: "أَكْمَلُ الْمُؤْمِنِينَ إِيمَانًا أَحْسَنُهُمْ خُلُقًا",
    text: "The most complete believers in faith are those with the best character.",
    source: "Tirmidhi",
    category: "Character",
  },
  {
    id: 8,
    arabic: "تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ",
    text: "Your smile in the face of your brother is charity.",
    source: "Tirmidhi",
    category: "Charity",
  },
  {
    id: 9,
    arabic: "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ",
    text: "Whoever treads a path in search of knowledge, Allah will make easy for him the path to Paradise.",
    source: "Muslim",
    category: "Knowledge",
  },
  {
    id: 10,
    arabic: "أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ",
    text: "The most beloved deeds to Allah are those done consistently, even if they are few.",
    source: "Bukhari & Muslim",
    category: "Worship",
  },
  {
    id: 11,
    arabic: "الطُّهُورُ شَطْرُ الإِيمَانِ",
    text: "Cleanliness is half of faith.",
    source: "Muslim",
    category: "Purity",
  },
  {
    id: 12,
    arabic: "إِنَّ اللَّهَ لاَ يَنْظُرُ إِلَى أَجْسَادِكُمْ وَلاَ إِلَى صُوَرِكُمْ وَلَكِنْ يَنْظُرُ إِلَى قُلُوبِكُمْ",
    text: "Verily, Allah does not look at your bodies nor your faces, but He looks at your hearts.",
    source: "Muslim",
    category: "Heart",
  },
  {
    id: 13,
    arabic: "اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ وَأَتْبِعِ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا",
    text: "Fear Allah wherever you are, and follow up a bad deed with a good one and it will wipe it out.",
    source: "Tirmidhi",
    category: "Taqwa",
  },
  {
    id: 14,
    arabic: "صِلُوا أَرْحَامَكُمْ",
    text: "Maintain your ties of kinship.",
    source: "Bukhari",
    category: "Family",
  },
  {
    id: 15,
    arabic: "مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ",
    text: "Whoever fasts Ramadan with faith and seeking reward, his past sins will be forgiven.",
    source: "Bukhari & Muslim",
    category: "Ramadan",
  },
  {
    id: 16,
    arabic: "الْجَنَّةُ تَحْتَ أَقْدَامِ الأُمَّهَاتِ",
    text: "Paradise lies beneath the feet of mothers.",
    source: "Ibn Majah",
    category: "Family",
  },
  {
    id: 17,
    arabic: "خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ",
    text: "The best of people are those who are most beneficial to people.",
    source: "Tabarani",
    category: "Service",
  },
  {
    id: 18,
    arabic: "إِنَّ اللَّهَ رَفِيقٌ يُحِبُّ الرِّفْقَ",
    text: "Verily, Allah is gentle and He loves gentleness.",
    source: "Bukhari & Muslim",
    category: "Character",
  },
  {
    id: 19,
    arabic: "مَنْ حَفِظَ مَا بَيْنَ لَحْيَيْهِ وَمَا بَيْنَ رِجْلَيْهِ دَخَلَ الْجَنَّةَ",
    text: "Whoever guards what is between his jaws and what is between his legs will enter Paradise.",
    source: "Bukhari",
    category: "Morality",
  },
  {
    id: 20,
    arabic: "إِنَّمَا بُعِثْتُ لِأُتَمِّمَ صَالِحَ الأَخْلاَقِ",
    text: "I was sent only to perfect righteous character.",
    source: "Ahmad",
    category: "Character",
  },
  {
    id: 21,
    arabic: "مَنْ أَحَبَّ لِقَاءَ اللَّهِ أَحَبَّ اللَّهُ لِقَاءَهُ",
    text: "Whoever loves to meet Allah, Allah loves to meet him.",
    source: "Bukhari & Muslim",
    category: "Afterlife",
  },
  {
    id: 22,
    arabic: "إِنَّ الصِّدْقَ يَهْدِي إِلَى الْبِرِّ وَإِنَّ الْبِرَّ يَهْدِي إِلَى الْجَنَّةِ",
    text: "Truthfulness leads to righteousness and righteousness leads to Paradise.",
    source: "Bukhari & Muslim",
    category: "Truthfulness",
  },
  {
    id: 23,
    arabic: "الرَّاحِمُونَ يَرْحَمُهُمُ الرَّحْمَنُ ارْحَمُوا مَنْ فِي الأَرْضِ يَرْحَمْكُمْ مَنْ فِي السَّمَاءِ",
    text: "The merciful will be shown mercy by the Most Merciful. Show mercy to those on earth and He above the heavens will show mercy to you.",
    source: "Abu Dawud & Tirmidhi",
    category: "Mercy",
  },
  {
    id: 24,
    arabic: "مَنْ نَفَّسَ عَنْ مُؤْمِنٍ كُرْبَةً مِنْ كُرَبِ الدُّنْيَا نَفَّسَ اللَّهُ عَنْهُ كُرْبَةً",
    text: "Whoever relieves a believer of distress in this world, Allah will relieve him of distress on the Day of Resurrection.",
    source: "Muslim",
    category: "Service",
  },
  {
    id: 25,
    arabic: "قُلْ آمَنْتُ بِاللَّهِ ثُمَّ اسْتَقِمْ",
    text: "Say: I believe in Allah, then be steadfast.",
    source: "Muslim",
    category: "Faith",
  },
];

export const HADITH_CATEGORIES = [
  "All",
  "Character",
  "Quran",
  "Worship",
  "Knowledge",
  "Family",
  "Charity",
  "Faith",
  "Taqwa",
  "Mercy",
];

export function getDailyHadith(): Hadith {
  const day = new Date().getDate();
  return HADITHS[day % HADITHS.length];
}
