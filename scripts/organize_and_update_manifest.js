/**
 * GREY CORNER — CLASSEMENT AUTOMATIQUE DES FICHIERS DE VENTES PAR MOIS
 * Rangement dans ventes/YYYY-MM/ et mise à jour de ventes/manifest.json
 */

const fs = require('fs');
const path = require('path');

const ventesDir = path.join(__dirname, '..', 'ventes');

if (!fs.existsSync(ventesDir)) {
  fs.mkdirSync(ventesDir, { recursive: true });
}

// 1. Déplacer les fichiers .xls/.xlsx situés à la racine de ventes/ dans leurs sous-dossiers respectifs (YYYY-MM)
const rootEntries = fs.readdirSync(ventesDir);
let movedCount = 0;

rootEntries.forEach(entry => {
  if (entry === 'manifest.json') return;
  const fullPath = path.join(ventesDir, entry);
  const stat = fs.statSync(fullPath);

  if (stat.isFile() && (entry.endsWith('.xls') || entry.endsWith('.xlsx'))) {
    // Détecter l'année et le mois (ex: Fin_Journée_20260801.xls -> 2026-08)
    const match = entry.match(/(\d{4})(\d{2})\d{2}/);
    let monthFolder = new Date().toISOString().slice(0, 7); // ex: 2026-09
    if (match) {
      monthFolder = `${match[1]}-${match[2]}`;
    }

    const targetFolder = path.join(ventesDir, monthFolder);
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    const destPath = path.join(targetFolder, entry);
    fs.renameSync(fullPath, destPath);
    console.log(`[+] Fichier classé dans ventes/${monthFolder}/ : ${entry}`);
    movedCount++;
  }
});

// 2. Scanner récursivement tous les sous-dossiers pour collecter tous les fichiers
function getSalesFilesRecursive(dir, baseDir = dir) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat && stat.isDirectory()) {
      results = results.concat(getSalesFilesRecursive(fullPath, baseDir));
    } else {
      if ((file.endsWith('.xls') || file.endsWith('.xlsx')) && file !== 'manifest.json') {
        const relPath = path.relative(baseDir, fullPath).split(path.sep).join('/');
        results.push(relPath);
      }
    }
  });

  return results.sort();
}

const allSalesFiles = getSalesFilesRecursive(ventesDir);

const manifest = {
  totalFiles: allSalesFiles.length,
  lastUpdated: new Date().toISOString().slice(0, 10),
  files: allSalesFiles
};

fs.writeFileSync(path.join(ventesDir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf8');

console.log(`\n======================================================`);
console.log(`✅ SYNCHRONISATION DES FICHIERS DE VENTES TERMINÉE`);
console.log(`- Fichiers reclassés : ${movedCount}`);
console.log(`- Total fichiers inventoriés : ${allSalesFiles.length}`);
console.log(`- Manifest mis à jour : ventes/manifest.json`);
console.log(`======================================================\n`);
