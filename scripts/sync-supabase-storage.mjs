import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const projectRef = 'huxrqluykzicckxjgchf';
const bucketId = 'site-assets';
const remotePrefix = 'site/v1';
const generatedAssetsDir = path.join(rootDir, 'supabase', '.generated', 'site-assets');
const tempProjectRefPath = path.join(rootDir, 'supabase', '.temp', 'project-ref');
const publicBaseUrl = `https://${projectRef}.supabase.co/storage/v1/object/public/${bucketId}/${remotePrefix}`;

function fail(message) {
  throw new Error(message);
}

function runSupabase(args) {
  return execFileSync('supabase', args, {
    cwd: rootDir,
    env: {
      ...process.env,
      SUPABASE_ACCESS_TOKEN: process.env.SUPABASE_ACCESS_TOKEN ?? '',
    },
    stdio: 'pipe',
    encoding: 'utf8',
  });
}

function ensureSupabaseAccessToken() {
  if (!process.env.SUPABASE_ACCESS_TOKEN) {
    fail('SUPABASE_ACCESS_TOKEN is required.');
  }
}

function ensureAssetsExist() {
  if (!existsSync(generatedAssetsDir)) {
    fail('Optimized assets not found. Run `node scripts/optimize-assets.mjs` first.');
  }

  if (!statSync(generatedAssetsDir).isDirectory()) {
    fail('Optimized assets path is invalid.');
  }
}

function ensureLinkedProject() {
  mkdirSync(path.join(rootDir, 'supabase', '.temp'), { recursive: true });

  if (existsSync(tempProjectRefPath)) {
    const linkedRef = readFileSync(tempProjectRefPath, 'utf8').trim();
    if (linkedRef === projectRef) {
      return;
    }
  }

  runSupabase(['link', '--project-ref', projectRef]);
}

function getLegacyServiceRoleKey() {
  const response = runSupabase(['projects', 'api-keys', '--project-ref', projectRef, '-o', 'json']);
  const apiKeys = JSON.parse(response);
  const serviceRole = apiKeys.find(
    (entry) => entry.name === 'service_role' && entry.type === 'legacy' && typeof entry.api_key === 'string',
  );

  if (!serviceRole) {
    fail('Legacy service role key not available for this project.');
  }

  return serviceRole.api_key;
}

async function createOrUpdateBucket(serviceRoleKey) {
  const bucketUrl = `https://${projectRef}.supabase.co/storage/v1/bucket`;
  const payload = {
    id: bucketId,
    name: bucketId,
    public: true,
    file_size_limit: 5 * 1024 * 1024,
    allowed_mime_types: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/svg+xml',
      'image/x-icon',
    ],
  };

  const headers = {
    Authorization: `Bearer ${serviceRoleKey}`,
    apikey: serviceRoleKey,
    'Content-Type': 'application/json',
  };

  let response = await fetch(bucketUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    return 'created';
  }

  response = await fetch(`${bucketUrl}/${bucketId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    return 'updated';
  }

  const body = await response.text();
  fail(`Bucket provisioning failed: ${response.status} ${body}`);
}

function uploadAssets() {
  const assetDirectories = readdirSync(generatedAssetsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  for (const directory of assetDirectories) {
    runSupabase([
      '--experimental',
      'storage',
      'cp',
      '-r',
      path.join(generatedAssetsDir, directory),
      `ss:///${bucketId}/${remotePrefix}`,
      '--cache-control',
      'public, max-age=31536000, immutable',
      '--jobs',
      '8',
    ]);
  }
}

function removeLegacyNestedUpload() {
  try {
    runSupabase([
      '--experimental',
      'storage',
      'rm',
      '-r',
      `ss:///${bucketId}/${remotePrefix}/site-assets`,
    ]);
  } catch {
    // The cleanup path only exists when an older recursive upload nested the source directory.
  }
}

async function verifyUpload() {
  const response = await fetch(`${publicBaseUrl}/images/dsc07901-enhanced-nr-hero-lg.webp`, {
    method: 'HEAD',
  });

  if (!response.ok) {
    fail(`Public asset verification failed with status ${response.status}.`);
  }

  return {
    status: response.status,
    contentLength: response.headers.get('content-length') ?? 'unknown',
  };
}

async function main() {
  ensureSupabaseAccessToken();
  ensureAssetsExist();
  ensureLinkedProject();

  const serviceRoleKey = getLegacyServiceRoleKey();
  const bucketResult = await createOrUpdateBucket(serviceRoleKey);
  uploadAssets();
  removeLegacyNestedUpload();
  const verification = await verifyUpload();

  process.stdout.write(
    [
      `Bucket ${bucketId}: ${bucketResult}`,
      `Sample asset status: ${verification.status}`,
      `Sample asset bytes: ${verification.contentLength}`,
      `Public base URL: ${publicBaseUrl}`,
    ].join('\n'),
  );
  process.stdout.write('\n');
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
