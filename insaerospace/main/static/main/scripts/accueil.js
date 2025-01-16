// scroller au suivant (snap)
function scrollToNext() {
    var container = document.querySelector('.caroussel');
    var current = container.scrollLeft;

    // console.log("current = "+current);
    // console.log("next = current + window.innerWidth = " + (current + document.body.clientWidth) + " = " + current + "+ " + document.body.clientWidth);

    var next = current + document.body.clientWidth;

    // console.log("On continue si next < container.scrollWidth - window.innerWidth : \n"+(container.scrollWidth - document.body.clientWidth)+"= "+container.scrollWidth+" - "+window.innerWidth); 

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
            $(this).rollNumber({
                number: $(this).data('number'),
                fontStyle: {
                    fontSize: 48,
                    color: '#FFF',
                    fontFamily: 'Railway',
                }
            });
            $(this).addClass('animated'); // Ajouter une classe pour indiquer que l'animation a déjà eu lieu
        }
    });
}

// ajout de l'event listener au chargeent du caroussel
function addAutoScroll() {
    setInterval(scrollToNext, 7000);
}

// onload 
window.onload = addAutoScroll();

// Animation des stats
$(document).ready(function() {
    $(window).on('scroll', function() {
        startNumberAnimation();
    });

    // Démarrer l'animation au chargement si les éléments sont déjà visibles
    startNumberAnimation();
});
