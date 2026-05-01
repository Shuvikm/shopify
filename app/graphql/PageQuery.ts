export const PAGE_QUERY = `#graphql
  query Page($handle: String!, $language: LanguageCode, $country: CountryCode)
  @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      id
      title
      handle
      contentHtml
      seo {
        description
        title
      }
    }
  }
` as const;
