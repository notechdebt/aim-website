// Shared data for the service pages in this folder.
export default {
  layout: "layouts/service.njk",
  permalink: "/{{ page.fileSlug }}/",
  eleventyComputed: {
    breadcrumbs: (data) => [
      { name: "Home", url: "/" },
      { name: data.service.name, url: `/${data.page.fileSlug}/` },
    ],
  },
};
