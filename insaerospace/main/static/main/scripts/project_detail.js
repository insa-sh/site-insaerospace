const uploads_url = "http://localhost:1337";

async function fetchArticles() {
    try {
        const urlParts = window.location.pathname.split('/');
        const projectSlug = urlParts[urlParts.length - 2];
        // console.log('Project slug:', projectSlug);

        const response = await fetch(`/api/fetch_articles?projet=${projectSlug}`);
        const data = await response.json();
        const articles = data.data;
        // console.log('Articles de la catégorie:', articles);

        const articlesContainer = document.getElementById('articlesContainer');
        const projectDetailContainer = document.getElementById('projectDetailContainer');

        const response_projet = await fetch(`/api/fetch_projets?slug=${projectSlug}`);
        // Check if the project detail API call was successful
        if (!response_projet.ok) {
            if (projectDetailContainer) {
                projectDetailContainer.innerHTML = `<p class="error">Erreur: impossible de récupérer le détail du projet (API indisponible).</p>`;
            }
            return;
        }
        const project_data = await response_projet.json();
        if (!project_data.data || project_data.data.length === 0) {
            if (projectDetailContainer) {
                projectDetailContainer.innerHTML = `<p class="error">Erreur: projet introuvable.</p>`;
                // renvoyer 503
            }
            return;
        }
        const projet = project_data.data[0];
        // console.log(projet);

        if (articles && articles.length > 0) {
            document.title = `${articles[0]["projet"]["nom"] || projectSlug} | INSAerospace`;
        } else {
            document.title = `${projectSlug} | INSAerospace`;
        }

        if (projectDetailContainer) {
            // Empty dateHtml by default
            let dateHtml = '';

            // Only calculate the dates if there is at least one article
            if (articles && articles.length > 0) {
                const dateOptionsFull = { month: 'long', year: 'numeric' };
                const firstArticleDate = new Date(articles[0].createdAt);
                const lastArticleDate = new Date(articles[articles.length - 1].createdAt);
                const diffTime = Math.abs(lastArticleDate - firstArticleDate);
                const diffDays = diffTime / (1000 * 60 * 60 * 24);
                if (diffDays > 365) {
                    dateHtml = `<p class="date"><i class="fa-solid fa-clock"></i> ${firstArticleDate.toLocaleDateString('fr-FR', dateOptionsFull)} - ${lastArticleDate.toLocaleDateString('fr-FR', dateOptionsFull)}</p>`;
                } else {
                    dateHtml = `<p class="date"><i class="fa-solid fa-clock"></i> Depuis ${firstArticleDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</p>`;
                }
            }

            if (projet.miniature != null) {
                let miniature_url = uploads_url + projet.miniature.url;
                projectDetailContainer.style.backgroundImage = `linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.90) 100%), url('${miniature_url}')`;
                // console.log("miniature url", miniature_url);
            }

            projectDetailContainer.innerHTML = `
                <h1>${projet.nom}</h1>
                ${projet.description ? `<p class="description">${projet.description}</p>` : ''}
                ${dateHtml}
            `;
        }

        if (articlesContainer) {
            if (articles && articles.length > 0) {
                articlesContainer.innerHTML = articles.map(article => {
                    let style_minature = "";
                    if (article.cover != null) {
                        let miniature_url = uploads_url + article.cover.url;
                        style_minature = `background-image: linear-gradient(-90deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.70) 100%), url('${miniature_url}');`
                    }
                    return `
                        <a class="article" href="/nos-projets/${projectSlug}/${article.slug}/" 
                            style="${style_minature};">
                            <h2>${article.title || 'Sans titre'}</h2>
                            ${article.description ? `<p class="description">${article.description}</p>` : ''}
                            <p><i class="fa-solid fa-clock"></i>  ${new Date(article.createdAt).toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                            })}</p>
                        </a>
                    `;
                }).join('');
            } else {
                // If no articles, do not display any message
                articlesContainer.innerHTML = `<p class="messageErreur">Ce projet n'a pas encore d'articles.</p>`;
            }
        } else {
            console.error('articlesContainer is null');
        }
    } catch (error) {
        console.error('Error fetching articles:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchArticles);
