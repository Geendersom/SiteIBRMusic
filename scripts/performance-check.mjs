import { readFileSync } from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const htmlFiles = [
  'index.html',
  'pages/quem-somos.html',
  'pages/galeria.html',
  'pages/inscricoes.html',
  'pages/missao-visao-valores.html',
];

const failures = [];

function readProjectFile(filePath) {
  return readFileSync(path.join(rootDir, filePath), 'utf8');
}

function stripHtmlComments(content) {
  return content.replace(/<!--[\s\S]*?-->/g, '');
}

function expect(condition, message) {
  if (!condition) {
    failures.push(message);
  }
}

const indexHtml = readProjectFile('index.html');
const siteAssetsJs = readProjectFile('js/site-assets.js');

expect(
  /<picture class="hero__picture">[\s\S]*?type="image\/webp"[\s\S]*?class="hero__background parallax"/.test(
    indexHtml,
  ),
  'Home hero must serve a WebP source through a <picture> element.',
);

expect(
  /imagesrcset="[^"]+-hero-sm\.webp 640w,[^"]+-hero-md\.webp 1280w,[^"]+-hero-lg\.webp 1920w"/.test(
    indexHtml,
  ),
  'Hero preload must use width descriptors for responsive WebP variants.',
);

expect(
  /sizes="100vw"/.test(indexHtml),
  'Hero image must declare sizes="100vw" so the browser can pick the right variant.',
);

expect(
  /buildPhotoSrcSet\(slug, format = 'jpg'\)/.test(siteAssetsJs) &&
    /\$\{buildPhotoUrl\(slug, 'sm', format\)\} 640w/.test(siteAssetsJs) &&
    /\$\{buildPhotoUrl\(slug, 'lg', format\)\} 1920w/.test(siteAssetsJs),
  'Lazy photo loader must generate width-based srcset descriptors.',
);

for (const filePath of htmlFiles) {
  const html = stripHtmlComments(readProjectFile(filePath));

  expect(
    !/public\/imagens/i.test(html),
    `${filePath} must not reference original public/imagens assets in active markup.`,
  );

  for (const scriptMatch of html.matchAll(/<script\b([^>]*)\bsrc="[^"]+"/g)) {
    expect(
      /\bdefer\b/.test(scriptMatch[1]),
      `${filePath} scripts must use defer to avoid parser-blocking execution.`,
    );
  }
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join('\n'));
  process.exit(1);
}

console.log('Performance checks passed.');
