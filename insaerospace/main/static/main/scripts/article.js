import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

async function fetchArticles() {
    try {
        // Récupérer le slug de l'URL
        const urlParts = window.location.pathname.split('/');
        const parentSlug = urlParts[urlParts.length - 2]; // Assuming the slug is the second last part of the URL
        console.log('Parent slug:', parentSlug);

        // Modifier l'URL de la requête pour inclure le slug comme paramètre de requête
        const response = await fetch(`/api/articles/`);
        const data = await response.json();
        const articles = data.data;
        console.log('Fetched articles:', articles);

        if (Array.isArray(articles)) {
            const articlesContainer = document.getElementById('articlesContainer');
            if (articlesContainer) {
                // Filtrer l'article parent
                const parentArticle = articles.find(article => article.slug === parentSlug);
                console.log('Parent article:', parentArticle);

                // Filtrer les articles enfants
                const childArticles = articles.filter(article => article.category && article.category.slug === parentSlug);
                console.log('Child articles:', childArticles);

                // Afficher l'article parent suivi des articles enfants
                articlesContainer.innerHTML = `
                    ${parentArticle ? `
                        <div class="article">
                            <h2>${parentArticle.title}</h2>
                            <p>${parentArticle.description}</p>
                            <div>${Array.isArray(parentArticle.content)
                                ? parentArticle.content.map(item => item && item.body ? marked(item.body) : '').join('<br>')
                                : 'No content available'}</div>
                            <p><strong>Auteur:</strong> ${parentArticle.author ? parentArticle.author.name : 'Anonyme'}</p>
                            <p><strong>Date:</strong> ${new Date(parentArticle.createdAt).toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                            })}</p>
                        </div>
                    ` : ''}
                    ${childArticles.map(article => `
                        <div class="article">
                            <h2><a href="/nos-projets/${article.slug}/">${article.title}</a></h2>
                            <p>${article.description}</p>
                            <p><strong>Auteur:</strong> ${article.author ? article.author.name : 'Anonyme'}</p>
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
        } else {
            console.error('Expected an array but got:', articles);
        }
    } catch (error) {
        console.error('Error fetching articles:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchArticles);