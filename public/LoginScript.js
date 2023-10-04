document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('EmailInput').value;
    const passwordInput = document.getElementById('PasswordInput').value;
    let data = {
        email: emailInput,
        password: passwordInput
    };
    try {
        const result = await axios.post('/user/check-login', data);
        if (result.data.data === 'success') {
            alert('Login Successful');
        }
    } catch (error) {
        if (error.response.data.data === 'Failed') {
            alert("Invalid Credentials!");
        } else if (error.response.data.data === 'NotExist') {
            alert("User not exist please register yourself first!");
        }
        else {
            alert('something went wrong');
        }
        console.error(error);
    }
});