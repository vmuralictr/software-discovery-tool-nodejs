const db = require('../config/db');

const SUPPORTED_DISTROS = {
  "Ubuntu": {
    "Ubuntu 22.04": 1,
    "Ubuntu 24.04": 2
  },
  "Debian": {
    "Debian Bookworm": 4,
    "Debian Trixie": 8
  },
  "Fedora": {
    "Fedora 42": 16,
    "Fedora 43": 32
  },
  "AlmaLinux": {
    "AlmaLinux 9": 64,
    "AlmaLinux 10": 128
  },
  "RockyLinux": {
    "RockyLinux 9": 256,
    "RockyLinux 10": 512
  },
  "OpenSUSE": {
    "OpenSUSE Tumbleweed": 1024,
    "OpenSUSE Leap 15.6": 2048
  },
  "ClefOS": {
    "ClefOS 7": 4096
  },
  "IBM Z Validated": {
    "IBM Validated RHEL 9": 8192,
    "IBM Validated SLES 15": 16384,
    "IBM Validated Ubuntu 22.04": 32768,
    "IBM Validated Ubuntu 24.04": 65536
  }
};

// Map distro display name -> table name
const DISTRO_TABLE_MAP = {
  "Ubuntu 22.04": "Ubuntu_2204",
  "Ubuntu 24.04": "Ubuntu_2404",
  "Debian Bookworm": "Debian_Bookworm",
  "Debian Trixie": "Debian_Trixie",
  "Fedora 42": "Fedora_42",
  "Fedora 43": "Fedora_43",
  "AlmaLinux 9": "AlmaLinux_9",
  "AlmaLinux 10": "AlmaLinux_10",
  "RockyLinux 9": "RockyLinux_9",
  "RockyLinux 10": "RockyLinux_10",
  "OpenSUSE Tumbleweed": "OpenSUSE_Tumbleweed",
  "OpenSUSE Leap 15.6": "OpenSUSE_Leap_156",
  "ClefOS 7": "ClefOS_7",
  "IBM Validated RHEL 9": "IBM_Validated_RHEL_9",
  "IBM Validated SLES 15": "IBM_Validated_SLES_15",
  "IBM Validated Ubuntu 22.04": "IBM_Validated_Ubuntu_2204",
  "IBM Validated Ubuntu 24.04": "IBM_Validated_Ubuntu_2404"
};

function getSupportedDistros(req, res) {
  res.json(SUPPORTED_DISTROS);
}

function searchPackages(req, res) {
  let { search_term, exact_match, search_bit_flag, page_number } = req.query;

  search_bit_flag = parseInt(search_bit_flag) || 0;
  page_number = parseInt(page_number) || 0;
  const ITEMS_PER_PAGE = 100;
  const offset = page_number * ITEMS_PER_PAGE;
  exact_match = exact_match === 'true';

  // Determine selected tables
  const selectedTables = [];
  for (const [distroName, bitValue] of Object.entries(
    Object.values(SUPPORTED_DISTROS).reduce((acc, group) => ({ ...acc, ...group }), {})
  )) {
    if (bitValue & search_bit_flag) {
      const tableName = DISTRO_TABLE_MAP[distroName];
      if (tableName) selectedTables.push(tableName);
    }
  }

  if (selectedTables.length === 0) {
    return res.json({ packages: [], total_packages: 0, page: page_number });
  }

  // Build search pattern
  let pattern = search_term || '';
  pattern = pattern.replace(/\*/g, '%');
  if (!exact_match) {
    pattern = '%' + pattern + '%';
  }

  // Build UNION query
  const unionParts = selectedTables.map(
    table => `SELECT packageName, description, version, osName FROM "${table}" WHERE packageName ${exact_match ? '=' : 'LIKE'} ?`
  );
  const unionSQL = unionParts.join(' UNION ALL ');

  const params = selectedTables.map(() => pattern).flat();

  try {
    const countSQL = `SELECT COUNT(*) as total FROM (${unionSQL})`;
    const totalRow = db.prepare(countSQL).get(...params);
    const total = totalRow ? totalRow.total : 0;

    const dataSQL = `${unionSQL} LIMIT ? OFFSET ?`;
    const rows = db.prepare(dataSQL).all(...params, ITEMS_PER_PAGE, offset);

    const packages = rows.map(r => [r.packageName, r.description, r.version, r.osName]);

    res.json({ packages, total_packages: total, page: page_number });
  } catch (err) {
    console.error('Search error:', err.message);
    res.status(500).json({ error: 'Database query failed', details: err.message });
  }
}

module.exports = { getSupportedDistros, searchPackages };
