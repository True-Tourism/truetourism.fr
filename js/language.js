let currentLanguage = navigator.language;

function updateContent(language) {
    fetch(`assets/languages/${language}.json`)
        .then(response => response.json())
        .then(data => {
            const ids = [
                'header-text',
                'subtitle',
                'title-1',
                'description-1',
                'title-2',
                'description-2',
                'title-3',
                'description-3',
                'legal'
            ]

            for (const id of ids) {
                const element = document.querySelector(`#${id}`);
                if (!element) {
                    console.warn(`Element with id ${id} not found`);
                    continue;
                }

                element.textContent = data[id];
            }

            const sources = [
                'app-store',
                'google-play'
            ]

            for (const source of sources) {
                const element = document.querySelector(`#${source}`);
                if (!element) {
                    console.warn(`Element with id ${source} not found`);
                    continue;
                }

                element.src = data[source];
            }
        })
        .catch(error => console.error('Error fetching JSON:', error));
}

function switchLanguage(language) {
    currentLanguage = language;
    updateContent(currentLanguage);
}

updateContent(currentLanguage);
