import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

async function fetchArticles() {
    try {
        // Récupérer le slug de l'URL
        const urlParts = window.location.pathname.split('/');
        const articleSlug = urlParts[urlParts.length - 2]; // L'avant dernier car le dernier est vide
        const projectSlug = urlParts[urlParts.length - 3]; // Le slug du projet
        console.log('Article:', articleSlug);
        console.log('Projet:', projectSlug);

        // par défaut, un / est rajouté en fin d'url donc le dernier element du tableau est ""

        // Modifier l'URL de la requête pour inclure le slug comme paramètre de requête
        const response = await fetch(`/api/fetch_articles?slug=${articleSlug}&projet=${projectSlug}`);
        const data = await response.json();
        const article = data.data[0];
        console.log('Fetched articles:', article);

        // définir le title de la page
        if (article) {
            document.title = `${article["title"] + " | INSAerospace" || articleSlug + " | INSAerospace" || 'Projet sans titre | INSAerospace'}`;
        } else {
            document.title = `${articleSlug + " | INSAerospace" || 'Article sans titre | INSAerospace'}`;
        }


        const articlesContainer = document.getElementById('singleArticleContainer');
        if (articlesContainer) {
            // Afficher l'article s'il existe
            if (!article) {
                articlesContainer.innerHTML = `
                    <div class="article">
                        <h1>Article introuvable</h1>
                        <p>L'article que vous cherchez n'existe pas.</p>
                    </div>
                `;
                return;
            } else {
                articlesContainer.innerHTML = `
                    <div class="article">
                        <div class="article-data">
                        <h1>${article.title}</h1>
                        ${article.description ? `<p class="description">${article.description}</p>` : ''}
                        ${article.author ? `<p class="auteur">${article.author.name}</p>` : ''}
                        <p class="date"><i class="fa-solid fa-clock"></i>  ${new Date(article.createdAt).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                })}</p>
                        </div>
                        <div id='article-body'>${Array.isArray(article.content)
                        ? article.content.map(item => item && item.body ? marked(item.body) : '').join('<br>')
                        : 'Contenu indisponible'}</div>
                    </div>
                `
            }
        } else {
            console.error('articlesContainer is null');
        }
    } catch (error) {
        console.error('Error fetching articles:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchArticles);