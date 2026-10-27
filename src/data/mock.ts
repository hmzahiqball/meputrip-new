import type { TravelData, Region, City, Destination } from "../types/travel";
export const regions: Region[] = [
  {
    id: "sumatra",
    name: "Sumatra",
    tagline: "Liar, hangat, penuh cerita.",
    description:
      "Dari danau vulkanik hingga ragam budaya Minangkabau. Temukan sisi barat Nusantara dengan ritme perjalananmu.",
  },
  {
    id: "jawa",
    name: "Jawa",
    tagline: "Setiap sudut punya cerita.",
    description:
      "Menyusuri jejak budaya, udara pegunungan, dan kota yang selalu punya alasan untuk dikunjungi kembali.",
  },
  {
    id: "kalimantan",
    name: "Kalimantan",
    tagline: "Kembali ke pelukan alam.",
    description:
      "Susuri sungai, hutan tropis, dan kehidupan yang dekat dengan alam.",
  },
  {
    id: "sulawesi",
    name: "Sulawesi",
    tagline: "Keajaiban di setiap lekuk.",
    description:
      "Laut sebening kaca dan tradisi yang hidup. Petualangan baru menantimu di Sulawesi.",
  },
  {
    id: "bali",
    name: "Bali",
    tagline: "Temukan tenangmu.",
    description:
      "Pagi di antara sawah, sore di tepi laut. Nikmati Bali melampaui kartu pos.",
  },
  {
    id: "nusa-tenggara",
    name: "Nusa Tenggara",
    tagline: "Mengejar matahari ke timur.",
    description:
      "Bukit savana, pulau-pulau kecil, dan laut biru yang seolah tak berujung.",
  },
  {
    id: "maluku",
    name: "Maluku",
    tagline: "Permata di laut timur.",
    description:
      "Jejak rempah, pulau bersejarah, dan pantai-pantai yang menunggu untuk dijelajahi.",
  },
  {
    id: "papua",
    name: "Papua",
    tagline: "Jauh melangkah, dalam merasa.",
    description:
      "Jelajahi kepulauan, bentang pegunungan, dan kekayaan budaya di timur Indonesia.",
  },
];
const cityGroups: Record<string, string[]> = {
  sumatra: ["Medan", "Padang", "Bukittinggi", "Palembang", "Bandar Lampung"],
  jawa: [
    "Bandung",
    "Jakarta",
    "Yogyakarta",
    "Semarang",
    "Surabaya",
    "Banyuwangi",
  ],
  kalimantan: ["Pangkalan Bun", "Balikpapan"],
  sulawesi: ["Makassar", "Manado", "Toraja"],
  bali: ["Ubud", "Denpasar"],
  "nusa-tenggara": ["Labuan Bajo", "Lombok"],
  maluku: ["Ambon", "Banda Neira"],
  papua: ["Raja Ampat", "Jayapura"],
};
export const cities: City[] = Object.entries(cityGroups).flatMap(
  ([regionId, names]) =>
    names.map((name) => ({
      id: name.toLowerCase().replaceAll(" ", "-"),
      name,
      regionId,
    })),
);
export const photos = {
  bali: "/images/bali.jpg",
  bromo: "/images/bromo.jpg",
  bajo: "/images/bajo.jpg",
  raja: "/images/raja.jpg",
  forest: "/images/forest.jpg",
  temple: "/images/temple.jpg",
};
const entries: [string, string, string, string, keyof typeof photos][] = [
  [
    "medan",
    "Danau Toba",
    "Danau",
    "Panorama danau vulkanik dan perjalanan budaya di sekitarnya.",
    "forest",
  ],
  [
    "padang",
    "Pantai Air Manis",
    "Pantai",
    "Jelajahi pesisir Padang dan kisah yang melekat di dalamnya.",
    "raja",
  ],
  [
    "bukittinggi",
    "Ngarai Sianok",
    "Alam",
    "Lembah hijau dan lanskap yang mengundang langkah santai.",
    "forest",
  ],
  [
    "palembang",
    "Sungai Musi",
    "Budaya",
    "Mengenal kota dari tepian sungai dan kuliner setempat.",
    "temple",
  ],
  [
    "bandar-lampung",
    "Pulau Pahawang",
    "Bahari",
    "Inspirasi perjalanan pulau dan eksplorasi laut Lampung.",
    "raja",
  ],
  [
    "bandung",
    "Kawah Putih",
    "Alam",
    "Lanskap danau kawah dengan kabut tipis dan suasana pegunungan.",
    "forest",
  ],
  [
    "bandung",
    "Ranca Upas",
    "Alam",
    "Ruang hijau untuk melepas penat di dataran tinggi.",
    "forest",
  ],
  [
    "jakarta",
    "Kota Tua",
    "Budaya",
    "Berjalan di antara arsitektur bersejarah dan cerita kota.",
    "temple",
  ],
  [
    "yogyakarta",
    "Candi Prambanan",
    "Budaya",
    "Menikmati arsitektur candi dan jejak budaya Jawa.",
    "temple",
  ],
  [
    "yogyakarta",
    "Pantai Timang",
    "Pantai",
    "Karakter pesisir selatan dalam sebuah perjalanan singkat.",
    "raja",
  ],
  [
    "semarang",
    "Lawang Sewu",
    "Budaya",
    "Menyusuri warisan arsitektur di jantung Semarang.",
    "temple",
  ],
  [
    "surabaya",
    "Taman Nasional Bromo Tengger Semeru",
    "Petualangan",
    "Ide perjalanan dari Surabaya menuju lanskap vulkanik Bromo.",
    "bromo",
  ],
  [
    "banyuwangi",
    "Kawah Ijen",
    "Petualangan",
    "Pendakian dan bentang kawah di ujung timur Jawa.",
    "bromo",
  ],
  [
    "pangkalan-bun",
    "Tanjung Puting",
    "Alam",
    "Inspirasi susur sungai dan pengamatan alam secara bertanggung jawab.",
    "forest",
  ],
  [
    "balikpapan",
    "Hutan Lindung Sungai Wain",
    "Alam",
    "Mengenal lanskap hutan tropis di sekitar Balikpapan.",
    "forest",
  ],
  [
    "makassar",
    "Rammang-Rammang",
    "Alam",
    "Dari Makassar menuju hamparan karst dan sungai yang tenang.",
    "forest",
  ],
  [
    "manado",
    "Bunaken",
    "Bahari",
    "Mengenal kehidupan laut dengan operator lokal.",
    "raja",
  ],
  [
    "toraja",
    "Kete Kesu",
    "Budaya",
    "Mengenal arsitektur dan tradisi masyarakat Toraja.",
    "temple",
  ],
  [
    "ubud",
    "Tegallalang",
    "Alam",
    "Sawah berundak, udara pagi, dan sisi Bali yang lebih pelan.",
    "bali",
  ],
  [
    "ubud",
    "Campuhan Ridge Walk",
    "Alam",
    "Jalur berjalan kaki dengan panorama perbukitan Ubud.",
    "bali",
  ],
  [
    "denpasar",
    "Pantai Sanur",
    "Pantai",
    "Menyambut pagi di tepi pantai dan menjelajah lingkungan sekitarnya.",
    "raja",
  ],
  [
    "labuan-bajo",
    "Pulau Padar",
    "Petualangan",
    "Jejak langkah menuju panorama teluk dan bukit kepulauan Komodo.",
    "bajo",
  ],
  [
    "labuan-bajo",
    "Pink Beach",
    "Bahari",
    "Satu persinggahan pesisir dalam inspirasi perjalanan Komodo.",
    "bajo",
  ],
  [
    "lombok",
    "Bukit Merese",
    "Alam",
    "Bukit pesisir dan cahaya senja di selatan Lombok.",
    "bajo",
  ],
  [
    "ambon",
    "Pantai Liang",
    "Pantai",
    "Waktu santai di pesisir Maluku dengan suasana tropis.",
    "raja",
  ],
  [
    "banda-neira",
    "Benteng Belgica",
    "Budaya",
    "Jejak sejarah rempah dan cerita Banda Neira.",
    "temple",
  ],
  [
    "raja-ampat",
    "Piaynemo",
    "Bahari",
    "Gugusan pulau karst dan laut biru di kepulauan Raja Ampat.",
    "raja",
  ],
  [
    "jayapura",
    "Danau Sentani",
    "Alam",
    "Inspirasi perjalanan danau dan pengenalan budaya setempat.",
    "forest",
  ],
];
export const destinations: Destination[] = entries.map(
  ([cityId, name, category, description, photo], i) => ({
    id: `dest-${i + 1}`,
    cityId,
    regionId: cities.find((c) => c.id === cityId)!.regionId,
    name,
    category,
    description,
    image: photos[photo],
    imageAlt: `Foto ilustrasi kategori ${category.toLowerCase()}, bukan jaminan dokumentasi ${name}`,
  }),
);
export const mockData: TravelData = {
  regions,
  cities,
  destinations,
  packages: regions.map((r, i) => ({
    id: `trip-${r.id}`,
    regionId: r.id,
    cityId: cities.find((c) => c.regionId === r.id)!.id,
    name: [
      "Sumatra, lebih dekat",
      "Cerita dari tanah Jawa",
      "Menyusuri Kalimantan",
      "Warna-warni Sulawesi",
      "A slow escape in Bali",
      "Sailing through Komodo",
      "Jejak rempah Maluku",
      "Raja Ampat, sejauh mata",
    ][i],
    duration: [
      "4 hari · 3 malam",
      "3 hari · 2 malam",
      "4 hari · 3 malam",
      "4 hari · 3 malam",
      "3 hari · 2 malam",
      "3 hari · 2 malam",
      "4 hari · 3 malam",
      "5 hari · 4 malam",
    ][i],
    price: "Harga dalam penyusunan",
    type: i % 2 === 0 ? "private" : "open",
    departure: "Jadwal contoh — konfirmasi dahulu",
    availability: "Ketersediaan belum dikonfirmasi",
    image: [
      photos.forest,
      photos.bromo,
      photos.forest,
      photos.raja,
      photos.bali,
      photos.bajo,
      photos.temple,
      photos.raja,
    ][i],
    description: `Draft itinerary eksplorasi ${r.name}. Rute, fasilitas, biaya, dan keberangkatan perlu dikonfirmasi kepada tim.`,
  })),
  testimonials: [
    {
      id: "example-1",
      name: "Pelanggan contoh",
      quote:
        "Perjalanan yang memberi ruang untuk menikmati setiap tempat, tanpa terburu-buru.",
      trip: "Contoh ulasan perjalanan Bali",
      rating: 5,
      isDemo: true,
    },
  ],
  company: {
    name: "Meputrip",
    story:
      "Meputrip dirancang sebagai teman untuk menemukan perjalanan yang lebih personal di Indonesia. Dari langkah pertama menyusun rute sampai cerita yang dibawa pulang, kami ingin menghadirkan pengalaman yang penuh makna. Profil ini merupakan draft dan perlu disesuaikan dengan perusahaan sebenarnya.",
    vision:
      "Mendekatkan lebih banyak orang dengan keragaman alam dan budaya Indonesia.",
    mission:
      "Menyusun pilihan perjalanan yang jelas, fleksibel, dan menghargai masyarakat serta lingkungan setempat.",
  },
  legal: [
    {
      id: "business",
      title: "Identitas badan usaha",
      status: "Informasi legalitas akan ditampilkan di sini.",
      url: "",
    },
    {
      id: "permit",
      title: "Perizinan & dokumen pendukung",
      status: "Dokumen belum diberikan oleh perusahaan.",
      url: "",
    },
  ],
  contact: {
    whatsapp: "",
    email: "",
    phone: "",
    address: "Alamat kantor akan ditambahkan",
    instagram: "",
    hours: "Jam operasional akan dikonfirmasi",
  },
};
