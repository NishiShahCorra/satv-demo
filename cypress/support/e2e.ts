// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import { Fixtures, Registration } from '../types/fixtures'
import './commands'

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Cypress {
        interface Chainable {
            dataCy(attr: string, path?: string): Chainable<JQuery<HTMLElement>>
            hover(attr: string, path?: string): Chainable<JQuery<HTMLElement>>
            login(
                email: string,
                password: string
            ): Chainable<JQuery<HTMLElement>>
            checkLoginSuccess(fixture: Fixtures): Chainable<JQuery<HTMLElement>>
            register(user: Registration): Chainable<JQuery<HTMLElement>>
            clearMinicart(): Chainable<JQuery<HTMLElement>>
            checkListingpage(): Chainable<JQuery<HTMLElement>>
            checkSRP(): Chainable<JQuery<HTMLElement>>
            checkStores(
                storeArray: Array<string>
            ): Chainable<JQuery<HTMLElement>>
            checkPLPforStores(plpUrl: string): Chainable<JQuery<HTMLElement>>
            visiturl(
                username: string,
                password: string,
                url: string
            ): Chainable<JQuery<HTMLElement>>
            validateGetProductsAPI(
                category: string,
                filterValue: string,
                aliasIdentifier?: string
            ): Chainable<JQuery<HTMLElement>>
            validatePriceFilter(
                items: { price: number }[],
                filterLowPrice: number,
                filterHighPrice: number
            ): Chainable<JQuery<HTMLElement>>
            checkPriceSorting(
                items: { price: number }[],
                order: string
            ): Chainable<JQuery<HTMLElement>>
            searchInput(searchInput: string): Chainable<JQuery<HTMLElement>>
            validateGetSrpProductsAPI(
                searchTerm: string,
                filterValue: string,
                aliasIdentifier?: string
            ): Chainable<JQuery<HTMLElement>>
            applyFilter(
                testId: string,
                filterPosition: number
            ): Chainable<JQuery<HTMLElement>>
            selectFilter(
                testId: string,
                filterPosition: number
            ): Chainable<JQuery<HTMLElement>>

            validateUpdateCart(step: string): Chainable<JQuery<HTMLElement>>
            graphqlFetch(
                operationName: string,
                aliasIdentifier?: string
            ): Chainable<JQuery<HTMLElement>>
        }
    }
}
// Alternatively you can use CommonJS syntax:
// require('./commands')
