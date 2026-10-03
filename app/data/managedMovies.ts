export type ManagedMovie = {
  id: string;
  title: string;
  genre: string;
  rating: number;
  year: number;
  poster: string;
};

export type MovieDraft = Omit<ManagedMovie, "id">;

export const posterOptions = [
  { label: "Suzume", value: "/assets/img/img5.png" },
  { label: "Big Hero 6", value: "/assets/img/img1.png" },
  { label: "Duty After School", value: "/assets/img/img12.png" },
  { label: "Missing", value: "/assets/img/img11.png" },
  { label: "The Little Mermaid", value: "/assets/img/img10.png" },
  { label: "Sonic the Hedgehog 2", value: "/assets/img/img3.png" },
] as const;

export const initialManagedMovies: ManagedMovie[] = [
  {
    id: "managed-suzume",
    title: "Suzume",
    genre: "Anime",
    rating: 8.7,
    year: 2022,
    poster: "/assets/img/img5.png",
  },
  {
    id: "managed-big-hero-6",
    title: "Big Hero 6",
    genre: "Keluarga",
    rating: 8.5,
    year: 2014,
    poster: "/assets/img/img1.png",
  },
  {
    id: "managed-duty-after-school",
    title: "Duty After School",
    genre: "Fiksi Ilmiah",
    rating: 8.1,
    year: 2023,
    poster: "/assets/img/img12.png",
  },
  {
    id: "managed-missing",
    title: "Missing",
    genre: "Misteri",
    rating: 7.9,
    year: 2023,
    poster: "/assets/img/img11.png",
  },
];

