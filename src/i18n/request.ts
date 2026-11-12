import {getRequestConfig} from 'next-intl/server';
 
export default getRequestConfig(async ({requestLocale}) => {
  // Получаем локаль из URL (например, /en/...)
  let locale = await requestLocale;
 
  // Если локаль не поддерживается, ставим польский по умолчанию
  if (!locale || !['pl', 'en'].includes(locale)) {
    locale = 'pl';
  }
 
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});