import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

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
        if (articlesContainer) {
            // Afficher tous les articles
            articlesContainer.innerHTML = articles.map(article => {
                
                return `
                    <a class="article" href="/nos-projets/${projectSlug}/${article.slug}/">
                        <h2>${article.title || 'Sans titre'}</h2>
                        ${article.description ? `<p>${article.description}</p>` : ''}
                        <p><strong></strong> ${new Date(article.createdAt).toLocaleDateString('fr-FR', {
                            month: 'long',
                            year: 'numeric'
                        })}</p>
                    </a>
                `;
            }).join('');
        } else {
            console.error('articlesContainer is null');
        }
    } catch (error) {
        console.error('Error fetching articles:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchArticles);