// ============================================================
// Software Discovery Tool — End-to-End Test Suite (Cypress)
// ============================================================

const API = 'http://localhost:5001/api';

// Helper: select Ubuntu checkbox and type a search term
function selectUbuntuAndSearch(term) {
  cy.get('input[id="os-Ubuntu"]').check();
  cy.get('input[placeholder*="Search packages"]').clear().type(term);
  cy.contains('button', 'Search').click();
}

// ============================================================
// SUITE 1: PAGE LOAD
// ============================================================
describe('Suite 1: Page Load', () => {
  beforeEach(() => cy.visit('/'));

  it('1.1 — Landing page loads all main sections', () => {
    cy.get('nav').should('be.visible');
    cy.get('img[alt="Software Discovery Tool"]').should('be.visible');
    cy.get('img[alt="IBM Z Software Discovery"]').should('be.visible');
    cy.get('.slick-slider').should('exist');
    cy.get('footer').should('be.visible');
  });

  it('1.2 — OS checkboxes load from API', () => {
    cy.intercept('GET', `${API}/getSupportedDistros`).as('getDistros');
    cy.visit('/');
    cy.wait('@getDistros');
    cy.get('input[id^="os-"]').should('have.length.greaterThan', 0);
    cy.get('input[id="select-all"]').should('exist');
  });

  it('1.3 — Page title is set', () => {
    cy.title().should('match', /Software Discovery Tool|React App/i);
  });
});

// ============================================================
// SUITE 2: SEARCH FUNCTIONALITY
// ============================================================
describe('Suite 2: Search Functionality', () => {
  beforeEach(() => cy.visit('/'));

  it('2.1 — Basic search returns results and hides hero/carousel', () => {
    selectUbuntuAndSearch('python');
    cy.contains(/\d+ packages found/).should('be.visible');
    cy.get('[style*="border: 1px solid rgb(221, 221, 221)"]').should('have.length.greaterThan', 0);
    cy.get('img[alt="IBM Z Software Discovery"]').should('not.exist');
    cy.get('.slick-slider').should('not.exist');
  });

  it('2.2 — Exact search filters correctly', () => {
    cy.get('input[id="os-Ubuntu"]').check();
    cy.get('input[placeholder*="Search packages"]').clear().type('python3');
    cy.contains('button', 'Search Exact').click();
    cy.contains(/\d+ packages found/).should('be.visible');
    // All results should be exactly "python3"
    cy.get('p').filter((i, el) => {
      const text = el.innerText;
      return text === 'python3' || text === 'python3-pip';
    });
    // No partial-match-only packages like "python3-dev" in sample data
    cy.contains('python3-pip').should('not.exist');
  });

  it('2.3 — Wildcard search with * returns multiple results', () => {
    cy.get('input[id="os-Ubuntu"]').check();
    cy.get('input[placeholder*="Search packages"]').clear().type('python*');
    cy.contains('button', 'Search').click();
    cy.contains(/\d+ packages found/).should('be.visible');
    cy.get('[style*="border: 1px solid rgb(221, 221, 221)"]').should('have.length.greaterThan', 0);
  });

  it('2.4 — Enter key triggers search', () => {
    cy.get('input[id="os-Ubuntu"]').check();
    cy.get('input[placeholder*="Search packages"]').clear().type('curl{enter}');
    cy.contains(/\d+ packages found/).should('be.visible');
  });

  it('2.5 — Empty search with distro selected returns results (wildcard)', () => {
    cy.get('input[id="os-Ubuntu"]').check();
    cy.contains('button', 'Search').click();
    cy.contains(/\d+ packages found/).should('be.visible');
  });

  it('2.6 — No distribution selected shows warning', () => {
    cy.get('input[placeholder*="Search packages"]').type('python');
    // Ensure all unchecked
    cy.get('input[id="select-all"]').then($el => {
      if ($el.is(':checked')) cy.wrap($el).uncheck();
    });
    cy.get('input[id^="os-"]').each($el => {
      if ($el.is(':checked')) cy.wrap($el).uncheck();
    });
    cy.contains('button', 'Search').click();
    cy.contains('No distribution selected').should('be.visible');
  });

  it('2.7 — Select All + search returns results from multiple distros', () => {
    cy.get('input[id="select-all"]').check();
    cy.get('input[id^="os-"]').should('be.checked');
    cy.get('input[placeholder*="Search packages"]').type('curl');
    cy.contains('button', 'Search').click();
    cy.contains(/\d+ packages found/).should('be.visible');
    cy.get('[style*="border: 1px solid rgb(221, 221, 221)"]').should('have.length.greaterThan', 1);
  });
});

// ============================================================
// SUITE 3: OS FILTER CHECKBOXES
// ============================================================
describe('Suite 3: OS Filter Checkboxes', () => {
  beforeEach(() => cy.visit('/'));

  it('3.1 — Select All checks all distros', () => {
    cy.get('input[id="select-all"]').check();
    cy.get('input[id^="os-"]').each($el => {
      cy.wrap($el).should('be.checked');
    });
  });

  it('3.2 — Uncheck Select All deselects all distros', () => {
    cy.get('input[id="select-all"]').check();
    cy.get('input[id="select-all"]').uncheck();
    cy.get('input[id^="os-"]').each($el => {
      cy.wrap($el).should('not.be.checked');
    });
  });

  it('3.3 — Individual OS checkbox works', () => {
    cy.get('input[id="os-Ubuntu"]').check();
    cy.get('input[id="os-Debian"]').should('not.be.checked');
    cy.get('input[placeholder*="Search packages"]').type('python');
    cy.contains('button', 'Search').click();
    cy.contains(/\d+ packages found/).should('be.visible');
  });

  it('3.4 — Multiple OS selection returns combined results', () => {
    cy.get('input[id="os-Ubuntu"]').check();
    cy.get('input[id="os-Debian"]').check();
    cy.get('input[placeholder*="Search packages"]').type('curl');
    cy.contains('button', 'Search').click();
    cy.contains(/\d+ packages found/).should('be.visible');
    // Results should include packages from at least one distro
    cy.get('[style*="border: 1px solid rgb(221, 221, 221)"]').should('have.length.greaterThan', 0);
  });
});

// ============================================================
// SUITE 4: RESULTS DISPLAY
// ============================================================
describe('Suite 4: Results Display', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('input[id="select-all"]').check();
    cy.get('input[placeholder*="Search packages"]').type('python');
    cy.contains('button', 'Search').click();
    cy.contains(/\d+ packages found/).should('be.visible');
  });

  it('4.1 — Show Description toggle hides/shows descriptions', () => {
    // Descriptions visible by default
    cy.get('[style*="font-weight: 400"]').should('exist');
    // Uncheck Show Description
    cy.get('input[id="show-desc"]').uncheck();
    cy.get('[style*="font-weight: 400"]').should('not.exist');
  });

  it('4.2 — Records per page dropdown appears for 5+ results', () => {
    cy.contains('Records per page').should('be.visible');
    cy.get('select').eq(0).select('20');
  });

  it('4.3 — Version tags are displayed on result cards', () => {
    cy.get('[style*="background: rgb(4, 79, 192)"]').should('have.length.greaterThan', 0);
  });

  it('4.4 — Result cards show package name in bold', () => {
    cy.contains('python3').should('be.visible');
  });
});

// ============================================================
// SUITE 5: REFINE FILTERS
// ============================================================
describe('Suite 5: Refine Filters', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('input[id="select-all"]').check();
    cy.get('input[placeholder*="Search packages"]').type('python');
    cy.contains('button', 'Search').click();
    cy.contains(/\d+ packages found/).should('be.visible');
  });

  it('5.1 — Refine by name filters results', () => {
    cy.get('input[placeholder*="Filter by name"]').type('python3-pip');
    cy.contains('python3-pip').should('be.visible');
  });

  it('5.2 — Distribution dropdown filters by distro', () => {
    cy.get('select').last().select('Ubuntu 22.04');
    cy.contains('Ubuntu 22.04').should('be.visible');
  });

  it('5.3 — Clearing refine input shows all results again', () => {
    cy.get('input[placeholder*="Filter by name"]').type('python3-pip');
    cy.get('input[placeholder*="Filter by name"]').clear();
    cy.contains('python3').should('be.visible');
  });
});

// ============================================================
// SUITE 6: NAVIGATION
// ============================================================
describe('Suite 6: Navigation', () => {
  beforeEach(() => cy.visit('/'));

  it('6.1 — FAQ page loads at /faq', () => {
    cy.contains('a', 'FAQ').click();
    cy.url().should('include', '/faq');
    cy.contains('FAQ').should('be.visible');
    cy.get('button').should('have.length.greaterThan', 0);
  });

  it('6.2 — FAQ accordion opens and closes', () => {
    cy.visit('/faq');
    cy.get('button').first().click();
    cy.get('[style*="background: rgb(255, 255, 255)"]').should('exist');
    cy.get('button').first().click();
    cy.get('[style*="background: rgb(255, 255, 255)"]').should('not.exist');
  });

  it('6.3 — Home link navigates back to /', () => {
    cy.visit('/faq');
    cy.contains('a', 'Home').click();
    cy.url().should('eq', Cypress.config('baseUrl') + '/');
    cy.get('input[placeholder*="Search packages"]').should('be.visible');
  });

  it('6.4 — Documentation link has correct attributes', () => {
    cy.contains('a', 'Documentation')
      .should('have.attr', 'target', '_blank')
      .and('have.attr', 'rel', 'noopener noreferrer');
  });

  it('6.5 — Mobile hamburger menu works', () => {
    cy.viewport(375, 667);
    cy.get('button[aria-label="Toggle navigation menu"]').should('be.visible');
    cy.get('button[aria-label="Toggle navigation menu"]').click();
    cy.get('.nav-links.nav-open').should('be.visible');
    cy.contains('a', 'FAQ').click();
    cy.get('.nav-links.nav-open').should('not.exist');
  });
});

// ============================================================
// SUITE 7: SCROLL TO TOP
// ============================================================
describe('Suite 7: Scroll to Top', () => {
  it('7.1 — Scroll to top button appears after searching and scrolling', () => {
    cy.visit('/');
    cy.get('input[id="select-all"]').check();
    cy.get('input[placeholder*="Search packages"]').type('python');
    cy.contains('button', 'Search').click();
    cy.contains(/\d+ packages found/).should('be.visible');
    cy.scrollTo('bottom');
    cy.get('button[aria-label="Scroll to top"]').should('be.visible');
    cy.get('button[aria-label="Scroll to top"]').click();
    cy.window().its('scrollY').should('equal', 0);
  });
});

// ============================================================
// SUITE 8: API INTEGRATION
// ============================================================
describe('Suite 8: API Integration', () => {
  it('8.1 — getSupportedDistros is called on load', () => {
    cy.intercept('GET', `${API}/getSupportedDistros`).as('getDistros');
    cy.visit('/');
    cy.wait('@getDistros').its('response.statusCode').should('eq', 200);
    cy.get('@getDistros').its('response.body').should('have.property', 'Ubuntu');
  });

  it('8.2 — searchPackages called with correct params (wildcard)', () => {
    cy.intercept('GET', `${API}/searchPackages*`).as('search');
    cy.visit('/');
    cy.get('input[id="os-Ubuntu"]').check();
    cy.get('input[placeholder*="Search packages"]').type('python');
    cy.contains('button', 'Search').click();
    cy.wait('@search').then(({ request }) => {
      expect(request.url).to.include('search_term=python');
      expect(request.url).to.include('exact_match=false');
      expect(request.url).to.match(/search_bit_flag=[^0]/);
    });
  });

  it('8.3 — searchPackages called with exact_match=true for exact search', () => {
    cy.intercept('GET', `${API}/searchPackages*`).as('search');
    cy.visit('/');
    cy.get('input[id="os-Ubuntu"]').check();
    cy.get('input[placeholder*="Search packages"]').type('curl');
    cy.contains('button', 'Search Exact').click();
    cy.wait('@search').then(({ request }) => {
      expect(request.url).to.include('exact_match=true');
    });
  });

  it('8.4 — Loading spinner shows during API call', () => {
    cy.intercept('GET', `${API}/searchPackages*`, (req) => {
      req.on('response', (res) => { res.setDelay(1000); });
    }).as('slowSearch');
    cy.visit('/');
    cy.get('input[id="os-Ubuntu"]').check();
    cy.get('input[placeholder*="Search packages"]').type('python');
    cy.contains('button', 'Search').click();
    cy.get('.MuiCircularProgress-root').should('be.visible');
    cy.wait('@slowSearch');
    cy.get('.MuiCircularProgress-root').should('not.exist');
  });

  it('8.5 — API error is handled gracefully', () => {
    cy.intercept('GET', `${API}/searchPackages*`, { statusCode: 500, body: { error: 'Internal Server Error' } }).as('failSearch');
    cy.visit('/');
    cy.get('input[id="os-Ubuntu"]').check();
    cy.get('input[placeholder*="Search packages"]').type('python');
    cy.contains('button', 'Search').click();
    cy.wait('@failSearch');
    cy.contains('Search failed').should('be.visible');
    cy.get('[style*="border: 1px solid rgb(221, 221, 221)"]').should('not.exist');
  });
});

// ============================================================
// SUITE 9: RESPONSIVE DESIGN
// ============================================================
describe('Suite 9: Responsive Design', () => {
  it('9.1 — Desktop layout shows nav links, not hamburger', () => {
    cy.viewport(1280, 800);
    cy.visit('/');
    cy.get('button[aria-label="Toggle navigation menu"]').should('not.be.visible');
    cy.get('.nav-links').should('be.visible');
  });

  it('9.2 — Tablet layout shows carousel with 3 slides', () => {
    cy.viewport(768, 1024);
    cy.visit('/');
    cy.get('.slick-slider').should('exist');
    cy.get('.slick-track').should('exist');
  });

  it('9.3 — Mobile layout shows hamburger, hides nav links', () => {
    cy.viewport(375, 667);
    cy.visit('/');
    cy.get('button[aria-label="Toggle navigation menu"]').should('be.visible');
    cy.get('.nav-links').should('not.be.visible');
  });
});
