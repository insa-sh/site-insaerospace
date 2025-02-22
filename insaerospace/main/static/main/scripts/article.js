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

        const articlesContainer = document.getElementById('articlesContainer');
        if (articlesContainer) {
            // Afficher l'article s'il existe
            if (!article) {
                articlesContainer.innerHTML = `
                    <div class="article">
                        <h2>Article introuvable</h2>
                        <p>L'article que vous cherchez n'existe pas.</p>
                    </div>
                `;
                return;
            } else {
                articlesContainer.innerHTML = `
                    <div class="article">
                        <h2>${article.title}</h2>
                        ${article.description ? `<p>${article.description}</p>` : ''}
                        <div>${Array.isArray(article.content)
                        ? article.content.map(item => item && item.body ? marked(item.body) : '').join('<br>')
                        : 'No content available'}</div>
                        ${article.author ? `<p><strong>Auteur:</strong> ${article.author.name}</p>` : ''}
                        <p><strong>Date:</strong> ${new Date(article.createdAt).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                        })}</p>
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