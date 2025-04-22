/*
Ce fichier gère les fonctions suivantes
- Animation des nombres
    - Vérifier si un élément est visible dans la fenêtre d'affichage
    - Démarrer l'animation des nombres
    - 
- Caroussel

*/




// ####################### ANIMATION DES NOMBRES #######################
// Fonction pour vérifier si un élément est visible dans la fenêtre d'affichage
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Fonction pour démarrer l'animation des nombres
function startNumberAnimation() {
    $('.nombre').each(function() {
        if (isElementInViewport(this) && !$(this).hasClass('animated')) {
            // Démarrer l'animation des nombres en utilisant le plugin jQuery.rollNumber
            $(this).rollNumber({
                number: $(this).data('number'),
                fontStyle: {
                    fontSize: parseInt($(this).css('font-size')), // Récupérer la taille de la police actuelle de l'élément au lieu de la définir manuellement dans le JS séparément
                    color: '#FFF',
                    fontFamily: 'Raleway',
                }
            });
            $(this).addClass('animated'); // Ajouter une classe pour indiquer que l'animation a déjà eu lieu
        }
    });
}


// Animation des stats
$(document).ready(function() {
    $(window).on('scroll', function() {
        startNumberAnimation();
    });

    // Démarrer l'animation au chargement si les éléments sont déjà visibles
    startNumberAnimation();
});




// ####################### CAROUSEL #######################




// scroller au suivant (snap)
function scrollToNext() {
    var container = document.querySelector('.caroussel');
    var current = container.scrollLeft;

    var next = current + document.body.clientWidth;

    if (next > container.scrollWidth - document.body.clientWidth) {
        container.scrollTo({
            left: 0,
            behavior: 'smooth'
        });
    } else {
        container.scrollTo({
            left: next,
            behavior: 'smooth'
        });
    }
}


// ajout de l'event listener au chargement du caroussel
function addAutoScroll() {
    setInterval(scrollToNext, 7000);
}

// Fetch images from the API and add them to the carousel
function loadCarousselImages() {
    fetch('api/fetch_caroussel')
        .then(response => response.json())
        .then(data => {
            const carousselContainer = document.getElementById('caroussel-container');
            if (data.images && data.images.length > 0) {
                // Effacer le contenu initial uniquement s'il y a des images
                carousselContainer.innerHTML = '';
                console.log("supprimé");
                data.images.forEach(imageData => {
                    const div = document.createElement('div');
                    div.className = 'caroussel-image';
                    carousselContainer.appendChild(div);
                    console.log("élément créé sans image");

                    // Créer un objet Image pour précharger l'image
                    const imgPreloader = new Image();
                    imgPreloader.onload = function() {
                        // Une fois l'image chargée, ajouter l'image de fond et déclencher l'animation
                        div.style.backgroundImage = `url(${imageData.url})`;
                        div.classList.add('fade-in');
                        carousselContainer.classList.remove('loading'); // si la classe y est encore, la retirer
                        console.log("affiché");
                    };
                    imgPreloader.onerror = function() {
                        console.error("Erreur lors du chargement de l'image", imageData.url);
                    };
                    // Débuter le téléchargement de l'image
                    imgPreloader.src = imageData.url;
                });
            }
            addAutoScroll(); // Démarrer le défilement automatique après le chargement des images
        })
        .catch(error => console.error('Error fetching caroussel images:', error));
}

// onload 
window.onload = loadCarousselImages;

