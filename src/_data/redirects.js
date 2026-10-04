// URLs from earlier versions of the site (WordPress 2025, 2012 and 2015 sites)
// that Google may still have indexed. Each gets a stub page that forwards
// to the matching section or page.
export default [
  { from: "/about/", to: "/#about" },
  { from: "/about-us/", to: "/#about" },
  { from: "/about-us/our-team/", to: "/#about" },
  { from: "/services/", to: "/#services" },
  { from: "/prices/", to: "/#services" },
  { from: "/index.php/about-us/", to: "/#about" },
  { from: "/index.php/services/", to: "/#services" },
  { from: "/testimonials/", to: "/#testimonials" },
  { from: "/faq/", to: "/#faq" },
  { from: "/contact/", to: "/#contact" },
  { from: "/contact-us/", to: "/#contact" },
  { from: "/where-to-find-us/", to: "/#contact" },
  { from: "/index.php/contact-us-2/", to: "/#contact" },
];
