import { ClerkProvider } from '@clerk/nextjs';
import { shadcn } from '@clerk/ui/themes';
import type { Metadata } from 'next';
import { Bricolage_Grotesque, Geist_Mono, Gochi_Hand, Hanken_Grotesk } from 'next/font/google';
import { MessagingProvider } from '@/app/_components/messaging-provider';
import { SiteFooter } from '@/app/_components/site-footer';
import { SchoolThemeProvider } from '@/app/_components/school-theme';
import { SiteHeader } from '@/app/_components/site-header';
import { getThemeContext } from '@/app/_lib/theme-school';
import { APP_NAME } from '@/lib/app-config';
import { NEUTRAL_THEME, schoolThemeStyle } from '@/lib/school-theme';
import { siteUrl } from '@/lib/site-url';
import './globals.css';

const hanken = Hanken_Grotesk({
  variable: '--font-hanken',
  subsets: ['latin'],
});

// Width and optical-size axes: the flyer caps narrow the face, large sizes get the display cut.
const bricolage = Bricolage_Grotesque({
  variable: '--font-bricolage',
  subsets: ['latin'],
  axes: ['opsz', 'wdth'],
});

// Handwriting for the odd sticky note; not preloaded since few pages use it.
const gochiHand = Gochi_Hand({
  variable: '--font-scribble',
  subsets: ['latin'],
  weight: '400',
  preload: false,
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: APP_NAME, template: `%s · ${APP_NAME}` },
  description: 'Sublease your place to other students, or find one near campus.',
};

export default async function RootLayout({ children }: LayoutProps<'/'>) {
  const theme = await getThemeContext();
  return (
    <html
      lang="en"
      className={`${hanken.variable} ${bricolage.variable} ${gochiHand.variable} ${geistMono.variable} h-full antialiased`}
      style={schoolThemeStyle(theme.school?.theme ?? NEUTRAL_THEME)}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider
          appearance={{
            theme: shadcn,
            variables: {
              colorPrimary: 'var(--school)',
              colorPrimaryForeground: 'var(--on-school)',
              colorInput: '#ffffff',
              colorInputForeground: 'var(--ink)',
              fontFamily: 'var(--font-hanken), system-ui, sans-serif',
              borderRadius: '0.3125rem',
            },
            elements: {
              headerTitle: {
                fontFamily: 'var(--font-bricolage), sans-serif',
                fontSize: '1.6rem',
                fontWeight: 800,
                letterSpacing: '-0.015em',
                lineHeight: 1.1,
              },
              buttonArrowIcon: 'hidden',
            },
          }}
          signInUrl="/sign-in"
          signUpUrl="/sign-up"
        >
          <SchoolThemeProvider schools={theme.schools} homeSchoolSlug={theme.homeSchoolSlug}>
            <MessagingProvider>
              <SiteHeader />
              {children}
              <SiteFooter />
            </MessagingProvider>
          </SchoolThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
