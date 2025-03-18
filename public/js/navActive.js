
const navLink = document.querySelectorAll('.nav-link');
const navbarNav = document.querySelectorAll('.navbar-nav');
const navbarToggler = document.querySelectorAll('.navbar-toggler');
const navBrand = document.querySelectorAll('.nav-reading-bliss-text');
const navbar = document.querySelectorAll('.navbar');
const pathName = window.location.pathname;

// console.log(pathName,"--pathName")
navLink.forEach(navLinkElement => {
    const navLinkPathName = navLinkElement?.href ? new URL(navLinkElement?.href)?.pathname : window.location.pathname;
    if((navLinkPathName && pathName === navLinkPathName)) {
        navLinkElement.classList.add('active');
    }
})

navbar.forEach(navbarElement => {
    const isNavTransparent = navbarElement.getAttribute('data-bs-whatever');
    const parseElement = JSON.parse(isNavTransparent)
    navBrand.forEach(navBrandElement => {
        if(parseElement === 'true' || parseElement) {
            navBrandElement.style.visibility = 'hidden';
        } else {
            navBrandElement.style.visibility = 'visible';
        }
    })
})
navbarNav.forEach(navBarNavElement => {
    const navLinkColor = navBarNavElement.getAttribute('data-bs-whatever')
    navLink.forEach(navLinkElement => {
        if(navLinkColor) {
            navLinkElement.classList.add(navLinkColor);
        } else {
            navLinkElement.classList.add('no-css');
        }
    })
})

navbarToggler.forEach(navbarTogglerElement => {
    const navToggleColor = navbarTogglerElement.getAttribute('data-bs-whatever');
    if(navToggleColor) {
        navbarTogglerElement.classList.add(navToggleColor);
    } else {
        navbarTogglerElement.classList.add('no-css');
    }
})


