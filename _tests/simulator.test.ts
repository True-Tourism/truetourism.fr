const languages = ['fr', 'en', 'es']
const defaultLanguage = 'fr'

describe('Simulator pages', () => {

    for (const language of languages) {

        it(`should return a valid response for the ${language} language`, async () => {

            const languageSeparator = language !== defaultLanguage ? `/${language}` : ''

            const url = `http://localhost:4000${languageSeparator}/simulator`

            const response = await fetch(url)

            expect(response.status).toBe(200)
        })
    }
})

