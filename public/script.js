const nav = document.getElementById('nav');

fetch('/HeaderBeforeLogin.html')
    .then((res) => res.text())
    .then(data => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = data;
        const navItems = tempDiv.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            const link = item.querySelector('.nav-link');
            if (link.getAttribute('href') === window.location.pathname) {
                item.classList.add('active');
            }
        });
        nav.innerHTML = tempDiv.innerHTML;
    })
    .catch(error => {
        console.error('Error:', error);
    });