require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.resolve(__dirname, '..', process.env.DB_PATH || './database.sqlite');
const dataDir = path.resolve(__dirname, '../data');
const db = new Database(dbPath);

const DISTRO_TABLE_MAP = {
  "Ubuntu_2204": "Ubuntu 22.04",
  "Ubuntu_2404": "Ubuntu 24.04",
  "Debian_Bookworm": "Debian Bookworm",
  "Debian_Trixie": "Debian Trixie",
  "Fedora_42": "Fedora 42",
  "Fedora_43": "Fedora 43",
  "AlmaLinux_9": "AlmaLinux 9",
  "AlmaLinux_10": "AlmaLinux 10",
  "RockyLinux_9": "RockyLinux 9",
  "RockyLinux_10": "RockyLinux 10",
  "OpenSUSE_Tumbleweed": "OpenSUSE Tumbleweed",
  "OpenSUSE_Leap_156": "OpenSUSE Leap 15.6",
  "ClefOS_7": "ClefOS 7",
  "IBM_Validated_RHEL_9": "IBM Validated RHEL 9",
  "IBM_Validated_SLES_15": "IBM Validated SLES 15",
  "IBM_Validated_Ubuntu_2204": "IBM Validated Ubuntu 22.04",
  "IBM_Validated_Ubuntu_2404": "IBM Validated Ubuntu 24.04"
};

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('Created data directory');
}

const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));

if (files.length === 0) {
  console.log('No JSON files found in data/. Database will be empty.');
  process.exit(0);
}

db.pragma('journal_mode = WAL');

for (const file of files) {
  const tableName = path.basename(file, '.json');
  const osName = DISTRO_TABLE_MAP[tableName] || tableName;
  const filePath = path.join(dataDir, file);

  let packages;
  try {
    packages = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    console.error(`Failed to parse ${file}:`, e.message);
    continue;
  }

  // Drop and recreate
  db.prepare(`DROP TABLE IF EXISTS "${tableName}"`).run();
  db.prepare(`
    CREATE TABLE "${tableName}" (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      packageName TEXT,
      version TEXT,
      description TEXT,
      osName TEXT
    )
  `).run();

  const insert = db.prepare(`INSERT INTO "${tableName}" (packageName, version, description, osName) VALUES (?, ?, ?, ?)`);
  const insertMany = db.transaction((pkgs) => {
    for (const pkg of pkgs) {
      insert.run(pkg.packageName || '', pkg.version || '', pkg.description || '', osName);
    }
  });

  insertMany(packages);
  console.log(`Populated table "${tableName}" with ${packages.length} packages (osName: ${osName})`);
}

console.log('Database build complete.');
