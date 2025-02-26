const uploads_url = "http://localhost:1337";

function fetchProjects() {
    try {
        // Modifier l'URL de la requête pour inclure un paramètre de requête pour les projets 

        // Récupérer les projets (vides et non-vides sans distinction)
        fetch('/api/fetch_projets')
            .then(response => response.json())
            .then(data => {
                const projets = data.data;
                console.log('Fetched projets:', projets);

                const articlesContainer = document.getElementById('projectsContainer');
                if (!articlesContainer) {
                    console.error('projectsContainer is null');
                    return;
                }


                if (Array.isArray(projets)) {
                    articlesContainer.innerHTML = projets
                        .map(projet => {
                            const date = new Date(projet.createdAt);
                            console.log(projet.miniature);
                            let style_miniature_projet = "";
                            if (projet.miniature != null) {
                                let miniature_url = projet.miniature.url;
                                style_miniature_projet = `background-image: linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.90) 100%), url('${uploads_url + miniature_url}');`;
                            }
                             
                            return `
                                <a class="projet" href="/nos-projets/${projet.slug}/" 
                                   style="${style_miniature_projet}">  
                                    <h2>${projet.nom}</h2>
                                    ${projet.description ? `<p class="description">${projet.description}</p>` : ''}
                                </a>
                            `;
                        }).join('');
                } else {
                    console.error('Expected an array but got:', projets);
                }
            })
            .catch(error => {
                console.error('Error fetching projets:', error);
            });

    } catch (error) {
        console.error('Error fetching projets:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchProjects);