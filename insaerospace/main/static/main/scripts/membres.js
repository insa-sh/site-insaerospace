// Modifier l'URL de la requête pour inclure un paramètre de requête pour les projets 

/*
FONCTIONNEMENT DU SCRIPT
1. On récupère tous les pôles
2. On récupère tous les rôles
3. On récupère tous les membres

4. Pour chaque pôle trié par ordre d'importance (propriété importance : entier):
    1. Si le pôle a des membres, on affiche le pôle ( si on trouve des membres dont le rôle appartient au pôle)
        1. Pour chaque membre trouvé par ordre d'importance de son rôle (propriété du rôle: importance : entier) puis par ordre alphbétique s'il y a plusieurs memrbes du même rôle:
            1. On affiche le membre (photo, nom, rôle, insta et linkedin si renseignés)

*/
const api_url = "http://localhost:1337";

function fetchMembres() {
    try {
        // Récupérer les pôles, les rôles et les membres
        const polesResponse = fetch(`/api/fetch_poles`);
        const rolesResponse = fetch(`/api/fetch_roles`);
        const membresResponse = fetch(`/api/fetch_membres`);

        // Attendre que toutes les réponses soient reçues
        Promise.all([polesResponse, rolesResponse, membresResponse])
            .then(responses => Promise.all(responses.map(response => response.json())))
            .then(([polesData, rolesData, membresData]) => {
                const poles = polesData.data;
                const roles = rolesData.data;
                const membres = membresData.data;

                console.log('Poles:', poles);
                console.log('Roles:', roles);
                console.log('Membres:', membres);

                // Trier les pôles par ordre d'importance croissant : plus l'importance est faible, plus le pôle est important
                poles.sort((a, b) => (a.importance || 0) - (b.importance || 0));

                console.log('Poles triés:', poles);

                // Afficher les pôles et les membres
                const membresContainer = document.getElementById('membresContainer');
                if (!membresContainer) {
                    console.error('membresContainer is null');
                    return;
                }

                membresContainer.innerHTML = poles.map(pole => {
                    // Filtrer les membres du pôle
                    // Si le membre a un rôle dont le pôle est le pôle actuel, on le garde
                    console.log('Pôle:', pole.nom_pole);
                    const membresDuPole = membres.filter(function(membre) {
                        if (!membre.role) return false; // Ne pas ajouter l'utilisateur si le rôle est manquant
                        var foundRole = roles.find(function(role) {
                            return role.slug === membre.role.slug; // On vérifie si le rôle du membre est le rôle actuel
                        });
                        if (!foundRole || !foundRole.pole_role) return false;
                        return foundRole.pole_role.slug === pole.slug; // On vérifie si le rôle du membre appartient au pôle actuel
                    });
                    // TODO: Le site plante si un user n'a pas de role. Impossible de définir le champ rôle comme obligatoire dans Strapi

                    console.log('Membres du pôle:', membresDuPole);

                    // Si le pôle n'a pas de membres, on ne l'affiche pas
                    if (membresDuPole.length === 0) {
                        return '';
                    }

                    // Trier les membres par ordre d'importance de leur rôle puis par ordre alphabétique
                    membresDuPole.sort((a, b) => {
                        // pour chaque rôle, on récupère l'importance du rôle du membre
                        const roleA = roles.find(function(role) {
                            return role.slug === a.role.slug; // vrai si le rôle du membre est le rôle actuel
                        });
                        const roleB = roles.find(function(role) {
                            return role.slug === b.role.slug; // vrai si le rôle du membre est le rôle actuel
                        });

                        // Si l'importance des rôles est différente, on trie par importance
                        if (roleA.importance !== roleB.importance) {
                            return roleA.importance - roleB.importance;
                        }

                        // Sinon, on trie par ordre alphabétique du nom des membres
                        return a.nom.localeCompare(b.nom);
                    });

                    console.log('Membres du pôle triés:', membresDuPole);

                    return `
                        <div class="pole">
                            <h2>${pole.nom_pole}</h2>
                            ${membresDuPole.map(membre => `
                                <div class="membre">
                                    <img src="${membre.photo_de_profil ? api_url + membre.photo_de_profil.url : 'default_profile_picture_url'}" alt="${membre.nom}">
                                    <h3>${membre.nom}</h3>
                                    <p>${roles.find(role => role.slug === membre.role.slug).titre}</p>
                                    ${membre.pseudo_insta ? `<a href="https://instagram.com/${membre.pseudo_insta}">Instagram</a>` : ''}
                                    ${membre.pseudo_linkedin ? `<a href="https://linkedin.com/in/${membre.pseudo_linkedin}">LinkedIn</a>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    `;
                }).join('');
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchMembres);