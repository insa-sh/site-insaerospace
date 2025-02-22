const uploads_url = "http://localhost:1337/api/upload/";
async function fetchProjects() {
    try {
        // Modifier l'URL de la requête pour inclure un paramètre de requête pour les projets 

        // Récupérer les projets (vides et non-vides sans distinction)
        const response = await fetch('/api/fetch_projets');
        const data = await response.json();
        const projets = data.data;
        console.log('Fetched projets:', projets);

        if (Array.isArray(projets)) {
            const articlesContainer = document.getElementById('articles-container');
            articlesContainer.innerHTML = projets
                .map(projet => {
                    const date = new Date(projet.createdAt);
                    console.log(projet.miniature);
                    const formattedDate = date.toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    });
                    let miniature_url = "";
                    if (projet.miniature != null) {
                        miniature_url = projet.miniature.url;
                    }
                    return `
                        <div class="projet" style="background: url('${uploads_url + miniature_url}');">  
                            <h2><a href="/nos-projets/${projet.slug}/">${projet.nom}</a></h2>
                            ${projet.description ? `<p>${projet.description}</p>` : ''}
                            <p><strong>Date:</strong> ${formattedDate}</p>
                        </div>
                    `;
                }).join('');
        } else {
            console.error('Expected an array but got:', projets);
        }
    } catch (error) {
        console.error('Error fetching projets:', error);
    }
}

fetchProjects();