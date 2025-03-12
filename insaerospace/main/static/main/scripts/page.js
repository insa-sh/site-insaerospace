import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

async function fetchContact() {
    try {
        const response = await fetch('/api/fetch_contact');
        const data = await response.json();
        const contact = data.data;

        // Update the page title
        if (contact && contact.title) {
            document.title = `${contact.title} | INSAerospace`;
        } else {
            document.title = `Contact | INSAerospace`;
        }

        // Get the container where contact data will be displayed
        const contactContainer = document.getElementById('contactContainer');
        if (contactContainer) {
            if (contact && contact.contenu) {
                contactContainer.innerHTML = `
                    <div class="contact">
                        <h1>${contact.title || 'Contact'}</h1>
                        <div class="content">${marked(contact.contenu)}</div>
                    </div>
                `;
            } else {
                contactContainer.innerHTML = `
                    <div class="contact">
                        <h1>Contact introuvable</h1>
                        <p>Le contenu de la page contact n'est pas disponible.</p>
                    </div>
                `;
            }
        } else {
            console.error("Element with id 'contactContainer' not found.");
        }
    } catch (error) {
        console.error('Error fetching contact:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchContact);