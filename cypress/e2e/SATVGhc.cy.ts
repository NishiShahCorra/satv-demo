import { dataCy } from '../data-cy'
import { Fixtures } from '../types/fixtures'

let fixture: Fixtures
const PlpColorFilter: any = {}
const PlpPriceFilter: any = {}
const SrpPriceFilter: any = {}

Cypress.config('baseUrl', Cypress.config('baseUrl'))

function decodeHtmlEntities(str) {
    const txt = document.createElement('textarea')
    txt.innerHTML = str
    return txt.value
}

describe('SuperATV', () => {
    beforeEach(() => {
        cy.intercept({ resourceType: /xhr|fetch/ }, { log: false })
        cy.fixture('index.json').then((fixtureData) => {
            fixture = fixtureData
            cy.visit('') // Visit homepage
            cy.wait(500)

            Cypress.on('uncaught:exception', () => {
                return false
            })
        })
    })
    // Login and Signup
    describe('Login and Signup', () => {
        //Register
        it('Register', () => {
            cy.register(fixture.registration)
            cy.visit('/')
            cy.wait(2000)
            cy.checkLoginSuccess(fixture)
        })

        // Login
        it('Login & My Account', () => {
            cy.wait(5000)
            cy.login(fixture.registration.email, fixture.registration.password)
            cy.wait(5000)
            cy.checkLoginSuccess(fixture) // Check login is successful or not
            cy.wait(5000)
            cy.dataCy(dataCy.accountSidebar, '> li').each((_, index) => {
                cy.dataCy(dataCy.accountSidebar).find('li').eq(index).click()
                cy.wait(5000)
            })
        })
    })
    describe('Loading Website and Navigation', () => {
        // Loading Website
        it('Loading website', () => {
            cy.visit('')
            cy.wait(6000)
            cy.dataCy(dataCy.menuItems).within(() => {
                // Get the fifth menu link (index starts from 0)
                cy.get('li').eq(4).should('exist')
            })
            cy.dataCy(dataCy.menuItems, '> li').each(($link) => {
                const href = $link.find('a').attr('href')
                cy.visit(href)
            })
            dataCy.otherSitePages.map((e) => {
                cy.visit(e)
            })
        })

        // Category navigation
        it('Hover', async () => {
            cy.dataCy(dataCy.menuItems)
                .find('>li')
                .each(($link) => {
                    cy.wrap($link).trigger('mouseover')
                    cy.wait(2000)
                })
        })
    })
    describe('PLP, PDP, Search Without Verification', () => {
        //*** Filter apply on PLP ***//
        it('Filter apply on PLP', () => {
            cy.visit(fixture.plp.plpUrl)
            cy.wait(1000)
            cy.dataCy(dataCy.plp.filter, 'ul')
                .filter(':not(ul ul)')
                .find('>li')
                .eq(0)
                .find(' ul > li')
                .eq(0)
                .as('filter')
                .click()
        })
        //*** Sort apply on PLP ***//
        it('Sort apply on PLP', () => {
            cy.visit(fixture.plp.plpUrl)
            cy.wait(1000)
            cy.dataCy(dataCy.filterSortMenu)
                .contains('Sort by')
                .as('SortByButton')
                .click()
                .dataCy(dataCy.filterSortMenu, 'ul > li')
                .as('sortingOptions')
                .each((_, index) => {
                    cy.dataCy(
                        dataCy.filterSortMenu,
                        'div[class*=dropdown][aria-expanded]'
                    )
                        .filter(':not(div[class*=dropdown-option])')
                        .then(($div) => {
                            const ariaExpanded = $div.attr('aria-expanded')
                            if (ariaExpanded !== 'true') {
                                cy.get('@SortByButton').click()
                            }
                            cy.get('@sortingOptions')
                                .eq(index)
                                .should('exist')
                                .click()
                            cy.dataCy(dataCy.plp.productItem).should('exist')
                            cy.wait(3000)
                        })
                })
        })
        //*** Filter apply on SRP ***//
        it('Filter apply on SRP', () => {
            cy.visit(fixture.plp.plpUrl)
            cy.wait(1000)
            cy.dataCy(dataCy.searchInput)
                .should('exist')
                .type(`${fixture.search.keyword}{enter}`)
            cy.wait(3000)
            cy.dataCy(dataCy.search.filter, 'ul')
                .filter(':not(ul ul)')
                .find('>li')
                .eq(0)
                .find(' ul > li')
                .eq(0)
                .as('filter')
                .click()

            cy.get('@filter').then(($link) => {
                cy.wrap($link)
                    .find('label')
                    .find('.count')
                    .then((count) => {
                        const productsCount = +count.html().replace(/\D/g, '')

                        cy.dataCy(dataCy.plp.productItem)
                            .eq((productsCount > 24 ? 24 : productsCount) - 1)
                            .should('exist')
                    })
            })
        })
        //*** Sort apply on SRP ***//
        it('Sort apply on SRP', () => {
            cy.visit(fixture.plp.plpUrl)
            cy.wait(1000)
            cy.dataCy(dataCy.searchInput)
                .should('exist')
                .type(`${fixture.search.keyword}{enter}`)
            cy.wait(3000)
            cy.dataCy(dataCy.filterSortMenu)
                .contains('Sort by')
                .as('SortByButton')
                .click()
                .dataCy(dataCy.filterSortMenu, 'ul > li')
                .as('sortingOptions')
                .each((_, index) => {
                    cy.dataCy(
                        dataCy.filterSortMenu,
                        'div[class*=dropdown][aria-expanded]'
                    )
                        .filter(':not(div[class*=dropdown-option])')
                        .then(($div) => {
                            const ariaExpanded = $div.attr('aria-expanded')
                            if (ariaExpanded !== 'true') {
                                cy.get('@SortByButton').click()
                            }
                            cy.get('@sortingOptions')
                                .eq(index)
                                .should('exist')
                                .click()
                            cy.dataCy(dataCy.plp.productItem).should('exist')
                            cy.wait(3000)
                        })
                })
        })
    })

    describe('Add to cart & Buy Product', () => {
        // Add to cart & Checkout with guest user
        it('Add to cart & Checkout with guest user', () => {
            cy.clearAllSessionStorage()
            cy.clearCookies()
            cy.clearLocalStorage()
            cy.visit(fixture.plp.plpUrl)
            cy.wait(1000)
            cy.dataCy(dataCy.searchInput)
                .should('exist')
                .type(`${fixture.search.keyword}{enter}`)
            cy.wait(3000)
            cy.dataCy(dataCy.plp.productItem)
                .contains(/add to cart/i)
                .eq(0)
                .parent()
                .parent()
                .parent()
                .parent()
                .find('a')
                .eq(0)
                .click()
                .wait(2000)
            cy.get('button[aria-label="Add to cart"]').should('exist').click()
            cy.wait(5000)
            cy.dataCy(dataCy.cart.CSOModel)
                .should('exist')
                .dataCy(dataCy.cart.viewCartBtn)
                .contains('VIEW CART')
                .should('exist')
                .click({ force: true })

            cy.wait(2000)
            cy.dataCy(dataCy.cart.cartRow).eq(0).should('exist')
            cy.dataCy(dataCy.cart.cartSummary)
                .should('exist')
                .dataCy(dataCy.cart.proceedToCheckout)
                .should('exist')
                .click()

            // checkout wizard form filling
            cy.dataCy(dataCy.checkout.wizard)
                .find('#checkout-signIn')
                .should('exist')
                .as('signIn')
                .find('#email')
                .type(fixture.login.username)
                .wait(5000)
            cy.get('@signIn')
                .find('button[type="button"]')
                .contains('Continue As Guest')
                .should('exist')
                .click()
                .wait(3000)
            cy.dataCy(dataCy.checkout.wizard)
                .find('#checkout-shippingAddress')
                .should('exist')
                .as('shippingAddress')

            cy.get('@shippingAddress')
                .find('#shipping_firstname')
                .type(fixture.cartData.firstName)
            cy.get('@shippingAddress')
                .find('#shipping_lastname')
                .type(fixture.cartData.lastName)
            cy.get('@shippingAddress')
                .find('#shipping_street1')
                .type(fixture.cartData.street1)
            cy.get('@shippingAddress').find('#shipping_street2')
            cy.get('@shippingAddress')
                .find('#shipping_city')
                .type(fixture.cartData.street2)
            cy.get('@shippingAddress')
                .find('#shipping_postcode')
                .type(fixture.cartData.postcode)
            cy.get('@shippingAddress')
                .find('#shipping_region')
                .select(fixture.cartData.region)
            cy.get('@shippingAddress')
                .find('#shipping_country')
                .select(fixture.cartData.country)
            cy.get('@shippingAddress').find('#shipping_company')
            cy.get('@shippingAddress')
                .find('#shipping_telephone')
                .type(fixture.cartData.telephone)
            cy.get('@shippingAddress')
                .find('#shipping_type')
                .select(fixture.cartData.shippingAddressType)

            cy.dataCy(dataCy.checkout.wizard)
                .find('#checkout-shippingMethod')
                .should('exist')
                .as('shippingMethod')
                .find('#shipping_method_radio')
                .check()
                .wait(5000)

            cy.dataCy(dataCy.checkout.wizard)
                .find('#checkout-paymentMethod')
                .should('exist')
                .as('paymentMethod')
            cy.wait(10000) // Adjust the wait time as needed
        })
        // Add to cart & Checkout with login user
        it('Add to cart & Checkout with login user', () => {
            cy.clearAllSessionStorage()
            cy.clearCookies()
            cy.clearLocalStorage()
            cy.visit(fixture.plp.plpUrl)
            cy.wait(1000)
            cy.dataCy(dataCy.searchInput)
                .should('exist')
                .type(`Whip Lights{enter}`)
            cy.wait(5000)
            cy.dataCy(dataCy.plp.productItem)
                .contains('View Product')
                .eq(0)
                .should('exist')
                .click()
                .wait(5000)

            cy.get('.variant-selector')
                .find('>div')
                .each(($div) => {
                    cy.wrap($div).find('div').eq(1).find('select').select(2)
                })
            cy.get('button[aria-label="Add to cart"]').should('exist').click()
            cy.wait(5000)
            cy.dataCy(dataCy.cart.CSOModel)
                .should('exist')
                .dataCy(dataCy.cart.viewCartBtn)
                .contains('VIEW CART')
                .should('exist')
                .click({ force: true })

            cy.wait(2000)
            cy.dataCy(dataCy.cart.cartRow).eq(0).should('exist')
            cy.dataCy(dataCy.cart.cartSummary)
                .should('exist')
                .dataCy(dataCy.cart.proceedToCheckout)
                .should('exist')
                .click()

            // checkout wizard form filling
            cy.dataCy(dataCy.checkout.wizard)
                .find('#checkout-signIn')
                .should('exist')
                .as('signIn')
                .find('#email')
                .type(fixture.login.username)
                .wait(5000)
            cy.get('@signIn').find('#password').type(fixture.login.password)
            cy.get('@signIn')
                .find('button[type="submit"]')
                .contains('Sign in')
                .should('exist')
                .click()
                .wait(5000)
            cy.dataCy(dataCy.checkout.wizard)
                .find('#checkout-shippingAddress')
                .should('exist')
                .as('shippingAddress')

            cy.get('@shippingAddress')
                .find('#shipping_firstname')
                .type(fixture.cartData.firstName)
            cy.get('@shippingAddress')
                .find('#shipping_lastname')
                .type(fixture.cartData.lastName)
            cy.get('@shippingAddress')
                .find('#shipping_street1')
                .type(fixture.cartData.street1)
            cy.get('@shippingAddress').find('#shipping_street2')
            cy.get('@shippingAddress')
                .find('#shipping_city')
                .type(fixture.cartData.street2)
            cy.get('@shippingAddress')
                .find('#shipping_postcode')
                .type(fixture.cartData.postcode)
            cy.get('@shippingAddress')
                .find('#shipping_region')
                .select(fixture.cartData.region)
            cy.get('@shippingAddress')
                .find('#shipping_country')
                .select(fixture.cartData.country)
            cy.get('@shippingAddress').find('#shipping_company')
            cy.get('@shippingAddress')
                .find('#shipping_telephone')
                .type(fixture.cartData.telephone)
            cy.get('@shippingAddress')
                .find('#shipping_type')
                .select(fixture.cartData.shippingAddressType)

            cy.dataCy(dataCy.checkout.wizard)
                .find('#checkout-shippingMethod')
                .should('exist')
                .as('shippingMethod')
                .find('#shipping_method_radio')
                .check()
                .wait(5000)

            cy.dataCy(dataCy.checkout.wizard)
                .find('#checkout-paymentMethod')
                .should('exist')
                .as('paymentMethod')

            cy.wait(5000)
        })
    })

    describe('PLP, PDP, Search With Verification', () => {
        // plp validating with product list api
        it('PLP validating with product list api', () => {
            cy.validateGetProductsAPI(
                fixture.plp.plpCategoryApiInput,
                undefined
            )
            cy.visit(fixture.plp.plpUrl)

            cy.wait('@searchRequest', { timeout: 15000 }).then((data) => {
                const { results, facets } = data.response.body

                const colorFilterIndex = facets.findIndex(
                    (facet: { field: string }) => facet.field === 'color'
                )
                PlpColorFilter.index = colorFilterIndex
                    ? colorFilterIndex + 1
                    : undefined
                const priceFilterIndex = facets.findIndex(
                    (facet: { field: string }) => facet.field === 'final_price'
                )
                PlpPriceFilter.index = priceFilterIndex
                    ? priceFilterIndex + 1
                    : undefined

                if (colorFilterIndex !== -1) {
                    PlpColorFilter.field = facets[colorFilterIndex]?.field
                    PlpColorFilter.val =
                        facets[colorFilterIndex]?.values[0]?.value
                    PlpColorFilter.count =
                        facets[colorFilterIndex]?.values[0]?.count
                }

                if (priceFilterIndex !== -1) {
                    PlpPriceFilter.field = facets[priceFilterIndex]?.field
                    PlpPriceFilter.val = [
                        facets[priceFilterIndex]?.values[0]?.low,
                        facets[priceFilterIndex]?.values[0]?.high
                    ]
                    PlpPriceFilter.count =
                        facets[priceFilterIndex]?.values[0]?.count
                }

                cy.dataCy(dataCy.plp.categoryName).contains(
                    fixture.plp.categoryName
                )

                cy.dataCy(dataCy.plp.filter)
                    .find('ul > li:first-child h2')
                    .should('be.visible')
                    .invoke('text')
                    .should('eq', `${facets[0].label}`)

                cy.dataCy(dataCy.plp.productItem)
                    .eq(0)
                    .find('h2[class^="ProductTile_product-name"] a span')
                    .invoke('text')
                    .should('eq', `${results[0].name}`)

                cy.dataCy(dataCy.plp.grid, '> div:first-child')
                    .children()
                    .its('length')
                    .should('eq', results.length)
            })
        })

        //*** Filter apply on PLP and validate the response ***//
        it('Filter apply on PLP and validate the response', () => {
            // check price filter index exists the apply filter
            if (PlpPriceFilter?.index) {
                cy.validateGetProductsAPI(
                    fixture.plp.plpCategoryApiInput,
                    `filter.${PlpPriceFilter.field}.high=${PlpPriceFilter.val[1]}`,
                    'PriceFilter'
                )
                cy.visit(fixture.plp.plpUrl)

                // here price filter is on index in filter list so passed that index
                cy.applyFilter(dataCy.plp.filter, PlpPriceFilter?.index)

                cy.wait('@filteredSearchRequestPriceFilter').then((data) => {
                    const { results } = data.response.body
                    cy.validatePriceFilter(
                        results,
                        PlpPriceFilter.val[0],
                        PlpPriceFilter.val[1]
                    )
                    expect(results).to.have.length(PlpPriceFilter.count)
                })
            }
            // check Color filter index exists the apply filter
            if (PlpColorFilter?.index) {
                // check color filter also
                cy.validateGetProductsAPI(
                    fixture.plp.plpCategoryApiInput,
                    `filter.${PlpColorFilter.field}=${PlpColorFilter.val}`,
                    'ColorFilter'
                )
                cy.visit(fixture.plp.plpUrl)

                // here color filter is on index position in filter list so passed that index
                cy.applyFilter(dataCy.plp.filter, PlpColorFilter?.index)

                cy.wait('@filteredSearchRequestColorFilter').then((data) => {
                    const { results } = data.response.body
                    expect(results).to.have.length(PlpColorFilter.count)
                    cy.intercept(
                        'GET',
                        '**/api/graphql?query=query%20productDetail*'
                    ).as('PdpData')
                    cy.visit(results[0].url)
                    cy.wait('@PdpData').then((pdpInfo) => {
                        // check the PDP configurable_options response to verify color value
                        const {
                            data: {
                                productDetail: { items }
                            }
                        } = pdpInfo.response.body
                        expect(
                            items[0]?.configurable_options[0]?.values?.some(
                                (item) => item.label === PlpColorFilter.val
                            )
                        ).to.be.true
                    })
                })
            }
        })

        //*** Check sorting in PLP page and validate the response */
        it('Sort apply on PLP and validate the response', () => {
            const order = 'asc'
            cy.validateGetProductsAPI(
                fixture.plp.plpCategoryApiInput,
                `sort.final_price=${order}`
            )
            cy.visit(fixture.plp.plpUrl)

            cy.dataCy(dataCy.filterSortMenu).contains('Sort by').click()
            cy.dataCy(dataCy.filterSortMenu, 'ul > li')
                .contains('Price : Low - High')
                .click()
            cy.wait('@filteredSearchRequest').then((data) => {
                const { results } = data.response.body
                cy.checkPriceSorting(results, order)
            })
        })

        //SRP validating with product list api
        it('SRP validating with product list api', () => {
            cy.validateGetSrpProductsAPI(fixture.search.keyword, undefined)
            cy.wait(1000)
            cy.searchInput(fixture.search.keyword)

            cy.dataCy(dataCy.search.header)
                .should('exist')
                .find('h1')
                .should(
                    'have.text',
                    `${fixture.search.searchResultHeader}'${fixture.search.keyword}'`
                )
            cy.wait('@searchSRPRequest', { timeout: 15000 }).then((data) => {
                const { results, facets } = data.response.body

                const priceFilterIndex = facets.findIndex(
                    (facet: { field: string }) => facet.field === 'final_price'
                )
                SrpPriceFilter.index = priceFilterIndex
                    ? priceFilterIndex + 1
                    : undefined
                if (priceFilterIndex !== -1) {
                    SrpPriceFilter.field = facets[priceFilterIndex]?.field
                    SrpPriceFilter.val = [
                        facets[priceFilterIndex]?.values[0]?.low,
                        facets[priceFilterIndex]?.values[0]?.high
                    ]
                    SrpPriceFilter.count =
                        facets[priceFilterIndex]?.values[0]?.count
                }
                cy.dataCy(dataCy.search.filter)
                    .find('ul > li:first-child h2')
                    .should('be.visible')
                    .invoke('text')
                    .should('eq', `${facets[0].label}`)

                cy.dataCy(dataCy.srp.productItem)
                    .eq(0)
                    .find('h2[class^="ProductTile_product-name"] a span')
                    .invoke('text')
                    // .should('eq', `${results[0].name}`)
                    .then((text) => {
                        // Decode the text from the frontend
                        const decodedText = decodeHtmlEntities(text)
                        // Decode the expected result from the API
                        const expectedText = decodeHtmlEntities(results[0].name)
                        // Perform the comparison
                        expect(decodedText).to.eq(expectedText)
                    })
            })
        })

        //*** Filter apply on SRP and validate the response ***//
        it('Filter apply on SRP and validate the response', () => {
            // check price filter index exists the apply filter
            if (SrpPriceFilter?.index) {
                cy.searchInput(fixture.search.keyword)

                cy.dataCy(dataCy.search.header)
                    .should('exist')
                    .find('h1')
                    .should(
                        'have.text',
                        `${fixture.search.searchResultHeader}'${fixture.search.keyword}'`
                    )

                cy.validateGetSrpProductsAPI(
                    fixture.search.keyword,
                    `filter.${SrpPriceFilter.field}.high=${SrpPriceFilter.val[1]}`,
                    'PriceFilter'
                )

                // here price filter is on index in filter list so passed that index
                cy.applyFilter(dataCy.search.filter, SrpPriceFilter?.index)

                cy.wait('@filteredSearchSRPRequestPriceFilter').then((data) => {
                    const { results } = data.response.body
                    cy.validatePriceFilter(
                        results,
                        SrpPriceFilter.val[0],
                        SrpPriceFilter.val[1]
                    )
                    expect(results).to.have.length(SrpPriceFilter.count)
                })
            }
        })

        //*** Check sorting in SRP page and validate the response */
        it('Sort apply on SRP and validate the response', () => {
            const order = 'asc'
            cy.validateGetSrpProductsAPI(
                fixture.search.keyword,
                `sort.final_price=${order}`
            )

            cy.visit(fixture.plp.plpUrl)

            cy.wait(1000)
            cy.dataCy(dataCy.searchInput)
                .should('exist')
                .type(`${fixture.search.keyword}{enter}`)
            cy.wait(3000)

            cy.dataCy(dataCy.filterSortMenu).contains('Sort by').click()
            cy.dataCy(dataCy.filterSortMenu, 'ul > li')
                .contains('Price : Low - High')
                .click()
            cy.wait('@filteredSearchSRPRequest').then((data) => {
                const { results } = data.response.body
                cy.checkPriceSorting(results, order)
            })
        })
    })

    describe('Garage Menu', () => {
        beforeEach(() => {
            cy.intercept(
                'GET',
                '**/api/graphql?query=query%20listVehiclesByCustomer*'
            ).as('listGarage')

            cy.intercept({
                method: 'POST',
                url: '*api/graphql*',
                headers: { 'X-Pylot-Query': 'addCustomerVehicle' }
            }).as('addGarage')
        })

        //Create garage page
        it('Create garage', () => {
            cy.clearAllCookies()
            cy.clearAllLocalStorage()
            cy.clearAllSessionStorage()

            cy.get('div[class^=MyGarage_vehicle-dropdowns]')
                .find('>div')
                .as('GMenu')

            // this is selecting random data
            // selecting the year of model
            cy.get('@GMenu').eq(0).find('select').select(3)

            // selecting make of the model
            cy.get('@GMenu').eq(1).find('select').select(1)

            // selecting model
            cy.get('@GMenu').eq(2).find('select').select(2)
            cy.intercept({
                method: 'POST',
                url: '*api/graphql*',
                headers: { 'X-Pylot-Query': 'generateCustomerToken' }
            }).as('loginApi')

            cy.intercept({
                method: 'GET',
                url: '*api/graphql*',
                headers: { 'X-Pylot-Query': 'listVehiclesByCustomer' }
            }).as('listVehicles')

            cy.get('div[class^=MyGarage_vehicle-selection-text-wrapper]')
                .find('button')
                .click()
            cy.get('button')
                .contains(/Log in/g)
                .click()
            cy.dataCy(dataCy.login.container, '#email').type(
                fixture.registration.email
            )
            cy.dataCy(dataCy.login.container, '#password').type(
                fixture.registration.password
            )
            cy.wait(2000)
            cy.dataCy(dataCy.login.container, "[aria-label='Log In']").click()

            cy.wait('@loginApi')
                .wait('@addGarage', { timeout: 15000 })
                .then((intercept) => {
                    const vehiclesList =
                        intercept?.response?.body?.data?.addCustomerVehicle

                    cy.wait(5000)
                    cy.get(
                        'div[class^=MyGarage_vehicle-selection-text-wrapper]'
                    )
                        // .click()
                        .find('button')
                        .click()

                    cy.get('div[class^=MyGarage_searched-vehicle-dropdown]')
                        .find('ul li')
                        .each((li, index) => {
                            const { year, make, model } =
                                vehiclesList.vehicles_by_customer[index]

                            expect(li.find('label span').text()).to.be.equal(
                                `${year} ${make} ${model}`
                            )
                        })
                })
                // .wait('@listVehicles')
                .wait(10000)

            cy.get('div[class^=MyGarage_searched-vehicle-dropdown]')
                .find('button')
                .contains(/Add Vehicle/g)
                .click({ force: true })

            cy.get('div[class^=MyGarage_additional-vehicle-dropdowns]')
                .find('>div')
                .as('GMenu')

            // this is selecting random data
            // selecting the year of model
            cy.get('@GMenu').eq(0).find('select').select(5)

            // selecting make of the model
            cy.get('@GMenu').eq(1).find('select').select(1)

            // selecting model
            cy.get('@GMenu').eq(2).find('select').select(2)

            cy.get('div[class^=MyGarage_searched-vehicle-dropdown]')
                .find('button')
                .contains(/Add Vehicle/g)
                .click()
            cy.get('div[class^=MyGarage_searched-vehicle-dropdown]')
                .find('button')
                .contains(/Save to My Garage/g)
                .click()
            cy.wait(10000)
        })

        // Plp visit with garages
        it('Plp visit with garages', () => {
            cy.intercept({
                method: 'POST',
                url: '*api/graphql*',
                headers: { 'X-Pylot-Query': 'generateCustomerToken' }
            }).as('loginApi')
            cy.login(fixture.registration.email, fixture.registration.password)
            cy.wait('@loginApi')

            cy.visit(fixture.plp.plpUrl)
            cy.get('.desktop-only .fitment-tab ')
                .should('exist')
                .should('be.visible')
                .find('.fitment-filter-switch')
                .find('button')
                .as('filterSwitch')
                .eq(1)
                .click()
            cy.get('@filterSwitch').eq(0).click()

            cy.applyFilter(dataCy.plp.filter, 1)
            cy.wait(10000)
            cy.get('button[class^=MyGarage_vehicle-selection-text]').click()

            cy.get('div[class^=MyGarage_searched-vehicle-dropdown]')
                .find('ul li')
                .each((list) => {
                    if (list.find('input').attr('checked')) {
                        list.find('input[type=radio]').attr('name')
                    } else {
                        cy.wrap(list).find('input[type=radio]').click()
                    }
                })

            cy.wait(10000)
            cy.dataCy(dataCy.userMenu.menu)
                .click()
                .contains(/My Garage/g)
                .click()
            cy.url().should('contain', 'account/my-garage')
        })

        // Search visit with garages
        it('Search visit with garages', () => {
            cy.intercept({
                method: 'POST',
                url: '*api/graphql*',
                headers: { 'X-Pylot-Query': 'generateCustomerToken' }
            }).as('loginApi')

            cy.login(fixture.registration.email, fixture.registration.password)

            cy.wait('@loginApi')

            cy.visit(fixture.plp.plpUrl)
            cy.searchInput(fixture.search.keyword)

            cy.dataCy(dataCy.search.header)
                .should('exist')
                .find('h1')
                .should(
                    'have.text',
                    `${fixture.search.searchResultHeader}'${fixture.search.keyword}'`
                )

            cy.get('.desktop-only .fitment-tab ')
                .should('exist')
                .should('be.visible')
                .find('.fitment-filter-switch')
                .find('button')
                .as('filterSwitch')
                .eq(1)
                .click()
            cy.get('@filterSwitch').eq(0).click()

            cy.applyFilter(dataCy.search.filter, 1)
            cy.wait(10000)
            cy.get('button[class^=MyGarage_vehicle-selection-text]').click({
                multiple: true
            })

            cy.get('div[class^=MyGarage_searched-vehicle-dropdown]')
                .find('ul li')
                .each((list) => {
                    if (list.find('input').attr('checked')) {
                        list.find('input[type=radio]').attr('name')
                    } else {
                        cy.wrap(list).find('input[type=radio]').click()
                    }
                })
            cy.get('span[class*=Filters_clear-filter]').eq(0).click()
            cy.wait(10000)

            cy.applyFilter(dataCy.search.filter, 3)

            cy.wait(10000)
            cy.dataCy(dataCy.userMenu.menu)
                .click()
                .contains(/My Garage/g)
                .click()
            cy.url().should('contain', 'account/my-garage')
        })

        // My garage page
        it('My garage page', () => {
            cy.intercept({
                method: 'POST',
                url: '*api/graphql*',
                headers: { 'X-Pylot-Query': 'generateCustomerToken' }
            }).as('loginApi')

            cy.login(fixture.registration.email, fixture.registration.password)

            cy.wait('@loginApi')
            cy.wait('@listGarage', { timeout: 15000 }).then((intercept) => {
                const { vehicles_by_customer } =
                    intercept.response.body?.data?.listVehiclesByCustomer

                cy.dataCy(dataCy.userMenu.menu)
                    .click()
                    .contains(/My Garage/g)
                    .click()

                cy.url().should('contain', 'account/my-garage')
                cy.wait(10000)
                cy.get('table[class*=vehicles-list]')
                    .find('tbody')
                    .find('tr[class=vehicle-list-row]')
                    .as('rows')
                    .each((_, index) => {
                        cy.get('@rows')
                            .eq(index)
                            .find('td')
                            .each((td) => {
                                if (td.attr('class').includes('year')) {
                                    expect(
                                        vehicles_by_customer[index].year
                                    ).to.be.equal(td.text())
                                }
                                if (td.attr('class').includes('make')) {
                                    expect(
                                        vehicles_by_customer[index].make
                                    ).to.be.equal(td.text())
                                }
                                if (td.attr('class').includes('model')) {
                                    expect(
                                        vehicles_by_customer[index].model
                                    ).to.be.equal(td.text())
                                }
                            })
                            .find('input')
                            .click()

                        cy.get('div[class*=MyGarage_vehicle-selection-text]')
                            .invoke('text')
                            .should(
                                'equal',
                                `${vehicles_by_customer[index].year} ${vehicles_by_customer[index].make} ${vehicles_by_customer[index].model}`
                            )
                    })
            })

            // click delete button
            cy.get('table[class*=vehicles-list]')
                .find('tbody')
                .find('tr[class=vehicle-list-row]')
                .as('rows')
                .each((_, index, rows) => {
                    cy.get('@rows')
                        .eq(rows.length - 1 - index)
                        .find('td[class*=table-actions]')
                        .find('button')
                        .click()
                    cy.wait(5000)
                })
        })
    })
})
