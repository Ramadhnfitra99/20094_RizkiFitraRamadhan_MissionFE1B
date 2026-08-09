export type MediaItem = {
  title: string;
  image: string;
  previewImage?: string;
  rating?: string;
  badge?: "new" | "top" | "premium";
  age?: string;
  episodes?: string;
  genres?: string[];
  featured?: boolean;
  episodeTitle?: string;
  progress?: number;
  duration?: string;
};

export const continueWatching: MediaItem[] = [
  { title: "Don't Look Up", image: "/assets/img/frame1.png", previewImage: "/assets/img/frame1.png", rating: "4.5/5", episodeTitle: "Film", progress: 62, duration: "1j 18m", genres: ["Drama", "Komedi", "Fiksi Ilmiah"] },
  { title: "All of Us Are Dead", image: "/assets/img/frame4.png", previewImage: "/assets/img/frame4.png", rating: "4.7/5", badge: "new", episodeTitle: "Episode 2: Satu-satunya Jalan", progress: 34, duration: "52m", genres: ["Misteri", "Kriminal", "Fantasi"], featured: true },
  { title: "Blue Lock", image: "/assets/img/frame2.png", previewImage: "/assets/img/frame2.png", rating: "4.6/5", badge: "new", episodeTitle: "Episode 9: Kebangkitan Ego", progress: 48, duration: "24m", genres: ["Anime", "Olahraga", "Drama"] },
  { title: "A Man Called Otto", image: "/assets/img/frame3.png", previewImage: "/assets/img/frame3.png", rating: "4.4/5", episodeTitle: "Film", progress: 72, duration: "42m", genres: ["Drama", "Komedi", "Keluarga"] },
  { title: "Duty After School", image: "/assets/img/img12.png", previewImage: "/assets/img/img12.png", rating: "4.8/5", badge: "new", episodeTitle: "Episode 7: Bertahan Bersama", progress: 18, duration: "39m", genres: ["Aksi", "Drama", "Fiksi Ilmiah"] },
];

export const topRated: MediaItem[] = [
  { title: "Suzume", image: "/assets/img/img5.png", previewImage: "/assets/img/img5.png", badge: "new", episodes: "Film", genres: ["Anime", "Fantasi", "Petualangan"] },
  { title: "Jurassic World Dominion", image: "/assets/img/img4.png", previewImage: "/assets/img/img4.png", episodes: "2j 27m", genres: ["Aksi", "Fiksi Ilmiah", "Petualangan"] },
  { title: "Sonic the Hedgehog 2", image: "/assets/img/img3.png", previewImage: "/assets/img/img3.png", episodes: "2j 2m", genres: ["Keluarga", "Komedi", "Aksi"] },
  { title: "All of Us Are Dead", image: "/assets/img/img2.png", previewImage: "/assets/img/frame4.png", episodes: "16 Episode", genres: ["Misteri", "Kriminal", "Fantasi"], featured: true },
  { title: "Big Hero 6", image: "/assets/img/img1.png", previewImage: "/assets/img/img1.png", badge: "top", episodes: "1j 42m", genres: ["Anak-anak", "Komedi", "Aksi"] },
];

export const trending: MediaItem[] = [
  { title: "Suzume", image: "/assets/img/img5.png", badge: "top" },
  { title: "The Tomorrow War", image: "/assets/img/img6.png", badge: "top" },
  { title: "Ant-Man: Quantumania", image: "/assets/img/img7.png", badge: "top" },
  { title: "Guardians of the Galaxy", image: "/assets/img/img8.png", badge: "top" },
  { title: "A Man Called Otto", image: "/assets/img/img9.png", badge: "top" },
];

export const newReleases: MediaItem[] = [
  { title: "The Little Mermaid", image: "/assets/img/img10.png", badge: "new" },
  { title: "Missing", image: "/assets/img/img11.png", badge: "top" },
  { title: "Duty After School", image: "/assets/img/img12.png" },
  { title: "Big Hero 6", image: "/assets/img/img1.png", badge: "new" },
  { title: "All of Us Are Dead", image: "/assets/img/img2.png" },
];
