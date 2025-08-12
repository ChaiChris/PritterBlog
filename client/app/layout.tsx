import type { Metadata } from "next";
import "./globals.css";
import "@fontsource/noto-sans-tc"; // Defaults to weight 400
import "@fontsource/noto-sans-tc/400.css"; // Specify weight
// [100,200,300,400,500,600,700,800,900]
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Pritter Blog",
  description: "Your blog",
  icons: {
    icon: ["/favicon.ico"],
    apple: ["/apple-touch-icon.png"],
    shortcut: ["/apple-touch-icon.png"],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-tw">
      <body className={` antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
