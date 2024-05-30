class FacetFiltersForm extends HTMLElement {
  constructor() {
    super();
    this.onActiveFilterClick = this.onActiveFilterClick.bind(this);
    this.collectionHandle = this.dataset.collectionHandle;
    this.debouncedOnSubmit = debounce((event) => {
      this.onSubmitHandler(event);
    }, 800);

    const facetForm = this.querySelector('form');
    facetForm.addEventListener('input', this.debouncedOnSubmit.bind(this));

    const facetWrapper = this.querySelector('#FacetsWrapperDesktop');
    if (facetWrapper) facetWrapper.addEventListener('keyup', onKeyUpEscape);
  }

  static setListeners() {
    const onHistoryChange = (event) => {
      const searchParams = event.state ? event.state.searchParams : FacetFiltersForm.searchParamsInitial;
      if (searchParams === FacetFiltersForm.searchParamsPrev) return;
      FacetFiltersForm.renderPage(searchParams, null, false);
    };
    window.addEventListener('popstate', onHistoryChange);
  }

  static toggleActiveFacets(disable = true) {
    document.querySelectorAll('.js-facet-remove').forEach((element) => {
      element.classList.toggle('disabled', disable);
    });
  }

  static renderPage(searchParams, event, updateURLHash = true, data = null) {
    FacetFiltersForm.searchParamsPrev = searchParams;
    const sections = FacetFiltersForm.getSections();
    const countContainer = document.getElementById('ProductCount');
    const countContainerDesktop = document.getElementById('ProductCountDesktop');
    const loadingSpinners = document.querySelectorAll(
      '.facets-container .loading__spinner, facet-filters-form .loading__spinner'
    );
    loadingSpinners.forEach((spinner) => spinner.classList.remove('hidden'));
    document.getElementById('ProductGridContainer').querySelector('.collection').classList.add('loading');
    if (countContainer) {
      countContainer.classList.add('loading');
    }
    if (countContainerDesktop) {
      countContainerDesktop.classList.add('loading');
    }

    sections.forEach((section) => {
      const url = `${window.location.pathname}?section_id=${section.section}&${searchParams}`;
      const filterDataUrl = (element) => element.url === url;

      // FacetFiltersForm.filterData.some(filterDataUrl)
      //   ? FacetFiltersForm.renderSectionFromCache(filterDataUrl, event)
        // : FacetFiltersForm.renderSectionFromFetch(url, event, data);
        FacetFiltersForm.renderSectionFromFetch(url, event, data);
    });

    if (updateURLHash) FacetFiltersForm.updateURLHash(searchParams);
  }

  static renderSectionFromFetch(url, event, data = null) {
    fetch(url)
      .then((response) => response.text())
      .then((responseText) => {
        const html = responseText;
        FacetFiltersForm.filterData = [...FacetFiltersForm.filterData, { html, url }];
        FacetFiltersForm.renderFilters(html, event);
        // FacetFiltersForm.renderProductGridContainer(html);
        FacetFiltersForm.renderProductGridContainerByData(data);
        FacetFiltersForm.renderProductCount(html);
        if (typeof initializeScrollAnimationTrigger === 'function') initializeScrollAnimationTrigger(html.innerHTML);
      });
  }

  static renderSectionFromCache(filterDataUrl, event) {
    const html = FacetFiltersForm.filterData.find(filterDataUrl).html;
    FacetFiltersForm.renderFilters(html, event);
    FacetFiltersForm.renderProductGridContainer(html);
    FacetFiltersForm.renderProductCount(html);
    if (typeof initializeScrollAnimationTrigger === 'function') initializeScrollAnimationTrigger(html.innerHTML);
  }

  static renderProductGridContainer(html) {
    document.getElementById('ProductGridContainer').innerHTML = new DOMParser()
      .parseFromString(html, 'text/html')
      .getElementById('ProductGridContainer').innerHTML;

    document
      .getElementById('ProductGridContainer')
      .querySelectorAll('.scroll-trigger')
      .forEach((element) => {
        element.classList.add('scroll-trigger--cancel');
      });
  }
  static renderProductGridContainerByData(data) {
    const products = data?.data?.collection?.products.edges;

    if (products) {
      let html = products.reduce((__html, product, index) => {
        const __product = product?.node;
        __html += `<li class="grid__item scroll-trigger animate--slide-in" data-cascade="" style="--animation-order: ${index};">
        <link href="//c24fd5-80.myshopify.com/cdn/shop/t/2/assets/component-rating.css?v=179577762467860590411716911855" rel="stylesheet" type="text/css" media="all">
        <link href="//c24fd5-80.myshopify.com/cdn/shop/t/2/assets/component-volume-pricing.css?v=56284703641257077881716911859" rel="stylesheet" type="text/css" media="all">

        <link href="//c24fd5-80.myshopify.com/cdn/shop/t/2/assets/component-price.css?v=70172745017360139101716911853" rel="stylesheet" type="text/css" media="all">
        <link href="//c24fd5-80.myshopify.com/cdn/shop/t/2/assets/quick-order-list.css?v=15443151378892718751716911876" rel="stylesheet" type="text/css" media="all">
        <link href="//c24fd5-80.myshopify.com/cdn/shop/t/2/assets/quantity-popover.css?v=78745769908715669131716911873" rel="stylesheet" type="text/css" media="all">
        <div class="card-wrapper product-card-wrapper underline-links-hover">
            <div class="
                card card--standard
                card--media
                
                
                
                
                
              " style="--ratio-percent: 80.4201680672269%;">
              <div class="card__inner color-scheme-2 gradient ratio" style="--ratio-percent: 80.4201680672269%;"><div class="card__media">
                    <div class="media media--transparent media--hover-effect">
                      
                      <img srcset="${__product.images?.edges[0]?.node?.url}&amp;width=165 165w,${__product.images?.edges[0]?.node?.url}&amp;width=360 360w,${__product.images?.edges[0]?.node?.url}&amp;width=533 533w,${__product.images?.edges[0]?.node?.url}&amp;width=720 720w,${__product.images?.edges[0]?.node?.url}&amp;width=940 940w,${__product.images?.edges[0]?.node?.url}&amp;width=1066 1066w,${__product.images?.edges[0]?.node?.url} 4760w
                        " src="${__product.images?.edges[0]?.node?.url}&amp;width=533" sizes="(min-width: 1200px) 267px, (min-width: 990px) calc((100vw - 130px) / 4), (min-width: 750px) calc((100vw - 120px) / 3), calc((100vw - 35px) / 2)" alt="Blood Red Over Halfmoon Tail Betta Fish" class="motion-reduce" width="4760" height="3828">
                      
        </div>
                  </div><div class="card__content">
                  <div class="card__information">
                    <h3 class="card__heading">
                      <a href="/products/${__product.handle}" id="StandardCardNoMediaLink-template--16958625349814__product-grid-7965341679798" class="full-unstyled-link" aria-labelledby="StandardCardNoMediaLink-template--16958625349814__product-grid-7965341679798 NoMediaStandardBadge-template--16958625349814__product-grid-7965341679798">
                        ${__product.title}
                      </a>
                    </h3>
                  </div>
                  <div class="card__badge bottom left"></div>
                </div>
              </div>
              <div class="card__content">
                <div class="card__information">
                  <h3 class="card__heading h5" id="title-template--16958625349814__product-grid-7965341679798">
                    <a href="/products/blood-red-over-halfmoon-tail-betta-fish" id="CardLink-template--16958625349814__product-grid-7965341679798" class="full-unstyled-link" aria-labelledby="CardLink-template--16958625349814__product-grid-7965341679798 Badge-template--16958625349814__product-grid-7965341679798">
                      ${__product.title}
                    </a>
                  </h3>
                  <div class="card-information"><span class="caption-large light"></span>
        <div class="
            price ">
          <div class="price__container"><div class="price__regular"><span class="visually-hidden visually-hidden--inline">Regular price</span>
                <span class="price-item price-item--regular">
                  ${__product.priceRange?.minVariantPrice?.amount !== __product.priceRange?.maxVariantPrice?.amount ? "From" : ""}${__product.priceRange?.minVariantPrice?.amount} ${__product.priceRange?.minVariantPrice?.currencyCode}
                </span></div>
            <div class="price__sale">
                <span class="visually-hidden visually-hidden--inline">Regular price</span>
                <span>
                  <s class="price-item price-item--regular">
                    
                      
                    
                  </s>
                </span><span class="visually-hidden visually-hidden--inline">Sale price</span>
              <span class="price-item price-item--sale price-item--last">
              ${__product.priceRange?.minVariantPrice?.amount !== __product.priceRange?.maxVariantPrice?.amount ? "From" : ""} ${__product.priceRange?.minVariantPrice?.amount} ${__product.priceRange?.minVariantPrice?.currencyCode}
              </span>
            </div>
            <small class="unit-price caption hidden">
              <span class="visually-hidden">Unit price</span>
              <span class="price-item price-item--last">
                <span></span>
                <span aria-hidden="true">/</span>
                <span class="visually-hidden">&nbsp;per&nbsp;</span>
                <span>
                </span>
              </span>
            </small>
          </div></div>

        </div>
                </div>
                
                <div class="card__badge bottom left"></div>
              </div>
            </div>
          </div>
        </li>`
        return __html;
      }, '');

      document.getElementById('product-grid').innerHTML = html;

      document.getElementById('ProductGridContainer').querySelector('.collection').classList.remove('loading');
      document
      .getElementById('ProductGridContainer')
      .querySelectorAll('.scroll-trigger')
      .forEach((element) => {
        element.classList.add('scroll-trigger--cancel');
      });
    }
     
  }
  static renderProductCount(html) {
    const count = new DOMParser().parseFromString(html, 'text/html').getElementById('ProductCount').innerHTML;
    const container = document.getElementById('ProductCount');
    const containerDesktop = document.getElementById('ProductCountDesktop');
    container.innerHTML = count;
    container.classList.remove('loading');
    if (containerDesktop) {
      containerDesktop.innerHTML = count;
      containerDesktop.classList.remove('loading');
    }
    const loadingSpinners = document.querySelectorAll(
      '.facets-container .loading__spinner, facet-filters-form .loading__spinner'
    );
    loadingSpinners.forEach((spinner) => spinner.classList.add('hidden'));
  }

  static renderFilters(html, event) {
    const parsedHTML = new DOMParser().parseFromString(html, 'text/html');
    const facetDetailsElementsFromFetch = parsedHTML.querySelectorAll(
      '#FacetFiltersForm .js-filter, #FacetFiltersFormMobile .js-filter, #FacetFiltersPillsForm .js-filter'
    );
    const facetDetailsElementsFromDom = document.querySelectorAll(
      '#FacetFiltersForm .js-filter, #FacetFiltersFormMobile .js-filter, #FacetFiltersPillsForm .js-filter'
    );

    // Remove facets that are no longer returned from the server
    Array.from(facetDetailsElementsFromDom).forEach((currentElement) => {
      if (!Array.from(facetDetailsElementsFromFetch).some(({ id }) => currentElement.id === id)) {
        currentElement.remove();
      }
    });

    const matchesId = (element) => {
      const jsFilter = event ? event.target.closest('.js-filter') : undefined;
      return jsFilter ? element.id === jsFilter.id : false;
    };

    const facetsToRender = Array.from(facetDetailsElementsFromFetch).filter((element) => !matchesId(element));
    const countsToRender = Array.from(facetDetailsElementsFromFetch).find(matchesId);

    facetsToRender.forEach((elementToRender, index) => {
      const currentElement = document.getElementById(elementToRender.id);
      // Element already rendered in the DOM so just update the innerHTML
      if (currentElement) {
        document.getElementById(elementToRender.id).innerHTML = elementToRender.innerHTML;
      } else {
        if (index > 0) {
          const { className: previousElementClassName, id: previousElementId } = facetsToRender[index - 1];
          // Same facet type (eg horizontal/vertical or drawer/mobile)
          if (elementToRender.className === previousElementClassName) {
            document.getElementById(previousElementId).after(elementToRender);
            return;
          }
        }

        if (elementToRender.parentElement) {
          document.querySelector(`#${elementToRender.parentElement.id} .js-filter`).before(elementToRender);
        }
      }
    });

    FacetFiltersForm.renderActiveFacets(parsedHTML);
    FacetFiltersForm.renderAdditionalElements(parsedHTML);

    if (countsToRender) {
      const closestJSFilterID = event.target.closest('.js-filter').id;

      if (closestJSFilterID) {
        FacetFiltersForm.renderCounts(countsToRender, event.target.closest('.js-filter'));
        FacetFiltersForm.renderMobileCounts(countsToRender, document.getElementById(closestJSFilterID));

        const newFacetDetailsElement = document.getElementById(closestJSFilterID);
        const newElementSelector = newFacetDetailsElement.classList.contains('mobile-facets__details')
          ? `.mobile-facets__close-button`
          : `.facets__summary`;
        const newElementToActivate = newFacetDetailsElement.querySelector(newElementSelector);

        const isTextInput = event.target.getAttribute('type') === 'text';

        if (newElementToActivate && !isTextInput) newElementToActivate.focus();
      }
    }
  }

  static renderActiveFacets(html) {
    const activeFacetElementSelectors = ['.active-facets-mobile', '.active-facets-desktop'];

    activeFacetElementSelectors.forEach((selector) => {
      const activeFacetsElement = html.querySelector(selector);
      if (!activeFacetsElement) return;
      document.querySelector(selector).innerHTML = activeFacetsElement.innerHTML;
    });

    FacetFiltersForm.toggleActiveFacets(false);
  }

  static renderAdditionalElements(html) {
    const mobileElementSelectors = ['.mobile-facets__open', '.mobile-facets__count', '.sorting'];

    mobileElementSelectors.forEach((selector) => {
      if (!html.querySelector(selector)) return;
      document.querySelector(selector).innerHTML = html.querySelector(selector).innerHTML;
    });

    document.getElementById('FacetFiltersFormMobile').closest('menu-drawer').bindEvents();
  }

  static renderCounts(source, target) {
    const targetSummary = target.querySelector('.facets__summary');
    const sourceSummary = source.querySelector('.facets__summary');

    if (sourceSummary && targetSummary) {
      targetSummary.outerHTML = sourceSummary.outerHTML;
    }

    const targetHeaderElement = target.querySelector('.facets__header');
    const sourceHeaderElement = source.querySelector('.facets__header');

    if (sourceHeaderElement && targetHeaderElement) {
      targetHeaderElement.outerHTML = sourceHeaderElement.outerHTML;
    }

    const targetWrapElement = target.querySelector('.facets-wrap');
    const sourceWrapElement = source.querySelector('.facets-wrap');

    if (sourceWrapElement && targetWrapElement) {
      const isShowingMore = Boolean(target.querySelector('show-more-button .label-show-more.hidden'));
      if (isShowingMore) {
        sourceWrapElement
          .querySelectorAll('.facets__item.hidden')
          .forEach((hiddenItem) => hiddenItem.classList.replace('hidden', 'show-more-item'));
      }

      targetWrapElement.outerHTML = sourceWrapElement.outerHTML;
    }
  }

  static renderMobileCounts(source, target) {
    const targetFacetsList = target.querySelector('.mobile-facets__list');
    const sourceFacetsList = source.querySelector('.mobile-facets__list');

    if (sourceFacetsList && targetFacetsList) {
      targetFacetsList.outerHTML = sourceFacetsList.outerHTML;
    }
  }

  static updateURLHash(searchParams) {
    history.pushState({ searchParams }, '', `${window.location.pathname}${searchParams && '?'.concat(searchParams)}`);
  }

  static getSections() {
    return [
      {
        section: document.getElementById('product-grid').dataset.id,
      },
    ];
  }

  createSearchParams(form) {
    const formData = new FormData(form);
    return new URLSearchParams(formData).toString();
  }

  // Function to parse the query string into an object
  parseQueryString(query) {
    const pairs = query.split('&');
    const result = {};

    pairs.forEach(function(pair) {
      const [key, value] = pair.split('=');
      if (value !== '') { // Only add keys with values
        // Handle nested properties
        const keys = key.split('.');
        keys.reduce(function(acc, k, index) {
          if (index === keys.length - 1) {
            acc[k] = decodeURIComponent(value);
          } else {
            acc[k] = acc[k] || {};
          }
          return acc[k];
        }, result);
      }
    });

    return result;
  }

  convertToFilterArray(query) {
    const params = new URLSearchParams(query);
    const filters = [];
  
    // Assuming 'filter.p.vendor' corresponds to 'productVendor'
    const vendors = params.getAll('filter.p.vendor');
    if (vendors) {
      const _vendors = vendors.map(vendor => ({ productVendor: vendor }));
      filters.push(..._vendors);
    }
  
    // Assuming 'filter.p.product_type' corresponds to 'productType'
    const types = params.getAll('filter.p.product_type');
    if (types) {
      const _types = types.map(type => ({ productType: type }));
      filters.push(..._types);
    }
  
    // Assuming 'filter.p.product_type' corresponds to 'productType'
    const themes = params.getAll('filter.p.m.custom.product-theme');

    if (themes) {
      const _themes = themes.map(theme => ({ productMetafield: {
        namespace: "custom",
        key: "product-theme",
        value: theme
      } }));
      filters.push(..._themes);
    }

    // Add more parameters as needed, following the pattern above
  
    return filters;
  }
  
  

  async onSubmitForm(searchParams, event) {
    // Convert the query string to the array of filter objects
    const filterArray = this.convertToFilterArray(searchParams);

    console.log(filterArray);
    const data = await GraphqlService.filterProducts(this.collectionHandle, filterArray);
    FacetFiltersForm.renderPage(searchParams, event, true, data);
  }

  onSubmitHandler(event) {
    event.preventDefault();
    const sortFilterForms = document.querySelectorAll('facet-filters-form form');
    if (event.srcElement.className == 'mobile-facets__checkbox') {
      const searchParams = this.createSearchParams(event.target.closest('form'));
      this.onSubmitForm(searchParams, event);
    } else {
      const forms = [];
      const isMobile = event.target.closest('form').id === 'FacetFiltersFormMobile';

      sortFilterForms.forEach((form) => {
        if (!isMobile) {
          if (form.id === 'FacetSortForm' || form.id === 'FacetFiltersForm' || form.id === 'FacetSortDrawerForm') {
            forms.push(this.createSearchParams(form));
          }
        } else if (form.id === 'FacetFiltersFormMobile') {
          forms.push(this.createSearchParams(form));
        }
      });
      this.onSubmitForm(forms.join('&'), event);
    }
  }

  onActiveFilterClick(event) {
    event.preventDefault();
    FacetFiltersForm.toggleActiveFacets();
    const url =
      event.currentTarget.href.indexOf('?') == -1
        ? ''
        : event.currentTarget.href.slice(event.currentTarget.href.indexOf('?') + 1);
    FacetFiltersForm.renderPage(url);
  }
}

FacetFiltersForm.filterData = [];
FacetFiltersForm.searchParamsInitial = window.location.search.slice(1);
FacetFiltersForm.searchParamsPrev = window.location.search.slice(1);
customElements.define('facet-filters-form', FacetFiltersForm);
FacetFiltersForm.setListeners();

class PriceRange extends HTMLElement {
  constructor() {
    super();
    this.querySelectorAll('input').forEach((element) => {
      element.addEventListener('change', this.onRangeChange.bind(this));
      element.addEventListener('keydown', this.onKeyDown.bind(this));
    });
    this.setMinAndMaxValues();
  }

  onRangeChange(event) {
    this.adjustToValidValues(event.currentTarget);
    this.setMinAndMaxValues();
  }

  onKeyDown(event) {
    if (event.metaKey) return;

    const pattern = /[0-9]|\.|,|'| |Tab|Backspace|Enter|ArrowUp|ArrowDown|ArrowLeft|ArrowRight|Delete|Escape/;
    if (!event.key.match(pattern)) event.preventDefault();
  }

  setMinAndMaxValues() {
    const inputs = this.querySelectorAll('input');
    const minInput = inputs[0];
    const maxInput = inputs[1];
    if (maxInput.value) minInput.setAttribute('data-max', maxInput.value);
    if (minInput.value) maxInput.setAttribute('data-min', minInput.value);
    if (minInput.value === '') maxInput.setAttribute('data-min', 0);
    if (maxInput.value === '') minInput.setAttribute('data-max', maxInput.getAttribute('data-max'));
  }

  adjustToValidValues(input) {
    const value = Number(input.value);
    const min = Number(input.getAttribute('data-min'));
    const max = Number(input.getAttribute('data-max'));

    if (value < min) input.value = min;
    if (value > max) input.value = max;
  }
}

customElements.define('price-range', PriceRange);

class FacetRemove extends HTMLElement {
  constructor() {
    super();
    const facetLink = this.querySelector('a');
    facetLink.setAttribute('role', 'button');
    facetLink.addEventListener('click', this.closeFilter.bind(this));
    facetLink.addEventListener('keyup', (event) => {
      event.preventDefault();
      if (event.code.toUpperCase() === 'SPACE') this.closeFilter(event);
    });
  }

  closeFilter(event) {
    event.preventDefault();
    const form = this.closest('facet-filters-form') || document.querySelector('facet-filters-form');
    form.onActiveFilterClick(event);
  }
}

customElements.define('facet-remove', FacetRemove);
