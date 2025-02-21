import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

async function fetchArticles() {
    try {
        // Récupérer le slug de l'URL
        const urlParts = window.location.pathname.split('/');
        const parentSlug = urlParts[urlParts.length - 2]; // Assuming the slug is the second last part of the URL
        console.log('Parent slug:', parentSlug);

        // Modifier l'URL de la requête pour inclure le slug comme paramètre de requête
        const response = await fetch(`/api/fetch_articles?slug=${parentSlug}`);
        const data = await response.json();
        const { parent_article, child_articles } = data;
        console.log('Fetched articles:', { parent_article, child_articles });

        const articlesContainer = document.getElementById('articlesContainer');
        if (articlesContainer) {
            // Afficher l'article parent suivi des articles enfants
            articlesContainer.innerHTML = `
                ${parent_article ? `
                    <div class="article">
                        <h2>${parent_article.title}</h2>
                        ${parent_article.description ? `<p>${parent_article.description}</p>` : ''}
                        <div>${Array.isArray(parent_article.content)
                            ? parent_article.content.map(item => item && item.body ? marked(item.body) : '').join('<br>')
                            : 'No content available'}</div>
                        ${parent_article.author ? `<p><strong>Auteur:</strong> ${parent_article.author.name}</p>` : ''}
                        <p><strong>Date:</strong> ${new Date(parent_article.createdAt).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                        })}</p>
                    </div>
                ` : ''}
                ${child_articles.map(article => `
                    <div class="article">
                        <h2><a href="/nos-projets/${article.slug}/">${article.title}</a></h2>
                        ${article.description ? `<p>${article.description}</p>` : ''}
                        ${article.author ? `<p><strong>Auteur:</strong> ${article.author.name}</p>` : ''}
                        <p><strong>Date:</strong> ${new Date(article.createdAt).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                        })}</p>
                    </div>
                `).join('')}
            `;
        } else {
            console.error('articlesContainer is null');
        }
    } catch (error) {
        console.error('Error fetching articles:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchArticles);