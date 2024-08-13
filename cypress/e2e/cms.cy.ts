import { Fixtures } from '../types/fixtures'

let fixture: Fixtures
let staticUrl = []

Cypress.config('baseUrl', Cypress.config('baseUrl'))

describe('SuperATV', () => {
    beforeEach(() => {
        cy.intercept({ resourceType: /xhr|fetch/ }, { log: false })
        cy.fixture('index.json').then((fixtureData) => {
            fixture = fixtureData
            staticUrl = fixtureData?.urls
            cy.visit('')
            cy.wait(500)

            Cypress.on('uncaught:exception', () => {
                return false
            })
        })
    })

    it.only('Open CMS URLs', () => {
        const cmsurls = [
            'https://www.superatv.com/contact-us',
            'https://www.superatv.com/rewards',
            'https://www.superatv.com/sms-signup',
            'https://www.superatv.com/faq',
            'https://www.superatv.com/frontline-5-military-first-responders-discount',
            'https://www.superatv.com/klarna-financing',
            'https://www.superatv.com/returns-policy',
            'https://www.superatv.com/warranty-policy',
            'https://www.superatv.com/shipping-information',
            'https://www.superatv.com/careers',
            'https://www.superatv.com/about-us',
            'https://www.superatv.com/utv-events',
            'https://www.superatv.com/dealership-information',
            'https://www.superatv.com/shop/brands-we-trust',
            'https://www.superatv.com/offroad-atlas',
            'https://www.superatv.com/offroad-atlas/category/how-to',
            'https://www.superatv.com/virtual-mechanic',
            'https://www.superatv.com/onx-offroad-partnership',
            'https://www.superatv.com/shop/canam/defender',
            'https://www.superatv.com/2500-lb-utv-atv-winch-superatv',
            'https://www.superatv.com/shop/canam/defender/defender-hd10'
        ]

        cmsurls.forEach((url) => {
            cy.visit(url)

            cy.url().should('eq', url)
        })
    })
})
