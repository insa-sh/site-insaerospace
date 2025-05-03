import { API_URL } from "./config.js";
const uploads_url = API_URL;

function fetchProjects() {
    try {
        fetch('/api/fetch_projets')
            .then(response => response.json())
            .then(data => {
                const projets = data.data;
                // console.log('Fetched projets:', projets);

                const articlesContainer = document.getElementById('projectsContainer');
                if (!articlesContainer) {
                    console.error('projectsContainer is null');
                    return;
                }

                if (Array.isArray(projets)) {
                    if (projets.length === 0) {
                        articlesContainer.innerHTML = "Aucun projet à montrer pour le moment ;)";
                    } else {
                        articlesContainer.innerHTML = projets
                            .map(projet => {
                                const date = new Date(projet.createdAt);
                                // console.log(projet.miniature);
                                let style_miniature_projet = "";
                                if (projet.miniature != null) {
                                    let miniature_url = projet.miniature.formats.large.url;
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
                    }
                } else {
                    console.error('Expected an array but got:', projets);
                    articlesContainer.innerHTML = "<p class='messageErreur'>Aahhh, <b>on a plein de super projets !</b> On n'arrive juste pas à remettre la main dessus maintenant... <br>Retrouve-nous sur Instagram : <a class='text-link' href='https://instagram.com/insaerospace/' target='_blank'>@insaerospace</a></p>";
                }
            })
            .catch(error => {
                console.error('Error fetching projets:', error);
                const articlesContainer = document.getElementById('projectsContainer');
                if (articlesContainer) {
                    articlesContainer.innerHTML = "<p class='messageErreur'>Aahhh, <b>on a plein de super projets !</b> On n'arrive juste pas à remettre la main dessus maintenant... <br>Retrouve-nous sur Instagram : <a class='text-link' href='https://instagram.com/insaerospace/' target='_blank'>@insaerospace</a></p>";
                }
            });

    } catch (error) {
        console.error('Error fetching projets:', error);
        const articlesContainer = document.getElementById('projectsContainer');
        if (articlesContainer) {
            articlesContainer.innerHTML = "<p class='messageErreur'>Aahhh, <b>on a plein de super projets !</b> On n'arrive juste pas à remettre la main dessus maintenant... <br>Retrouve-nous sur Instagram : <a class='text-link' href='https://instagram.com/insaerospace/' target='_blank'>@insaerospace</a></p>";
        }
    }
}

document.addEventListener('DOMContentLoaded', fetchProjects);