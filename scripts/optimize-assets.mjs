import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const photosDir = path.join(rootDir, 'public', 'imagens');
const logosDir = path.join(rootDir, 'public', 'logos');
const outputDir = path.join(rootDir, 'supabase', '.generated', 'site-assets');

const photoVariants = [
  { suffix: 'sm', maxDimension: 960, formatOptions: '58' },
  { suffix: 'lg', maxDimension: 1920, formatOptions: '72' },
];

const logoVariants = [
  {
    input: 'IBR MUSIC - TOPO.png',
    output: path.join('logos', 'logo-top.png'),
    width: 360,
  },
  {
    input: 'IBR MUSIC - OP 3.png',
    output: path.join('logos', 'logo-hero.png'),
    width: 960,
  },
  {
    input: 'LOGO-IBR (branca).png',
    output: path.join('logos', 'logo-footer.png'),
    width: 420,
  },
];

const iconVariants = [
  { output: path.join('icons', 'favicon-32.png'), width: 32 },
  { output: path.join('icons', 'apple-touch-icon.png'), width: 180 },
  { output: path.join('icons', 'favicon-192.png'), width: 192 },
  { output: path.join('icons', 'favicon-512.png'), width: 512 },
];

const sourceStats = [];
const generatedStats = [];

function ensureDir(dirPath) {
  mkdirSync(dirPath, { recursive: true });
}

function slugify(fileName) {
  return fileName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function fileSize(filePath) {
  return statSync(filePath).size;
}

function runSips(args) {
  execFileSync('sips', args, { stdio: 'pipe' });
}

function optimizePhoto(fileName) {
  const inputPath = path.join(photosDir, fileName);
  const slug = slugify(fileName);

  sourceStats.push({
    type: 'photo',
    fileName,
    size: fileSize(inputPath),
  });

  for (const variant of photoVariants) {
    const outputPath = path.join(outputDir, 'images', `${slug}-${variant.suffix}.jpg`);
    ensureDir(path.dirname(outputPath));
    runSips([
      '--resampleHeightWidthMax',
      String(variant.maxDimension),
      '-s',
      'format',
      'jpeg',
      '-s',
      'formatOptions',
      variant.formatOptions,
      inputPath,
      '--out',
      outputPath,
    ]);

    generatedStats.push({
      type: 'photo',
      fileName: path.relative(outputDir, outputPath),
      size: fileSize(outputPath),
    });
  }
}

function optimizePng(inputPath, outputPath, width) {
  ensureDir(path.dirname(outputPath));
  runSips([
    '--resampleWidth',
    String(width),
    '-s',
    'format',
    'png',
    inputPath,
    '--out',
    outputPath,
  ]);
}

function optimizeLogos() {
  for (const variant of logoVariants) {
    const inputPath = path.join(logosDir, variant.input);
    const outputPath = path.join(outputDir, variant.output);

    sourceStats.push({
      type: 'logo',
      fileName: variant.input,
      size: fileSize(inputPath),
    });

    optimizePng(inputPath, outputPath, variant.width);

    generatedStats.push({
      type: 'logo',
      fileName: path.relative(outputDir, outputPath),
      size: fileSize(outputPath),
    });
  }
}

function optimizeIcons() {
  const symbolPath = path.join(logosDir, 'SÍMBOLO.png');

  sourceStats.push({
    type: 'icon',
    fileName: 'SÍMBOLO.png',
    size: fileSize(symbolPath),
  });

  for (const variant of iconVariants) {
    const outputPath = path.join(outputDir, variant.output);
    optimizePng(symbolPath, outputPath, variant.width);

    generatedStats.push({
      type: 'icon',
      fileName: path.relative(outputDir, outputPath),
      size: fileSize(outputPath),
    });
  }
}

function bytesToHuman(value) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = value;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size.toFixed(size >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function main() {
  rmSync(outputDir, { recursive: true, force: true });
  ensureDir(outputDir);

  const photoFiles = readdirSync(photosDir)
    .filter((fileName) => /\.(jpe?g)$/i.test(fileName))
    .sort((left, right) => left.localeCompare(right));

  photoFiles.forEach(optimizePhoto);
  optimizeLogos();
  optimizeIcons();

  const summary = {
    generatedAt: new Date().toISOString(),
    sourceBytes: sourceStats.reduce((total, item) => total + item.size, 0),
    generatedBytes: generatedStats.reduce((total, item) => total + item.size, 0),
    sourceAssets: sourceStats,
    generatedAssets: generatedStats,
  };

  ensureDir(path.join(rootDir, 'docs'));
  writeFileSync(
    path.join(rootDir, 'docs', 'asset-optimization-summary.json'),
    `${JSON.stringify(summary, null, 2)}\n`,
    'utf8',
  );

  process.stdout.write(
    [
      `Assets source: ${bytesToHuman(summary.sourceBytes)}`,
      `Assets optimized: ${bytesToHuman(summary.generatedBytes)}`,
      `Output: ${path.relative(rootDir, outputDir)}`,
      `Report: docs/asset-optimization-summary.json`,
    ].join('\n'),
  );
  process.stdout.write('\n');
}

main();
