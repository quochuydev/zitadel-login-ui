'use client';

import { cn } from '#/lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
];

const STORAGE_KEY = 'lang';

/**
 * Routes that render their own header LanguageSwitcher (AccountShell / Home).
 * The floating instance from the root layout hides itself there.
 */
const HEADER_ROUTES =
  /^\/(en|de|fr)\/account\/\d+(\/security(\/passkeys)?)?\/?$/;

export default function LanguageSwitcher({
  variant = 'floating',
}: {
  variant?: 'floating' | 'header';
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const segments = (pathname || '/').split('/');
  const current =
    LANGUAGES.find((lang) => lang.code === segments[1]) || LANGUAGES[0];

  const pathForLanguage = (code: string) => {
    const parts = (pathname || '/').split('/');
    if (LANGUAGES.some((lang) => lang.code === parts[1])) {
      parts[1] = code;
    } else {
      parts.splice(1, 0, code);
    }
    const query = searchParams?.toString();
    return `${parts.join('/') || '/'}${query ? `?${query}` : ''}`;
  };

  const switchTo = (code: string) => {
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch (error) {
      // localStorage unavailable (private mode) — still switch the URL.
    }

    setOpen(false);
    if (code !== current.code) router.push(pathForLanguage(code));
  };

  // Apply the stored preference when landing on a different locale.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (
        stored &&
        stored !== current.code &&
        LANGUAGES.some((lang) => lang.code === stored)
      ) {
        router.replace(pathForLanguage(stored));
      }
    } catch (error) {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;

    const onClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const menu = (className: string) => (
    <div
      className={cn(
        'w-40 overflow-hidden border border-gray-200 bg-white shadow-lg',
        className,
      )}
    >
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          type="button"
          onClick={() => switchTo(lang.code)}
          className={cn(
            'flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-gray-50',
            lang.code === current.code
              ? 'bg-indigo-50 font-medium text-indigo-700'
              : 'text-gray-700',
          )}
        >
          <span aria-hidden="true">{lang.flag}</span>
          {lang.label}
        </button>
      ))}
    </div>
  );

  if (variant === 'header') {
    return (
      <div ref={containerRef} className="relative">
        <button
          type="button"
          aria-label="Language"
          onClick={() => setOpen(!open)}
          className="flex h-8 items-center gap-1 border border-gray-200 bg-white px-2 text-base transition-colors hover:bg-gray-50"
        >
          <span aria-hidden="true">{current.flag}</span>
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-400"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        {open && menu('absolute right-0 top-full z-50 mt-2')}
      </div>
    );
  }

  // Floating variant (auth pages) — hidden where a header switcher exists.
  if (HEADER_ROUTES.test(pathname || '')) return null;

  return (
    <div ref={containerRef} className="fixed right-4 top-4 z-50">
      <button
        type="button"
        aria-label="Language"
        onClick={() => setOpen(!open)}
        className="flex h-9 items-center gap-1 border border-gray-200 bg-white px-2.5 text-lg shadow-sm transition-colors hover:bg-gray-50"
      >
        <span aria-hidden="true">{current.flag}</span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-400"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && menu('absolute right-0 top-full mt-1')}
    </div>
  );
}
