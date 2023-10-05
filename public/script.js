const nav = document.getElementById('nav');
const navbar = document.getElementById('navbar');
if (nav) {

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
}
else if (navbar) {

    fetch('/HeaderAfterLogin.html')
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
            navbar.innerHTML = tempDiv.innerHTML;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}