import { dataCy } from '../data-cy'

const baseUrl = Cypress.config('baseUrl')

Cypress.Commands.add('dataCy', (attr, path = '') => {
    cy.get(`[data-cy=${attr}] ${path}`)
})

Cypress.Commands.add('checkLoginSuccess', (fixture) => {
    cy.wait(2000)
    cy.dataCy(dataCy.userMenu.menu).should('be.visible').click()
    cy.contains('My Account', { timeout: 10000 }).click()
    cy.url().should('eq', `${baseUrl}account`)
    cy.contains('My Account')
    cy.contains(fixture.registration.email)
})

Cypress.Commands.add('login', (email, password) => {
    //functions for log-in
    cy.dataCy(dataCy.userMenu.menu).click() // Click on the account menu
    cy.wait(5000)
    cy.dataCy(dataCy.login.container, '#email').type(email)
    cy.dataCy(dataCy.login.container, '#password').type(password)
    cy.wait(2000)
    cy.dataCy(dataCy.login.container, "[aria-label='Log In']").click()
})

Cypress.Commands.add('register', (user) => {
    cy.dataCy(dataCy.userMenu.menu).click() // Click on the account menu
    cy.wait(1000)
    cy.dataCy(dataCy.login.container, '.signup-link').click() // Login model signup link click
    cy.get('.sign-up-form').should('exist')
    cy.wait(1000)
    cy.dataCy(dataCy.registration.container, '#fname').type(user.firstname)
    cy.dataCy(dataCy.registration.container, '#lname').type(user.lastname)
    cy.dataCy(dataCy.registration.container, '#signup-email').type(user.email)
    cy.dataCy(dataCy.registration.container, '#signup-password').type(
        user.password
    )
    cy.dataCy(dataCy.registration.container, '.sign-up-form')
        .contains('Sign Up')
        .click()
        .should('be.disabled')

    cy.get('.sign-up-form').should('not.exist')

    cy.wait(5000)
})

Cypress.Commands.add('hover', (attr) => {
    cy.get(attr).trigger('mouseover')
})

Cypress.Commands.add('clearMinicart', () => {
    // Functions for removing cart items
    const minicartOpenButtonSelector =
        'button.Button_root__aKI9V[aria-label="Cart"]'
    const minicartDeleteButtonSelector =
        'button.close-btn[aria-label="Delete Cart Item"]'
    let cartCount = 0

    cy.get('button.Button_root__aKI9V .cart-count')
        .invoke('text')
        .then((count) => {
            // check cart contains items
            cartCount = +count
            if (cartCount > 0) {
                cy.get(minicartOpenButtonSelector).each(($button) => {
                    cy.wrap($button).click() // Trigger minicart open button click
                })
                cy.get(minicartDeleteButtonSelector).each(($btn) => {
                    cy.wrap($btn).click() // trigger item remove button click
                    cy.get('li.CartItem_cart-item-wrapper__3rS0a')
                        .eq(0)
                        .find(
                            '.Modal_modal__opga9.modal-wrapper .Button_root__aKI9V'
                        )
                        .eq(1)
                        .click() // Trigger Yes button on modal confirmation
                    cy.get('button.close-btn[aria-label="Close Panel"]').click() // close minicart
                })
            }
        })
    cy.wait(3000)
})

Cypress.Commands.add('visiturl', (username, password, url) => {
    //functions for visit a page
    cy.visit(url, {
        auth: {
            username: username,
            password: password
        }
    })
})

Cypress.Commands.add('checkListingpage', () => {
    //functions for checl listing page workflow
    // Scroll to the bottom of the page
    cy.scrollTo('bottom')
    cy.wait(1000)
    cy.scrollTo('top')
    cy.wait(1000)
    cy.get('button[aria-label="See All Filters"]').should('exist')
    cy.get('button[aria-label="See All Filters"]').eq(0).click()
    cy.wait(1000)
    cy.get(
        '.SidebarFilter_layered-navigations__bnMsc.SidebarFilter_open__VohbG'
    ).should('exist') // check popup is open
    cy.get('.SidebarFilter_filter-body__Xh_IF')
        .eq(0)
        .find('button[aria-label="Brand"]')
        .each(($button) => {
            cy.wrap($button).click({ force: true })
        })
    cy.wait(1000)
    cy.get(
        '.CollapsibleContainer_collapsible__T8HyY.opened .collapsible-content li'
    )
        .eq(0)
        .find('input.form-checkbox')
        .each(($button) => {
            cy.wrap($button).check()
        })
    cy.wait(1000)
    cy.get('.SidebarFilter_apply-filters__qqink')
        .eq(0)
        .find('button[aria-label="Show Results"]')
        .each(($button) => {
            cy.wrap($button).click({ force: true })
        })
    cy.wait(1000)
    cy.get('button[aria-label="Add to Bag"]').should('exist')
    cy.get('.Toolbar_clear-btn__aCSUp').eq(0).click()
    cy.wait(1000)
    cy.scrollTo('bottom')
    cy.wait(1000)
    cy.get('.Pagination_nav-button__A1S2C').eq(3).click()
    cy.wait(1000)
    cy.scrollTo('top')
    cy.get('.Pagination_nav-button__A1S2C').eq(2).click()
    cy.wait(1000)
    cy.visit(' ')
})

Cypress.Commands.add('checkSRP', () => {
    //functions for check listing page workflow
    // Scroll to the bottom of the page
    cy.scrollTo('bottom')
    cy.wait(1000)
    cy.scrollTo('top')
    cy.wait(1000)
    cy.get('button[aria-label="See All Filters"]').should('exist')
    cy.get('button[aria-label="See All Filters"]').eq(0).click()
    cy.wait(1000)
    cy.get('.search-filter-open').should('exist') // check popup is open
    cy.get('.sidebar-filters-wrapper')
        .eq(0)
        .find('button[aria-label="filter-brand"]')
        .each(($button) => {
            cy.wrap($button).click({ force: true })
        })
    cy.wait(1000)
    cy.get('.sidebar-filters-wrapper div')
        .eq(0)
        .find('input.form-checkbox')
        .first()
        .each(($button) => {
            cy.wrap($button).check()
        })
    cy.wait(1000)
    cy.get('.sidebar-footer.fixed')
        .eq(0)
        .find('button[aria-label="Apply Filters"]')
        .each(($button) => {
            cy.wrap($button).click({ force: true })
        })
    cy.wait(1000)
    cy.scrollTo('bottom')
    cy.wait(1000)
    cy.scrollTo('top')
    cy.wait(1000)
    cy.get('.ProductTile_productitem-block___1J_0').should('exist')
    cy.get('.clear-all.secondary-btn').eq(0).click()
    cy.wait(1000)
    cy.scrollTo('bottom')
    cy.wait(1000)
    cy.get('.ais-Pagination-item.ais-Pagination-item--page')
        .eq(2)
        .find('.ais-Pagination-link')
        .click()
    cy.wait(1000)
    cy.scrollTo('top')
    cy.get('.ais-Pagination-item.ais-Pagination-item--page')
        .eq(3)
        .find('.ais-Pagination-link')
        .click()
    cy.wait(1000)
})

Cypress.Commands.add('checkStores', (storeArray) => {
    //functions for checl listing page workflow
    let flag = 0
    storeArray.forEach((storeName) => {
        if (storeName == 'Boynton Beach Two') {
            storeName = 'Boynton Beach'
            flag = 1
        }
        cy.visit(' ') // Visit homepage
        cy.get('div[class^="Navbar_pick-up__Elc_c"]')
            .eq(1)
            .find('button')
            .each(($button) => {
                cy.wrap($button).click({ force: true })
            })
        cy.get('div.StoreNav_store-input-search__mbb2G input#zip')
            .eq(0)
            .type(storeName)
        cy.get('button.StoreNav_search-btn__kziTC.btn-primary').click()

        if (storeName == 'Bradenton Bayshore') {
            storeName = '6722 14th St W'
        }

        if (storeName == 'Edgewater') {
            storeName = '2102 S Ridgewood Ave Ste 5'
        }

        if (storeName == 'Crystal River') {
            storeName = '275 NE US HWY 19'
        }

        if (storeName == 'Clearwater Beach') {
            storeName = '645 Bayway Blvd'
        }
        if (storeName == 'Clearwater Gulf to Bay') {
            storeName = '2790 Gulf To Bay Blvd'
        }
        if (storeName == 'Edgewater') {
            storeName = '2102 S Ridgewood Ave Ste 5'
        }

        if (storeName == 'Dadeland') {
            storeName = '9600 SW 77th Avenue'
        }
        if (storeName == 'Fernandina Beach') {
            storeName = '474285 E State Rd'
        }
        if (storeName == 'Gainesville UF') {
            storeName = '1614 W University Ave'
        }

        if (storeName == 'Fort Lauderdale') {
            storeName = '1417 SW 40th Terrace'
        }
        if (storeName == 'Fort Myers Summerlin') {
            storeName = '12575 S Cleveland Ave'
        }
        if (storeName == 'Fort Walton Beach') {
            storeName = '418 Mary Esther Cut Off NW'
        }
        if (storeName == 'Gainesville') {
            storeName = '1527 Northwest 6th Street'
        }
        if (storeName == 'Gainesville Archer') {
            storeName = '1614 W University Ave'
        }
        if (storeName == 'Gainesville UF') {
            storeName = '1614 W University Ave' //same
        }
        if (storeName == 'Jacksonville Arrowhead') {
            storeName = '10339 San Jose Boulevard'
        }
        if (storeName == 'Jacksonville Baymeadows') {
            storeName = '8355 Baymeadows Rd'
        }
        if (storeName == 'Jacksonville Southside') {
            // Not the first store
            storeName = '10095 Beach Blvd'
        }
        if (storeName == 'Kissimmee East') {
            //same
            storeName = '2647 E Irlo Bronson Memorial Hwy'
        }
        if (storeName == 'Kissimmee South') {
            storeName = '4967 W Irlo Bronson Memorial' // Kissimmee West Irlo, FL
        }
        if (storeName == 'Lady Lake Villages') {
            storeName = '13940 US-441 #601'
        }

        if (storeName == 'Land O Lakes') {
            storeName = '17704 Aprile Drive Suite 10' // OOPs error
        }
        if (storeName == 'Longwood Downtown') {
            storeName = '182 W State Rd 434, Suite 1016'
        }
        if (storeName == 'Miami South Beach') {
            storeName = '1011 5th Street'
        }
        if (storeName == 'Morgantown - Granville') {
            storeName = '525 Granville Square'
        }
        if (storeName == 'North Fort Myers 2') {
            storeName = '5660 Bayshore Road'
        }
        if (storeName == 'North Fort Myers 2') {
            storeName = '5660 Bayshore Road'
        }
        if (storeName == 'Orlando Colonial') {
            storeName = '11291 E Colonial Dr'
        }
        if (storeName == 'Orlando Millenia') {
            storeName = '4192 Conroy Rd'
        }
        if (storeName == 'Orlando South') {
            storeName = '9521 S Orange Blossom Trail #107'
        }

        if (storeName == 'Panama City Beach') {
            storeName = '9952 Hutchison Blvd'
        }
        if (storeName == 'Pensacola 9 Mile') {
            storeName = '1901 E. Nine Mile Road'
        }
        if (storeName == 'Port St Lucie East') {
            storeName = '1288 SW Gatlin Blvd'
        }
        if (storeName == 'Palm Beach Gardens') {
            storeName = '3555 Northlake Blvd'
        }

        if (storeName == 'Port St. Lucie') {
            storeName = '1068 SE Port St Lucie Blvd.'
        }
        if (storeName == 'South Charleston') {
            storeName = '4701 MacCorkle Ave' //S Charleston
        }
        if (storeName == 'St. Augustine #1') {
            storeName = '1650 US-1'
        }
        if (storeName == 'St.Petersburg Tyrone') {
            storeName = '6752 22nd AVE North'
        }
        if (storeName == 'Tallahassee FSU') {
            storeName = '1800 W Tennessee St'
        }
        if (storeName == 'Tampa Busch') {
            storeName = '2916-2918 E. Busch Blvd'
        }
        if (storeName == 'Tampa Citrus Park') {
            storeName = '8625 Citrus Park Dr'
        }
        if (storeName == 'Tampa Dale Mabry') {
            storeName = '8602 N Dale Mabry'
        }

        if (storeName == 'Tampa Fairgrounds') {
            storeName = '7702 E Hillsborough Ave'
        }

        if (storeName == 'Tampa Gandy') {
            storeName = '3126 Gandy Blvd'
        }

        if (storeName == 'Tampa Hillsborough') {
            storeName = '4410 W. Hillsborough Ave'
        }

        if (storeName == 'Tavernier') {
            storeName = '91214 Overseas Hwy'
        }

        if (storeName == 'Winter Haven Cypress') {
            storeName = '6000 Cypress Gardens'
        }

        if (storeName == 'West Palm Okeechobee') {
            storeName = '4139 Okeechobee Blvd'
        }

        if (flag == 1) {
            flag = 0
            cy.get('.LocatorStoreCard_store-details-header__p7GUu')
                .eq(1)
                .find('button[aria-label="Shop At This Store"]')
                .click()
            flag = 0
        } else {
            cy.contains('.store-details-content', storeName)
                .siblings('.LocatorStoreCard_store-details-header__p7GUu')
                .find('button[aria-label="Shop At This Store"]')
                .click()
        }

        const url1 = '/category/flower'
        cy.checkPLPforStores(url1)

        const url2 = '/category/concentrates'
        cy.checkPLPforStores(url2)

        const url3 = '/category/oral'
        cy.checkPLPforStores(url3)

        const url4 =
            '/category/vape-carts/live-vape-cartridges/live-sauz?sort=price%3AASC'
        cy.checkPLPforStores(url4)

        const url5 = '/category/topicals'
        cy.checkPLPforStores(url5)
        cy.go('back')
    })
})

Cypress.Commands.add('checkPLPforStores', (plpUrl) => {
    //functions for checl listing page workflow
    cy.visit(plpUrl)

    let i = 0
    cy.get('.product-name').each(($product) => {
        if (i > 5) {
            return
        }
        i++
        cy.wrap($product).find('a').click()
        cy.get('.product-description').should('exist')
        cy.get('.pdp-slider').should('exist')
        cy.get('.product-description').should('exist')
        cy.get('.pdp-slider').should('exist')
        cy.visit(plpUrl)
    })
})

Cypress.Commands.add('checkPLPforStores', (plpUrl) => {
    //functions for checl listing page workflow

    cy.visit(plpUrl)
    cy.get('.Plpgrid_Plpgrid__PBEnF .product-name').then(($elements) => {
        let actualLength = $elements.length

        cy.wrap($elements).should('have.length', actualLength)

        if (actualLength > 5) {
            actualLength = 5
        }
        for (let i = 0; i < actualLength; i++) {
            cy.get('.product-name').eq(i).find('a').click()
            cy.get('.product-description').should('exist')
            cy.get('.pdp-slider').should('exist')
            cy.get('.product-description').should('exist')
            cy.get('.pdp-slider').should('exist')
            cy.visit(plpUrl)

            // Re-fetch the product name elements after going back
            cy.get('.Plpgrid_Plpgrid__PBEnF .product-name').then(
                ($elementsAfterBack) => {
                    // Ensure the elements are still present after going back
                    cy.wrap($elementsAfterBack).should(
                        'have.length.gte',
                        actualLength
                    )
                }
            )

            //cy.go('back');
        }
    })
})

function convertCategoryToUrlFormat(category: string) {
    // Replace spaces with '+'
    let formattedCategory = category.replace(/ /g, '+')
    // Replace '>' with '%3E'
    formattedCategory = formattedCategory.replace(/>/g, '%3E')
    return formattedCategory
}

Cypress.Commands.add(
    'validatePriceFilter',
    (items, filterLowPrice, filterHighPrice) => {
        const typedItems = items as { price: number }[]
        let isPriceCorrect = true
        for (const item of typedItems) {
            if (item.price < filterLowPrice && item.price > filterHighPrice) {
                isPriceCorrect = false // Price is not less than the filter price
            }
        }
        expect(isPriceCorrect).to.be.true
    }
)

Cypress.Commands.add(
    'validateGetProductsAPI',
    (category, filterValue, aliasIdentifier = '') => {
        const formattedCategory = convertCategoryToUrlFormat(category)
        const categoryQueryParam = `bgfilter.ss_category=${formattedCategory}`
        const categoryQueryParamWithFilter = `${categoryQueryParam}*${filterValue}`

        if (!filterValue) {
            cy.intercept(
                'GET',
                `**/api/search/search.json*${categoryQueryParam}`
            ).as(`searchRequest${aliasIdentifier}`)
        } else {
            cy.intercept(
                'GET',
                `**/api/search/search.json*${categoryQueryParamWithFilter}`
            ).as(`filteredSearchRequest${aliasIdentifier}`)
        }
    }
)

Cypress.Commands.add(
    'validateGetSrpProductsAPI',
    (searchterm, filterValue, aliasIdentifier = '') => {
        const searchQueryParam = `q=${searchterm}`
        const searchQueryParamWithFilter = `${searchQueryParam}*${filterValue}`

        if (!filterValue) {
            cy.intercept(
                'GET',
                `**/api/search/search.json*page=1&${searchQueryParam}`
            ).as(`searchSRPRequest${aliasIdentifier}`)
        } else {
            cy.intercept(
                'GET',
                `**/api/search/search.json*page=1&${searchQueryParamWithFilter}`
            ).as(`filteredSearchSRPRequest${aliasIdentifier}`)
        }
    }
)

Cypress.Commands.add('checkPriceSorting', (items, order) => {
    expect(items).to.be.an('array')
    const prices = items?.map((result) => result.price)
    let sortedPrices = []
    if (order === 'asc') {
        sortedPrices = [...prices].sort((a, b) => a - b) // Sort prices in ascending order
    } else {
        sortedPrices = [...prices].sort((a, b) => b - a) // desc order
    }

    expect(prices).to.deep.equal(sortedPrices) // Check if prices are sorted in ascending order
})

Cypress.Commands.add('searchInput', (searchInput) => {
    cy.dataCy(dataCy.searchInput).should('exist').type(`${searchInput}{enter}`)
})

Cypress.Commands.add('selectFilter', (testId, filterPosition) => {
    console.log('inn selectFilter', testId, filterPosition)
    cy.dataCy(testId)
        .find(`ul li:nth-child(${filterPosition}) ul li:first-child`) // Select the first nested <li> element (index starts from 0)
        .find('input[type="checkbox"]')
        .check()
})

Cypress.Commands.add('applyFilter', (testId, filterPosition) => {
    cy.dataCy(testId)
        .find(
            `ul li:nth-child(${filterPosition}) div [class^="CollapsibleContainer_collapsible"]`
        )
        .then(($div) => {
            if ($div.hasClass('opened')) {
                cy.selectFilter(testId, filterPosition)
            } else {
                cy.dataCy(dataCy.search.filter)
                    .find(
                        `ul li:nth-child(${filterPosition}) div div div button`
                    )
                    .should('be.visible')
                    .eq(0)
                    .click()

                cy.selectFilter(testId, filterPosition)
            }
        })
})

Cypress.Commands.add('graphqlFetch', (operationName, aliasIdentifier = '') => {
    cy.intercept({
        headers: { 'X-Pylot-Query': `${operationName}` },
        url: '**/api/graphql',
        method: 'POST'
    }).as(`${operationName}${aliasIdentifier}`)
})

Cypress.Commands.add('validateUpdateCart', (step: 'next' | 'prev') => {
    cy.graphqlFetch('updateCartItems', step)

    const product = { count: 0 }

    cy.dataCy(dataCy.cart.cartRow)
        .eq(0)
        .find('label[for*="input-quantity-field"]')
        .then(($currentElement) => {
            product.count = +$currentElement.find('input').attr('value')
            // Perform your conditional logic
            if (step === 'next') {
                cy.wrap($currentElement).next().click()
            } else {
                cy.wrap($currentElement).prev().click()
            }
            cy.wait(`@updateCartItems${step}`).then((intercept) => {
                const { items } =
                    intercept.response.body.data.updateCartItems.cart
                const updatedCount =
                    step === 'next' ? product.count + 1 : product.count - 1
                expect(items[0].quantity).to.equal(updatedCount)

                expect(
                    (items[0].prices.price.value * updatedCount).toFixed(2)
                ).to.equal(items[0].prices.row_total.value.toFixed(2))

                cy.dataCy(dataCy.cart.cartRow)
                    .eq(0)
                    .find('label[for*="input-quantity-field"] input')
                    .should('have.attr', 'value', items[0].quantity)

                cy.dataCy(dataCy.cart.cartRow)
                    .eq(0)
                    .find('div[class*="cost"] div[class*="subtotal"]')
                    .contains(items[0].prices.row_total.value)

                cy.dataCy(dataCy.cart.cartSummary)
                    .find('div[class*=cart-items-total]')
                    .contains('Estimated Total')
                    .next()
                    .should('contain', items[0].prices.row_total.value)

                cy.dataCy(dataCy.cart.proceedToCheckout).should(
                    'not.be.disabled'
                )
            })
        })
})
