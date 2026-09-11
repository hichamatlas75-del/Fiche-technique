/**
 * GREY CORNER — AME-01 : Script de versioning automatique
 * Met à jour tous les suffixes ?v=X.X dans les fichiers HTML
 * Usage : node scripts/bump-version.js [nouvelle-version]
 * Ex:    node scripts/bump-version.js v8.3
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const HTML_FILES = ['index.html', 'consommation.html', 'comparateur.html', 'audit.html', 'SYNTHESE_DECISIONNELLE_MENU.html'];
const CORE_UTILS = path.join(ROOT, 'js', 'core-utils.js');

function detectCurrentVersion() {
  try {
    const content = fs.readFileSync(CORE_UTILS, 'utf8');
    const match = content.match(/APP_DATA_VERSION\s*=\s*['"]([^'"]+)['"]/);
    if (match) return match[1];
  } catch (e) {}
  return null;
}

function extractShortVersion(fullVersion) {
  const m = fullVersion.match(/^(v[\d.]+)/);
  return m ? m[1] : fullVersion;
}

const targetVersion = process.argv[2]
  ? process.argv[2].trim()
  : extractShortVersion(detectCurrentVersion() || 'v8.2');

if (!targetVersion) {
  console.error('Impossible de détecter la version. Passez-la en argument.');
  process.exit(1);
}

console.log('\n🔄 Mise à jour des suffixes de version → ' + targetVersion);
console.log('═'.repeat(60));

let updatedTotal = 0;

HTML_FILES.forEach(filename => {
  const filePath = path.join(ROOT, filename);
  if (!fs.existsSync(filePath)) {
    console.log('  ⚠️  ' + filename + ' — non trouvé, ignoré');
    return;
  }

  const original = fs.readFileSync(filePath, 'utf8');
  const updated = original.replace(/\?v=[\d.a-zA-Z]+(?=['"])/g, '?v=' + targetVersion);

  if (original === updated) {
    console.log('  ✔️  ' + filename + ' — déjà à jour');
    return;
  }

  const count = (original.match(/\?v=[\d.a-zA-Z]+(?=['"])/g) || []).length;
  fs.writeFileSync(filePath, updated, 'utf8');
  updatedTotal += count;
  console.log('  ✅ ' + filename + ' — ' + count + ' balise(s) mise(s) à jour');
});

console.log('═'.repeat(60));
if (updatedTotal > 0) {
  console.log('✅ ' + updatedTotal + ' balise(s) mises à jour avec ' + targetVersion);
} else {
  console.log('✔️  Tous les fichiers HTML sont déjà à ' + targetVersion + '.');
}
