import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "SideQuest — Your next adventure is outside this app",
  description: "Short outdoor quests. Less screen, more world. Plan 1 mock product demo.",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
