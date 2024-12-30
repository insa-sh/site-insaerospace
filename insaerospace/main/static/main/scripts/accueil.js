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




// ajout de l'event listener au chargeent du caroussel
function addAutoScroll() {
    setInterval(scrollToNext, 7000);

}


// onload 
window.onload = addAutoScroll();