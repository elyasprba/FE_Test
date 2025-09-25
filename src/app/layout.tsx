import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import '@ant-design/v5-patch-for-react-19';

import { Providers } from "./providers";
import MessageProvider from "@/utils/message-provider";
import AntdPatch from "../utils/antd-patch";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Test Jasamarga",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* patch antd biar support React 19 */}
        <AntdPatch />

        <Providers>
          <MessageProvider>
            {children}
          </MessageProvider>
        </Providers>
      </body>
    </html>
  );
}
