import { dataCy } from '../data-cy'
import { Fixtures } from '../types/fixtures'

let fixture: Fixtures
let staticUrl = []

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
            staticUrl = fixtureData?.urls
            cy.visit('') // Visit homepage
            cy.wait(500)

            Cypress.on('uncaught:exception', () => {
                return false
            })
        })
    })

    // const data = require('../fixtures/urls.json')

    // const urls = data.urls

    // describe('Open URLs from urls.json', () => {
    //     urls.forEach((url) => {
    //         it.only(`should visit ${url}`, () => {
    //             cy.wait(5000)
    //             cy.visit(url)
    //             cy.wait(5000)

    //             cy.url().should('eq', url)
    //             cy.wait(5000)
    //         })
    //     })
    // })
    const waitForPageLoad = () => {
        cy.get('#navbar', { timeout: 45000 }).should('be.visible')
    }

    it.only('Open URLs from index.json', () => {
        // Read the index.json file
        cy.readFile('cypress/fixtures/urls.json').then((data) => {
            // Extract URLs from the file
            const urls = data.urls

            // Iterate over each URL and visit it
            urls.forEach((url) => {
                cy.visit(url)
                waitForPageLoad()
                cy.url().should('eq', url)
                // })
            })
        })
    })
})
