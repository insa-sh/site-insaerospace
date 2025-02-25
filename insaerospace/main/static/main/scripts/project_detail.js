// import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

const uploads_url = "http://localhost:1337";

async function fetchArticles() {
    try {
        // Récupérer le slug de l'URL
        const urlParts = window.location.pathname.split('/');
        const projectSlug = urlParts[urlParts.length - 2]; // L'avant dernier car le dernier est vide
        console.log('Project slug:', projectSlug);

        // par défaut, un / est rajouté en fin d'url donc le dernier element du tableau est ""

        // Modifier l'URL de la requête pour inclure le slug comme paramètre de requête
        const response = await fetch(`/api/fetch_articles?projet=${projectSlug}`);
        const data = await response.json();

        const articles = data.data;
        console.log('Articles de la catégorie:', articles);
        const articlesContainer = document.getElementById('articlesContainer');
        const projectDetailContainer = document.getElementById('projectDetailContainer');


        // récupérer le projet à partir du slug
        // on pourrait récupérer le projet à partir des articles mais s'il n'y a pas d'articles, on ne pourrait pas afficher le bandeau
        // de présentation du projet.
        const response_projet = await fetch(`/api/fetch_projets?slug=${projectSlug}`);
        const project_data = await response_projet.json();
        const projet = project_data.data[0];
        console.log(projet)







        // définir le title de la page
        if (articles && articles.length > 0) {
            document.title = `${articles[0]["projet"]["nom"] + " | INSAerospace" || projectSlug + " | INSAerospace" || 'Projet sans titre | INSAerospace'}`;
        } else {
            document.title = `${projectSlug + " | INSAerospace" || 'Projet sans titre | INSAerospace'}`;
        }

        if (projectDetailContainer) {
            // on utilise le premier article de la liste pour g
            console.log("project details generating")
            // projectDetailContainer.style.background = "url(${projet["miniature"]["url"]})"; // for later


            // date: si le dernier article remonte à plus d'un an, alors on affiche date 1er article - date dernier article
            // sinon on affiche depuis mois année du premier article
            const dateOptionsFull = { month: 'long', year: 'numeric' };
            const firstArticleDate = new Date(articles[0].createdAt);
            const lastArticleDate = new Date(articles[articles.length - 1].createdAt);
            const diffTime = Math.abs(lastArticleDate - firstArticleDate);
            const diffDays = diffTime / (1000 * 60 * 60 * 24);
            let dateHtml = '';
            if (diffDays > 365) {
                dateHtml = `<p class="date"><i class="fa-solid fa-clock"></i> ${firstArticleDate.toLocaleDateString('fr-FR', dateOptionsFull)} - ${lastArticleDate.toLocaleDateString('fr-FR', dateOptionsFull)}</p>`;
            } else {
                dateHtml = `<p class="date"><i class="fa-solid fa-clock"></i> Depuis ${firstArticleDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</p>`;
            }

            // arrière plan - miniature du projet
            let style_miniature_projet = "";
            if (projet.miniature != null) {
                let miniature_url = uploads_url + projet.miniature.url;
                // style_miniature_projet = `background: linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.90) 100%), url('${uploads_url + miniature_url}'); background-size: cover; background-position: center;`;

                // Mise à jour du style de background avec l'URL correcte de la miniature
                projectDetailContainer.style.background = `linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.90) 100%), url('${miniature_url}')`;
                // projectDetailContainer.style.backgroundSize = 'cover';
                // projectDetailContainer.style.backgroundPosition = 'center';
                console.log("miniature url", miniature_url)
            }

            projectDetailContainer.innerHTML = `
                <h1>${projet["nom"]}</h1>
                ${projet["description"] ? `<p class="description">${projet["description"]}</p>` : ''}
                ${dateHtml}
                
            
            `

        }
        if (articlesContainer) {
            // Afficher tous les articles
            articlesContainer.innerHTML = articles.map(article => {
                let style_minature = "";
                if (article.cover != null) {
                    let miniature_url = uploads_url + article.cover.url;
                    style_minature = `linear-gradient(-90deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.70) 100%), url('${miniature_url}'); background-size: cover; background-position: center;`
                }
                return `
                    <a class="article" href="/nos-projets/${projectSlug}/${article.slug}/" 
                        style="background: ${style_minature};">

                        <h2>${article.title || 'Sans titre'}</h2>
                        ${article.description ? `<p class="description">${article.description}</p>` : ''}
                        <p><strong></strong><i class="fa-solid fa-clock"></i>  ${new Date(article.createdAt).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                })}</p>
                    </a>
                `;
            }).join('');


            // s'il n'y a pas d'articles 
            if (articles.length === 0) {
                articlesContainer.innerHTML = `
                    <div class="article">
                        <h2>Aucun article trouvé</h2>
                        <p>Il n'y a pas d'articles dans cette catégorie.</p>
                    </div>
                `;
            }
        } else {
            console.error('articlesContainer is null');
        }
    } catch (error) {
        console.error('Error fetching articles:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchArticles);