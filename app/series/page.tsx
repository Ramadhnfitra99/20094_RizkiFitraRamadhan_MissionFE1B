import type { Metadata } from "next";
import { SeriesPage } from "../components/SeriesPage";

export const metadata: Metadata = {
  title: "Series",
  description: "Tonton series terbaru, episode lanjutan, dan tayangan Premium persembahan Chill.",
};

export default function SeriesRoute() {
  return <SeriesPage />;
}
