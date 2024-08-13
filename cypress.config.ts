import { defineConfig } from 'cypress'

export default defineConfig({
    projectId: 'satv-automation',
    fixturesFolder: 'cypress/fixtures',
    e2e: {
        // baseUrl: 'https://pylotstage.superatv.com/',
        //  baseUrl: 'https://pylotprod.superatv.com/',
        baseUrl: 'https://www.superatv.com/',
        defaultCommandTimeout: 15000, // 10s
        pageLoadTimeout: 30000, // 15s
        viewportWidth: 1920,
        viewportHeight: 868,
        supportFile: 'cypress/support/e2e.ts',
        specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}'
    },
    retries: {
        // Default is 0
        runMode: 2,
        openMode: 1
    },
    experimentalMemoryManagement: false,
    numTestsKeptInMemory: 0,
    // Mochawesome reporter configuration
    reporter: 'mochawesome',
    reporterOptions: {
        reportDir: 'cypress/reports',
        overwrite: false,
        html: true,
        json: false
    }
})
