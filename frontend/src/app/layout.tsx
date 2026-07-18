import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-sans" 
});

export const metadata: Metadata = {
  title: "ShramikMitra AI - Labour Rights Assistant",
  description: "AI-powered Labour Rights Assistant for Migrant Workers in Delhi. Understand your rights, generate complaints, search schemes, and find help.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
