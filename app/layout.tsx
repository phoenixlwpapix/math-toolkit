import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // 根据你的路径来

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Math Toolkit",
  description: "Created by Kevin",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100`}
      >
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4 sm:p-8">
          {children}
        </main>
        <footer className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 py-4 text-center text-sm select-none border-t">
          © 2025 数理化工具箱 @KevinStudio All Rights Reserved.
        </footer>
      </body>
    </html>
  );
}
