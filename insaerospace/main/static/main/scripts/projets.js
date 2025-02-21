import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

async function fetchArticles() {
    try {
        const response = await fetch('/api/articles/');
        const data = await response.json();
        const articles = data.data;
        console.log(articles);
        if (Array.isArray(articles)) {
            const articlesContainer = document.getElementById('articles-container');
            articlesContainer.innerHTML = articles
                .filter(article => article.category === null) // Filtrer les articles dont la catégorie est null
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