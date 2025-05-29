import "@/once-ui/styles/index.scss";
import "@/once-ui/tokens/index.scss";
import type { Metadata } from "next";

import ContextProvider from "./providers";
import { headers } from "next/headers";

import classNames from "classnames";

import { baseURL, style, meta, font, effects } from "@/app/resources/once-ui.config";
import { Background, Column, Flex, ToastProvider, ThemeProvider } from "@/once-ui/components";

import { opacity, SpacingToken } from "@/once-ui/types";
import { chart } from "./resources/data.config";

export const metadata: Metadata = {
  title: 'TCG DApp',
  description: 'A decentralized NFT marketplace for buying, selling, and trading digital assets.',
  metadataBase: new URL(baseURL),
  openGraph: {
    title: 'NFT Marketplace',
    description: 'Decentralized NFT trading platform',
    images: '/og-image.jpg',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NFT Marketplace',
    description: 'Trade digital assets on-chain',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const cookies = headersList.get("cookie");

  return (
    <Flex
      as="html"
      lang="en"
      fillHeight
      background="page"
      data-neutral={style.neutral}
      data-brand={style.brand}
      data-accent={style.accent}
      data-border={style.border}
      data-solid={style.solid}
      data-solid-style={style.solidStyle}
      data-surface={style.surface}
      data-transition={style.transition}
      data-scaling={style.scaling}
      data-viz={chart.mode}
      data-mode={chart.variant}
      className={classNames(
        font.primary.variable,
        font.secondary.variable,
        font.tertiary.variable,
        font.code.variable,
      )}
    >
      <ThemeProvider>
        <ToastProvider>
          <Column as="body" fillWidth margin="0" padding="0">
            <Background
              position="absolute"
              mask={{
                x: effects.mask.x,
                y: effects.mask.y,
                radius: effects.mask.radius,
                cursor: effects.mask.cursor
              }}
              gradient={{
                display: effects.gradient.display,
                opacity: effects.gradient.opacity as opacity,
                x: effects.gradient.x,
                y: effects.gradient.y,
                width: effects.gradient.width,
                height: effects.gradient.height,
                tilt: effects.gradient.tilt,
                colorStart: effects.gradient.colorStart,
                colorEnd: effects.gradient.colorEnd,
              }}
              dots={{
                display: effects.dots.display,
                opacity: effects.dots.opacity as opacity,
                size: effects.dots.size as SpacingToken,
                color: effects.dots.color,
              }}
              grid={{
                display: effects.grid.display,
                opacity: effects.grid.opacity as opacity,
                color: effects.grid.color,
                width: effects.grid.width,
                height: effects.grid.height,
              }}
              lines={{
                display: effects.lines.display,
                opacity: effects.lines.opacity as opacity,
                size: effects.lines.size as SpacingToken,
                thickness: effects.lines.thickness,
                angle: effects.lines.angle,
                color: effects.lines.color,
              }}
            />
            <ContextProvider cookies={cookies}>
              {/* Header */}
              <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                  <h1 className="text-xl font-bold text-indigo-600">NFT Marketplace</h1>
                  <w3m-button />
                </div>
              </header>

              {/* Main Content */}
              <main className="flex-grow">
                {children}
              </main>

              {/* Footer */}
              <footer className="bg-white py-6 mt-12">
                <div className="container mx-auto px-4 text-center text-gray-500">
                  © {new Date().getFullYear()} NFT Marketplace. All rights reserved.
                </div>
              </footer>
            </ContextProvider>
          </Column>
        </ToastProvider>
      </ThemeProvider>
    </Flex>
  );
}