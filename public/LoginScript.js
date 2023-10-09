const forgotBtn = document.getElementById('forgotBtn');
const btnSubmit = document.getElementById('loginForm');
if (btnSubmit) {
    btnSubmit.addEventListener('submit', async (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('EmailInput').value;
        const passwordInput = document.getElementById('PasswordInput').value;
        let data = {
            email: emailInput,
            password: passwordInput
        };
        try {
            const result = await axios.post('/user/check-login', data);
            if (result.data.message === 'success') {
                alert('Login Successful');
                localStorage.setItem('token', result.data.token);
                window.location = `/expense/MainHome/`;
            }
        } catch (error) {
            if (error.response.data.message === 'Failed') {
                alert("Invalid Credentials!");
            } else if (error.response.data.message === 'NotExist') {
                alert("User not exist please register yourself first!");
            }
            else {
                alert(error.response.data.message);
            }
        }
    });
}
if (forgotBtn) {
    forgotBtn.addEventListener('click', async (e) => {
        const emailId = document.getElementById('EmailId').value;
        if (emailId == '') {
            alert('Please Enter Valid Email Address!');
        } else {
            try {
                const response = await axios.post('/user/SendforgetPasswordLink', { emailId }
                );
                if (response.data.message == 'success') {
                    alert('Email Sent successfully check the email for further instructions!');
                    window.location.href = '/user/login';
                }
            } catch (error) {
                if (error.response.data.status === 404) {
                    alert(error.response.data.message);
                } else {
                    alert(error.response.data.message);
                }
            }
        }
    })
}


