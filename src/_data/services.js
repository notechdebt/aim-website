// The four service areas. Drives the homepage service list, the footer,
// cross-links between service pages and the OfferCatalog structured data.
export default [
  {
    group: "Tax",
    title: "Tax preparation",
    url: "/tax-preparation/",
    blurb: "Personal, self-employed, business and nonprofit returns, tax planning and sales tax.",
    more: "Tax preparation &amp; planning",
    items: [
      { name: "Tax preparation", desc: "Individual, business and nonprofit returns, with accurate, hassle-free IRS filing." },
      { name: "Tax planning &amp; consulting", desc: "Plan ahead and make informed decisions all year." },
      { name: "Sales tax", desc: "Compliance with sales tax regulations and filing requirements." },
    ],
  },
  {
    group: "Business",
    title: "Business formation",
    url: "/business-formation/",
    blurb: "LLCs, corporations and nonprofits, with your EIN, state filings and licenses.",
    more: "Starting an LLC, corporation or nonprofit",
    items: [
      { name: "Business formation", desc: "New business filing for LLCs, corporations and nonprofits." },
      { name: "EIN &amp; corporate filing", desc: "Your Employer Identification Number and corporate documents for the state." },
      { name: "Licenses &amp; compliance", desc: "Stay licensed and in line with tax laws and regulations." },
      { name: "Grant support", desc: "For nonprofits and small businesses." },
    ],
  },
  {
    group: "Accounting",
    title: "Bookkeeping &amp; payroll",
    url: "/bookkeeping-payroll/",
    blurb: "Monthly books, payroll and the financial reports that keep you on track.",
    more: "Bookkeeping, payroll &amp; reporting",
    items: [
      { name: "Bookkeeping &amp; accounting", desc: "Streamlined bookkeeping and financial management." },
      { name: "Payroll", desc: "Employee wages, taxes and deductions, handled efficiently." },
      { name: "Financial reporting &amp; advisory", desc: "Clear numbers for better decisions." },
      { name: "Financial planning", desc: "Tailored strategies to meet your goals." },
    ],
  },
  {
    group: "Notary",
    title: "Notary &amp; apostille",
    url: "/notary-apostille/",
    blurb: "Notarization, power of attorney and help with apostilles for documents going abroad.",
    more: "Notary public &amp; apostille",
    items: [
      { name: "Notary services", desc: "Document notarization and certification, power of attorney and apostille." },
    ],
  },
];
