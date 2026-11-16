/* eslint-disable */
const puppeteer = require('puppeteer');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const countries = [
  { value: 'austria', url: 'https://www.bergfex.pl/oesterreich/' },
  { value: 'szwajcaria', url: 'https://www.bergfex.pl/schweiz/' },
  { value: 'niemcy', url: 'https://www.bergfex.pl/deutschland/' },
  { value: 'wlochy', url: 'https://www.bergfex.pl/italien/' },
  { value: 'slowenia', url: 'https://www.bergfex.pl/slowenien/' },
  { value: 'francja', url: 'https://www.bergfex.pl/frankreich/' },
  { value: 'polska', url: 'https://www.bergfex.pl/polen/' },
  { value: 'czechy', url: 'https://www.bergfex.pl/tschechien/' },
  { value: 'slowacja', url: 'https://www.bergfex.pl/slowakei/' },
  { value: 'hiszpania', url: 'https://www.bergfex.pl/spanien/' },
  { value: 'andorra', url: 'https://www.bergfex.pl/andorra/' },
];

async function scrape() {
  const browser = await puppeteer.launch({ headless: "new" });

  for (const country of countries) {
    console.log(`Парсим: ${country.value}`);
    const page = await browser.newPage();
    await page.goto(country.url, { waitUntil: 'networkidle2', timeout: 60000 });

    const items = await page.evaluate(() => {
      const rows = document.querySelectorAll('a[href*="/schigebiet/"]');
      const unique = new Map();
      rows.forEach(row => {
        const name = row.innerText.split('\n')[0].trim(); // берем только первую строку
        const href = row.getAttribute('href');
        if (name && href && !unique.has(href)) {
          const slug = href.split('/').filter(Boolean).pop();
          unique.set(href, { slug, name });
        }
      });
      return Array.from(unique.values());
    });

    const dbItems = items.map(item => ({
      category: 'city',
      value: item.slug,
      label_pl: item.name,
      label_en: item.name,
      parent_value: country.value,
      is_resort: true,
      is_active: true
    }));

    for (let i = 0; i < dbItems.length; i += 100) {
      await supabase.from('dictionaries').upsert(dbItems.slice(i, i + 100), { onConflict: 'category,value' });
    }
    console.log(`  Загружено: ${dbItems.length}`);
    await page.close();
  }

  await browser.close();
}

scrape();