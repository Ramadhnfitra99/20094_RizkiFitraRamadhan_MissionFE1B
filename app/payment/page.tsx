import type { Metadata } from "next";
import { PaymentPage } from "../components/PaymentPage";

export const metadata: Metadata = {
  title: "Pembayaran Premium",
  description: "Selesaikan simulasi pembayaran paket Premium Chill.",
};

export default function PaymentRoute() {
  return <PaymentPage />;
}
