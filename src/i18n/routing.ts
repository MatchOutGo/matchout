import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';
 
export const routing = defineRouting({
  locales: ['pl', 'en'],
  defaultLocale: 'pl',
  localeDetection: false // <-- Отключает авто-выбор языка браузера
});
 
export const {Link, redirect, usePathname, useRouter} = createNavigation(routing);