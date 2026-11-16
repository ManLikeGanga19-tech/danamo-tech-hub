import { pageMetadata } from "@/lib/seo";
import { Navbar1 } from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import UnsubscribeClient from "./UnsubscribeClient";

export const metadata = pageMetadata({
  title: "Unsubscribe From the Newsletter",
  description: "Stop receiving Danamo Tech newsletter emails.",
  path: "/newsletter/unsubscribe",
  noindex: true,
});

export default function UnsubscribePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#0e0e15] dark:to-[#1E1E2F]">
      <Navbar1 />
      <main className="flex-grow flex items-center justify-center px-4 pt-32 pb-24">
        <UnsubscribeClient />
      </main>
      <Footer />
    </div>
  );
}
