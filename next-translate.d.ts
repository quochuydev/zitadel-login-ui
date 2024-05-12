import type { Paths, I18n, Translate } from 'next-translate';

export interface TranslationsKeys {
  common: Paths<typeof import('./locales/en/common.json')>;
  account_select: Paths<typeof import('./locales/en/account_select.json')>;
}

export interface TypeSafeTranslate<Namespace extends keyof TranslationsKeys>
  extends Omit<I18n, 't'> {
  t: {
    (
      key: TranslationsKeys[Namespace],
      ...rest: Tail<Parameters<Translate>>
    ): string;
    <T extends string>(template: TemplateStringsArray): string;
  };
}

declare module 'next-translate/useTranslation' {
  export default function useTranslation<
    Namespace extends keyof TranslationsKeys,
  >(namespace: Namespace): TypeSafeTranslate<Namespace>;
}
