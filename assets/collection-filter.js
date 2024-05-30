class GraphqlService {
  static async makeGraphQLQuery(query, variables) {
    const graphQLQuery = {
      query,
      variables,
    };
  
    const res = await fetch("/api/2024-04/graphql.json", {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": "26cd0a6dd720b9db432f0596daccef73",
      },
      method: "POST",
      body: JSON.stringify(graphQLQuery),
    });
  
    if (!res.ok) {
      console.error(
        `Failed to fetch data: ${res.status} ${res.statusText}\n\nQuery: ${query}`
      );
    }
  
    return await res.json();
  };
  
  static async filterProducts(handle, filters) {
    const variables = {
      handle,
      filters
    }
    
    return await GraphqlService.makeGraphQLQuery(
      `#graphql
      query MultipleVariantOptionsWithInStock($handle: String!, $filters: [ProductFilter!]) {
        collection(handle: $handle) {
          handle
          products(first: 10, filters: $filters) {
            edges {
              node {
                id
                handle
                vendor
                title
                images(first: 10) {
                  edges {
                    node {
                      url
                    }
                  }
                }
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                  maxVariantPrice {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
      `,
      variables
    );
  }
}