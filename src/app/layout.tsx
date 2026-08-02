import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aditya Kumar Maurya | Software Engineering Notes",
  description: "A computer science student building developer tools, backend systems, and useful software."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><head><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Zilla+Slab:wght@500;600;700&display=swap" /></head><body>{children}</body></html>;
}
