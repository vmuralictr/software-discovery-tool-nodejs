const faqData = [
  {
    question: "What does the Software Discovery Tool do?",
    answer: "The Software Discovery Tool allows you to search for open-source packages available on IBM Z (s390x) Linux distributions. You can search across multiple distributions simultaneously and compare package availability."
  },
  {
    question: "Which distributions are supported?",
    answer: "The tool supports Ubuntu (22.04, 24.04), Debian (Bookworm, Trixie), Fedora (42, 43), AlmaLinux (9, 10), RockyLinux (9, 10), OpenSUSE (Tumbleweed, Leap 15.6), ClefOS 7, and IBM Validated distributions (RHEL 9, SLES 15, Ubuntu 22.04, Ubuntu 24.04)."
  },
  {
    question: "How do I search for packages?",
    answer: "Type the package name in the search box and select one or more distributions from the checkboxes below. Click 'Search' to perform a wildcard search or 'Exact' for an exact package name match. Press Enter to trigger a wildcard search."
  },
  {
    question: "How do wildcards work?",
    answer: "Use the asterisk (*) character as a wildcard in your search. For example, 'python*' will match 'python3', 'python3-pip', 'python-dev', etc. The Search button automatically wraps your term with wildcards, while Exact requires the full package name."
  },
  {
    question: "What is the difference between Search and Search Exact?",
    answer: "'Search' performs a wildcard/partial match — your search term is wrapped with % on both sides (like SQL LIKE '%term%'). 'Exact' requires the package name to exactly match what you type."
  },
  {
    question: "How do I filter results after searching?",
    answer: "After results appear, use the 'Refine by package name/version' input to further filter the displayed results by name or version. Use the distribution dropdown to narrow results to a specific OS. These filters work on the client side without a new API call."
  },
  {
    question: "Can I search across multiple distributions at once?",
    answer: "Yes! Select multiple distributions using the checkboxes or click 'Select All' to search all at once. Results from all selected distributions are combined and shown together."
  },
  {
    question: "How do I hide package descriptions?",
    answer: "Uncheck the 'Show Descriptions' checkbox to hide the description text from result cards. This gives a more compact view of results."
  }
];

export default faqData;
