// Builds the JSON-LD graph for a page from its data cascade.

const text = (html) =>
  String(html)
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&rsquo;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

function business(site, services) {
  const id = `${site.url}/#business`;
  const node = {
    "@type": "AccountingService",
    "@id": id,
    name: site.name,
    url: `${site.url}/`,
    logo: `${site.url}/images/icon-512.png`,
    image: [`${site.url}${site.ogImage}`, `${site.url}${site.portrait}`],
    description:
      "Accounting, IRS tax preparation, payroll, business formation and notary services for individuals and businesses in Astoria, Queens.",
    telephone: site.phoneSchema,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.streetSchema,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.zip,
      addressCountry: "US",
    },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    hasMap: site.mapsUrl,
    areaServed: [
      ...site.areas.map((a) => ({ "@type": "Place", name: `${a}, Queens, NY` })),
      { "@type": "City", name: "New York" },
    ],
    employee: { "@id": `${site.url}/#anila` },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Accounting, tax and notary services",
      itemListElement: services.map((s) => ({
        "@type": "OfferCatalog",
        name: s.group,
        url: `${site.url}${s.url}`,
        itemListElement: s.items.map((i) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: text(i.name), description: text(i.desc), url: `${site.url}${s.url}` },
        })),
      })),
    },
  };
  if (site.hours.length) {
    node.openingHoursSpecification = site.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    }));
  }
  if (site.sameAs.length) node.sameAs = site.sameAs;
  return node;
}

export function buildGraph(data) {
  const { site, services, page, title, description, faq, service, breadcrumbs } = data;
  const pageUrl = `${site.url}${page.url}`;
  const graph = [
    business(site, services),
    {
      "@type": "Person",
      "@id": `${site.url}/#anila`,
      name: "Anila Gjika",
      jobTitle: "Accountant",
      image: `${site.url}${site.portrait}`,
      worksFor: { "@id": `${site.url}/#business` },
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: `${site.url}/`,
      name: site.name,
      inLanguage: "en-US",
      publisher: { "@id": `${site.url}/#business` },
    },
    {
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: text(title),
      description: text(description),
      isPartOf: { "@id": `${site.url}/#website` },
      about: { "@id": service ? `${pageUrl}#service` : `${site.url}/#business` },
      primaryImageOfPage: `${site.url}${site.ogImage}`,
      inLanguage: "en-US",
      ...(breadcrumbs ? { breadcrumb: { "@id": `${pageUrl}#breadcrumb` } } : {}),
    },
  ];

  if (service) {
    graph.push({
      "@type": "Service",
      "@id": `${pageUrl}#service`,
      name: text(service.name),
      serviceType: service.types.map(text),
      description: text(description),
      url: pageUrl,
      provider: { "@id": `${site.url}/#business` },
      areaServed: site.areas.map((a) => ({ "@type": "Place", name: `${a}, Queens, NY` })),
    });
  }

  if (breadcrumbs) {
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${pageUrl}#breadcrumb`,
      itemListElement: breadcrumbs.map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: text(b.name),
        item: `${site.url}${b.url}`,
      })),
    });
  }

  if (faq?.length) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      mainEntity: faq.map((f) => ({
        "@type": "Question",
        name: text(f.q),
        acceptedAnswer: { "@type": "Answer", text: text(f.a) },
      })),
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}
