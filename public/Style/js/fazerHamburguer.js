document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');

    hamburger.addEventListener('click', function (e) {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    
    document.addEventListener('click', function (e) {
        if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
            hamburger.classList.remove('active'); 
            mobileMenu.classList.remove('active');
        }
    });
});
