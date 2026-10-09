import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "SideQuest — Your next adventure is outside this app",
  description: "Short AI-generated outdoor quests with real evidence verification and a visibility-based Away Ratio.",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
