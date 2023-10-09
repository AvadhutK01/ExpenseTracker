const nav = document.getElementById('nav');
const navbar = document.getElementById('navbar');
const PremiumDiv = document.querySelector('#PremiumDiv');
const Premiumbtn = document.createElement('button');
Premiumbtn.type = 'button';
Premiumbtn.className = "btn btn-primary ms-2";
Premiumbtn.id = "btnPremumSubmit";
Premiumbtn.textContent = 'Buy Premium Membership';
const Monetarybtn = document.createElement('button');
Monetarybtn.type = 'button';
Monetarybtn.className = "btn btn-primary ms-2";
Monetarybtn.id = "Monetarybtn";
Monetarybtn.textContent = 'View Reports';
const LeaderBoardbtn = document.createElement('button');
LeaderBoardbtn.type = 'button';
LeaderBoardbtn.className = "btn btn-primary ms-2";
LeaderBoardbtn.id = "btnPremumSubmit";
LeaderBoardbtn.textContent = 'View LeaderBoard';
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
if (PremiumDiv) {
    document.addEventListener('DOMContentLoaded', async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/payment/checkPremium', {
                headers: {
                    "Authorization": token
                }
            });
            if (response.data.result === "false") {
                PremiumDiv.appendChild(Premiumbtn);
            }
            else if (response.data.result === "true") {
                PremiumDiv.appendChild(LeaderBoardbtn);
                PremiumDiv.appendChild(Monetarybtn);
            }
        } catch (error) {
            alert(error.response.message);
        }
    })
}
Premiumbtn.addEventListener('click', async (e) => {

    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/payment/premiummember', {
            headers: {
                "Authorization": token
            }
        });
        const options = {
            "key": response.data.key_id,
            "order_id": response.data.result.id,
            "handler": async (response) => {
                await axios.post('/payment/updateTransacation', {
                    order_id: options.order_id,
                    payment_id: response.razorpay_payment_id
                }, { headers: { "Authorization": token } })
                alert('You are Premium Member now!');
                window.location.reload();
            }
        };
        const rzpl = new Razorpay(options);
        rzpl.open();
        rzpl.on('payment.failed', async () => {
            await axios.post('/payment/updateTransacation', { order_id: response.data.result.id, payment_id: null }, { headers: { "Authorization": token } })
            alert('TRANSACTION FAILED');
        })

        e.preventDefault();
    } catch (error) {
        console.log(error)
    }
}
)
LeaderBoardbtn.addEventListener('click', () => {
    window.location.href = '/expense/leaderBoardPage';
})

Monetarybtn.addEventListener('click', () => {
    window.location.href = '/expense/viewMonetaryData';
})