import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

async function fetchArticles() {
    try {
        // Modifier l'URL de la requête pour inclure un paramètre de requête pour les articles sans catégorie
        const response = await fetch('/api/projets/');
        const data = await response.json();
        const articles = data.data;
        console.log('Fetched articles:', articles);

        if (Array.isArray(articles)) {
            const articlesContainer = document.getElementById('articles-container');
            articlesContainer.innerHTML = articles
                .map(article => {
                    const date = new Date(article.createdAt);
                    const formattedDate = date.toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    });
                    return `
                        <div class="article">
                            <h2><a href="/nos-projets/${article.slug}/">${article.title}</a></h2>
                            <p>${article.description}</p>
                            <p><strong>Auteur:</strong> ${article.author ? article.author.name : 'Anonyme'}</p>
                            <p><strong>Date:</strong> ${formattedDate}</p>
                        </div>
                    `;
                }).join('');
        } else {
            console.error('Expected an array but got:', articles);
        }
    } catch (error) {
        console.error('Error fetching articles:', error);
    }
}

fetchArticles();