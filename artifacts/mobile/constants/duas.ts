export interface Dua {
  id: number;
  category: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
}

export const DUAS: Dua[] = [
  {
    id: 1,
    category: "Morning",
    title: "Waking Up",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    transliteration: "Alhamdu lillahil-lathee ahyana ba'da ma amatana wa ilayhin-nushoor",
    translation: "Praise be to Allah who gave us life after death and to Him is the resurrection.",
  },
  {
    id: 2,
    category: "Morning",
    title: "Morning Remembrance",
    arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ",
    transliteration: "Asbahna wa asbahal-mulku lillah, walhamdu lillah",
    translation: "We enter the morning and the entire kingdom belongs to Allah, all praise is for Allah.",
  },
  {
    id: 3,
    category: "Morning",
    title: "Protection Morning",
    arabic: "بِسْمِ اللَّهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلاَ فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    transliteration: "Bismillahil-lathee la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama'i wa huwas-samee'ul-'aleem",
    translation: "In the name of Allah, with whose name nothing can cause harm on earth or in the heavens, and He is the All-Hearing, All-Knowing.",
  },
  {
    id: 4,
    category: "Evening",
    title: "Evening Remembrance",
    arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ",
    transliteration: "Amsayna wa amsal-mulku lillah, walhamdu lillah",
    translation: "We enter the evening and the entire kingdom belongs to Allah, all praise is for Allah.",
  },
  {
    id: 5,
    category: "Evening",
    title: "Seeking Refuge (Evening)",
    arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    transliteration: "A'oothu bikalimatil-lahit-tammati min sharri ma khalaq",
    translation: "I seek refuge in the perfect words of Allah from the evil of what He has created.",
  },
  {
    id: 6,
    category: "Sleep",
    title: "Before Sleeping",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    transliteration: "Bismika Allahumma amootu wa ahya",
    translation: "In Your name, O Allah, I die and I live.",
  },
  {
    id: 7,
    category: "Sleep",
    title: "Sleep Protection",
    arabic: "اللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا",
    transliteration: "Allahumma bismika amootu wa ahya",
    translation: "O Allah, in Your name I die and in Your name I live.",
  },
  {
    id: 8,
    category: "Sleep",
    title: "Al-Ikhlas Before Sleep",
    arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ ۞ اللَّهُ الصَّمَدُ",
    transliteration: "Qul huwal-lahu ahad. Allahus-samad",
    translation: "Say: He is Allah, the One. Allah, the Eternal Refuge.",
  },
  {
    id: 9,
    category: "Travel",
    title: "Starting a Journey",
    arabic: "اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى",
    transliteration: "Allahumma inna nas'aluka fi safarina hadhal-birra wat-taqwa",
    translation: "O Allah, we ask You in this journey of ours righteousness and piety.",
  },
  {
    id: 10,
    category: "Travel",
    title: "Riding a Vehicle",
    arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ",
    transliteration: "Subhanal-lathee sakhkhara lana hatha wa ma kunna lahu muqrineen",
    translation: "Glory be to the One who has subjected this to us, and we would not have been capable of doing so.",
  },
  {
    id: 11,
    category: "Travel",
    title: "Returning from Journey",
    arabic: "آيِبُونَ تَائِبُونَ عَابِدُونَ لِرَبِّنَا حَامِدُونَ",
    transliteration: "Aa'iboona ta'iboona 'abidoona lirabbina hamidoon",
    translation: "We return, repent, worship and praise our Lord.",
  },
  {
    id: 12,
    category: "Food",
    title: "Before Eating",
    arabic: "بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ",
    transliteration: "Bismillahi wa 'ala barakatillah",
    translation: "In the name of Allah and with the blessings of Allah.",
  },
  {
    id: 13,
    category: "Food",
    title: "After Eating",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مِنَ الْمُسْلِمِينَ",
    transliteration: "Alhamdu lillahil-lathee at'amana wa saqana wa ja'alana minal-muslimeen",
    translation: "Praise be to Allah who fed us, gave us to drink, and made us Muslims.",
  },
  {
    id: 14,
    category: "General",
    title: "Seeking Forgiveness",
    arabic: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لاَ إِلَهَ إِلاَّ هُوَ الْحَيَّ الْقَيُّومَ وَأَتُوبُ إِلَيْهِ",
    transliteration: "Astaghfirullaha al-'atheema al-lathee la ilaha illa huwal-hayyul-qayyooma wa atubu ilayh",
    translation: "I seek forgiveness from Allah the Mighty, whom there is no god except Him, the Living, the Self-Sustaining, and I repent to Him.",
  },
  {
    id: 15,
    category: "General",
    title: "Seeking Good in Both Worlds",
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    transliteration: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'athaaban-nar",
    translation: "Our Lord, give us in this world that which is good and in the Hereafter that which is good, and protect us from the punishment of the Fire.",
  },
  {
    id: 16,
    category: "General",
    title: "Sayyid Al-Istighfar",
    arabic: "اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ",
    transliteration: "Allahumma anta rabbi la ilaha illa anta, khalaqtani wa ana 'abduka",
    translation: "O Allah, You are my Lord, there is no god except You. You created me and I am Your servant.",
  },
  {
    id: 17,
    category: "Mosque",
    title: "Entering the Mosque",
    arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
    transliteration: "Allahummaf-tah li abwaba rahmatik",
    translation: "O Allah, open the gates of Your mercy for me.",
  },
  {
    id: 18,
    category: "Mosque",
    title: "Leaving the Mosque",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",
    transliteration: "Allahumma inni as'aluka min fadlik",
    translation: "O Allah, I ask You of Your bounty.",
  },
];

export const DUA_CATEGORIES = ["All", "Morning", "Evening", "Sleep", "Travel", "Food", "General", "Mosque"];
