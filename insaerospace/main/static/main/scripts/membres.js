const api_url = "http://localhost:1337";

function fetchMembres() {
    try {
        function getEmojiAnimationUrl(roles, role_slug) {
            const role = roles.find(role => role.slug === role_slug);
            if (role && role.emoji_animation) {
                if (role.emoji_animation.formats.thumbnail.url) {
                    return api_url + role.emoji_animation.formats.thumbnail.url;
                } else {
                    return api_url + role.emoji_animation.url;
                }
            }
            return null;
        }

        // Récupérer les pôles, les rôles et les membres
        const polesResponse = fetch(`/api/fetch_poles`);
        const rolesResponse = fetch(`/api/fetch_roles`);
        const membresResponse = fetch(`/api/fetch_membres`);

        // Attendre que toutes les réponses soient reçues
        Promise.all([polesResponse, rolesResponse, membresResponse])
            .then(responses => {
                responses.forEach(response => {
                    if (!response.ok) {
                        throw new Error(response.status);
                    }
                });
                return Promise.all(responses.map(response => response.json()));
            })
            .then(([polesData, rolesData, membresData]) => {
                const poles = polesData.data;
                const roles = rolesData.data;
                const membres = membresData.data;

                // Trier les pôles par ordre d'importance croissant
                poles.sort((a, b) => (a.importance || 0) - (b.importance || 0));

                const membresContainer = document.getElementById('membresContainer');
                if (!membresContainer) {
                    console.error('membresContainer is null');
                    return;
                }

                membresContainer.innerHTML = poles.map(pole => {
                    const membresDuPole = membres.filter(function(membre) {
                        if (!membre.role) return false;
                        var foundRole = roles.find(function(role) {
                            return role.slug === membre.role.slug;
                        });
                        if (!foundRole || !foundRole.pole_role) return false;
                        return foundRole.pole_role.slug === pole.slug;
                    });

                    if (membresDuPole.length === 0) {
                        return '';
                    }

                    membresDuPole.sort((a, b) => {
                        const roleA = roles.find(function(role) {
                            return role.slug === a.role.slug;
                        });
                        const roleB = roles.find(function(role) {
                            return role.slug === b.role.slug;
                        });
                        if (roleA.importance !== roleB.importance) {
                            return roleA.importance - roleB.importance;
                        }
                        return a.nom.localeCompare(b.nom);
                    });

                    return `
                        <div class="pole">
                            <h2>${pole.nom_pole}</h2>
                            <div class="membres">
                            ${membresDuPole.map(membre => `
                                <div class="membre">
                                    <div class="photo-de-profil">
                                    <img src="${membre.photo_de_profil ? api_url + membre.photo_de_profil.url : 'http://localhost:1337/uploads/default_pp_a375f13862.png'}" alt="${membre.nom}">
                                    ${membre.role && membre.role.slug !== 'membre' && getEmojiAnimationUrl(roles, membre.role.slug) != null ? '<div class="emoji-box" src="'+getEmojiAnimationUrl(roles, membre.role.slug) +'"/><img class="emoji1" src="'+getEmojiAnimationUrl(roles, membre.role.slug) +'"/><img class="emoji2" src="'+getEmojiAnimationUrl(roles, membre.role.slug) +'"/><img class="emoji3" src="'+getEmojiAnimationUrl(roles, membre.role.slug) +'"/><img class="emoji4" src="'+getEmojiAnimationUrl(roles, membre.role.slug) +'"/><img class="emoji5" src="'+getEmojiAnimationUrl(roles, membre.role.slug) +'"/></div>' : ''}
                                    </div>
                                    <h3>${membre.nom}</h3>
                                    <p class="role">${roles.find(role => role.slug === membre.role.slug).titre}</p>
                                    ${membre.pseudo_insta || membre.pseudo_linkedin ? '<div class="reseaux">' : ''}
                                    ${membre.pseudo_insta ? `<a href="https://instagram.com/${membre.pseudo_insta}" target="_blank"><i class="fa-brands fa-instagram reseau-icon"></i></a>` : ''}
                                    ${membre.pseudo_linkedin ? `<a href="https://linkedin.com/in/${membre.pseudo_linkedin}" target="_blank"><i class="fa-brands fa-linkedin reseau-icon"></i></a>` : ''}
                                    ${membre.pseudo_insta || membre.pseudo_linkedin ? '</div>' : ''}
                                </div>
                            `).join('')}
                            </div>
                        </div>
                    `;
                }).join('');

                // ajouter la liste des membres sans rôle dans le "pole" membres
                membresContainer.innerHTML += `
                    <div class="pole">
                        <h2>Nos membres</h2>
                        <div class="membres">
                        ${(() => {
                            const membresSansRole = membres.filter(membre => !membre.role);
                            return membresSansRole.length > 0 ? membresSansRole.map(membre => `
                            <div class="membre-sans-role">
                                <div class="photo-de-profil">
                                    <i class="fa-solid fa-user-astronaut"></i>
                                </div>
                                <div class="infos">
                                    <h3>${membre.nom}</h3>
                                    ${membre.pseudo_insta || membre.pseudo_linkedin ? '<div class="reseaux">' : ''}
                                    ${membre.pseudo_insta ? `<a href="https://instagram.com/${membre.pseudo_insta}" target="_blank"><i class="fa-brands fa-instagram reseau-icon"></i></a>` : ''}
                                    ${membre.pseudo_linkedin ? `<a href="https://linkedin.com/in/${membre.pseudo_linkedin}" target="_blank"><i class="fa-brands fa-linkedin reseau-icon"></i></a>` : ''}
                                    ${membre.pseudo_insta || membre.pseudo_linkedin ? '</div>' : ''}
                                </div>
                            </div>
                            `).join('') : '<p class="messageErreur">Pas de membres à afficher</p>';
                        })()}
                        </div>
                    </div>
                `;
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                const membresContainer = document.getElementById('membresContainer');
                if (membresContainer) {
                    // S'il y a une erreur, afficher un message d'erreur
                    membresContainer.innerHTML = "<p>Oups, une erreur s'est produite... On n'arrive plus à trouver nos membres :`(</p>";
                    
                }
            });

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchMembres);
