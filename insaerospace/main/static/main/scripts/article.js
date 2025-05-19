import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
import { API_URL } from "./config.js";

const uploads_url = API_URL;

async function fetchArticles() {
    try {
        // Récupérer le slug de l'URL
        const urlParts = window.location.pathname.split('/');
        const articleSlug = urlParts[urlParts.length - 2]; // L'avant dernier car le dernier est vide
        const projectSlug = urlParts[urlParts.length - 3]; // Le slug du projet
        // console.log('Article:', articleSlug);
        // console.log('Projet:', projectSlug);

        // par défaut, un / est rajouté en fin d'url donc le dernier element du tableau est ""

        // Modifier l'URL de la requête pour inclure le slug comme paramètre de requête
        const response = await fetch(`/api/fetch_articles?slug=${articleSlug}&projet=${projectSlug}`);
        const data = await response.json();
        const article = data.data[0];
        // console.log('Fetched articles:', article);

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
                // miniature background
                let style_minature = "";
                if (article.cover != null) {
                    let miniature_url = uploads_url + article.cover.url;
                    style_minature = `background: linear-gradient(-90deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.70) 100%), url('${miniature_url}'); background-size: cover; background-position: center;`
                    style_minature = `background: linear-gradient(-90deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.70) 100%), url('${miniature_url}'); background-size: cover; background-position: center;`
                    // console.log(style_minature);
                }

                articlesContainer.innerHTML = `
                    <div class="article">
                        <div class="article-data" style="${style_minature}">
                            <h1>${article.title}</h1>
                            ${article.description ? `<p class="description">${article.description}</p>` : ''}
                            ${article.author ? `<p class="auteur">${article.author.name}</p>` : ''}
                            <p class="date"><i class="fa-solid fa-clock"></i> ${new Date(article.createdAt).toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                            })}</p>
                        </div>
                        <div class='article-body'>
                            ${article.content ? marked(article.content) : '<p class="messageErreur">Cet article est vide...</p>'}
                        </div>
                    </div>
                `;
                // Ajout dynamique des balises meta pour le SEO et le partage
                const head = document.head;
                // Meta description
                let metaDesc = document.querySelector('meta[name="description"]');
                if (!metaDesc) {
                    metaDesc = document.createElement('meta');
                    metaDesc.setAttribute('name', 'description');
                    head.appendChild(metaDesc);
                }
                metaDesc.setAttribute('content', article.description || article.title || 'INSAerospace');
                // OG title
                let ogTitle = document.querySelector('meta[property="og:title"]');
                if (!ogTitle) {
                    ogTitle = document.createElement('meta');
                    ogTitle.setAttribute('property', 'og:title');
                    head.appendChild(ogTitle);
                }
                ogTitle.setAttribute('content', article.title || 'INSAerospace');
                // OG description
                let ogDesc = document.querySelector('meta[property="og:description"]');
                if (!ogDesc) {
                    ogDesc = document.createElement('meta');
                    ogDesc.setAttribute('property', 'og:description');
                    head.appendChild(ogDesc);
                }
                ogDesc.setAttribute('content', article.description || article.title || 'INSAerospace');
                // OG image
                let ogImg = document.querySelector('meta[property="og:image"]');
                if (!ogImg) {
                    ogImg = document.createElement('meta');
                    ogImg.setAttribute('property', 'og:image');
                    head.appendChild(ogImg);
                }
                if (article.cover && article.cover.url) {
                    ogImg.setAttribute('content', uploads_url + article.cover.url);
                } else {
                    ogImg.setAttribute('content', '/static/images/sharing/og-image.png');
                }
                // OG url
                let ogUrl = document.querySelector('meta[property="og:url"]');
                if (!ogUrl) {
                    ogUrl = document.createElement('meta');
                    ogUrl.setAttribute('property', 'og:url');
                    head.appendChild(ogUrl);
                }
                ogUrl.setAttribute('content', window.location.href);
                // OG type
                let ogType = document.querySelector('meta[property="og:type"]');
                if (!ogType) {
                    ogType = document.createElement('meta');
                    ogType.setAttribute('property', 'og:type');
                    head.appendChild(ogType);
                }
                ogType.setAttribute('content', 'article');
                // OG site_name
                let ogSite = document.querySelector('meta[property="og:site_name"]');
                if (!ogSite) {
                    ogSite = document.createElement('meta');
                    ogSite.setAttribute('property', 'og:site_name');
                    head.appendChild(ogSite);
                }
                ogSite.setAttribute('content', 'INSAerospace');
            }
        } else {
            console.error('articlesContainer is null');
        }
    } catch (error) {
        console.error('Error fetching articles:', error);
        const articlesContainer = document.getElementById('singleArticleContainer');
        if (articlesContainer) {
            articlesContainer.innerHTML = `
                <div class="article">
                    <h1>Erreur</h1>
                    <p>L'API est indisponible. Veuillez réessayer ultérieurement.</p>
                </div>
            `;
        }
    }
}

document.addEventListener('DOMContentLoaded', fetchArticles);