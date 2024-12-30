


function toggleNavMenu(order = undefined) {
    var navMenu = document.getElementById("nav-menu");
    var navMenuButton = document.getElementById("hamburger-button");
    const closedIcon = "<i class='fas fa-bars'></i>";
    const openIcon = "<i class='fas fa-xmark'></i>";

    if (order == undefined) {
        if (!navMenu.classList.contains("open") && !navMenu.classList.contains("closed")) {
            toggleNavMenu("open");

        } else {
            navMenu.classList.toggle("open");
            navMenu.classList.toggle("closed");
            navMenuButton.innerHTML = navMenu.classList.contains("open") ? openIcon : closedIcon;  // première option si vrai seconde sinon        

        }
    } else if (order == "open") {
        navMenu.classList.add("open");
        navMenu.classList.remove("closed");
        navMenuButton.innerHTML = openIcon;

    } else if (order == "close") {
        navMenu.classList.add("closed");
        navMenu.classList.remove("open");
        navMenuButton.innerHTML = closedIcon;

    }
}



// add event listener to close the menu if the width of the screen is changed
window.addEventListener('resize', function () {
    var navMenu = document.getElementById("nav-menu");

    if (navMenu.classList.contains("open")) {
        toggleNavMenu("close");
    }
});