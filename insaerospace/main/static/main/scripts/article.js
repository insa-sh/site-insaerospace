import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
import { API_URL } from "./config.js";

const uploads_url = API_URL;
const DEFAULT_OG_IMAGE = '/static/images/sharing/og-image.png';

function resolveAssetUrl(url) {
    if (!url) {
        return '';
    }

    return url.startsWith('http') ? url : uploads_url + url;
}

function getMediaUrl(media) {
    if (!media) {
        return null;
    }

    return media.formats?.large?.url
        || media.formats?.medium?.url
        || media.formats?.small?.url
        || media.formats?.thumbnail?.url
        || media.url
        || null;
}

function getBlockText(block) {
    return (block.children || []).map(child => child.text || '').join('');
}

function renderContent(content) {
    if (!content) {
        return '<p class="messageErreur">Cet article est vide...</p>';
    }

    if (typeof content === 'string') {
        return marked(content);
    }

    if (Array.isArray(content)) {
        const html = content.map(block => {
            if (block.type === 'paragraph') {
                const text = getBlockText(block);
                return text ? '<p>' + text + '</p>' : '';
            }

            if (block.type === 'heading') {
                const level = Math.min(Math.max(block.level || 2, 2), 6);
                const text = getBlockText(block);
                return text ? '<h' + level + '>' + text + '</h' + level + '>' : '';
            }

            if (block.type === 'list') {
                const tag = block.format === 'ordered' ? 'ol' : 'ul';
                const items = (block.children || []).map(item => {
                    const text = getBlockText(item);
                    return text ? '<li>' + text + '</li>' : '';
                }).join('');
                return items ? '<' + tag + '>' + items + '</' + tag + '>' : '';
            }

            return '';
        }).join('');

        return html || '<p class="messageErreur">Cet article est vide...</p>';
    }

    return '<p class="messageErreur">Cet article est vide...</p>';
}

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
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        const article = Array.isArray(data.data) ? data.data[0] : null;
        // console.log('Fetched articles:', article);

        // définir le title de la page
        if (article) {
            document.title = `${article.title || articleSlug || 'Article sans titre'} | INSAerospace`;
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
                const coverUrl = getMediaUrl(article.cover);
                if (coverUrl) {
                    style_minature = `background: linear-gradient(-90deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.70) 100%), url('${resolveAssetUrl(coverUrl)}'); background-size: cover; background-position: center;`;
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
                            ${renderContent(article.content)}
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
                const ogImageUrl = getMediaUrl(article.cover);
                ogImg.setAttribute('content', ogImageUrl ? resolveAssetUrl(ogImageUrl) : DEFAULT_OG_IMAGE);
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