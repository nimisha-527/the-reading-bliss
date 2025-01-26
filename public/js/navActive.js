const navLink = document.querySelectorAll('.nav-link');
const pathName = window.location.pathname;

navLink.forEach(navLinkElement => {
    const navLinkPathName = navLinkElement?.href ? new URL(navLinkElement?.href)?.pathname : window.location.pathname;

    if((navLinkPathName && pathName === navLinkPathName)) {
        navLinkElement.classList.add('active');
    }
})