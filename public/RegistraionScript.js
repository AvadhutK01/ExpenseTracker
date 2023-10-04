document.getElementById("registrationForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const nameInput = document.getElementById("nameInput").value;
    const phoneInput = document.getElementById("phoneInput").value;
    const emailInput = document.getElementById("emailInput").value;
    const passwordInput = document.getElementById("passwordInput").value;
    const rePassInput = document.getElementById('confirmPasswordInput').value;

    if (passwordInput === rePassInput) {
        const formData = {
            nameInput: nameInput,
            phoneInput: phoneInput,
            emailInput: emailInput,
            passwordInput: passwordInput
        };

        try {
            const response = await axios.post("/user/addUser", formData, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = response.data;
            if (data.data === "success") {
                alert("Registration successful! You will be redirected to the login page now.");
                window.location = '/user/login';
            } else if (data.data === "exist") {
                alert("User already exists! Check the credentials you have entered or click on login.");
            } else {
                alert("Something went wrong!");
            }
        } catch (error) {
            alert("Something went wrong!");
            console.error('Error:', error);
        }
    } else {
        alert('Passwords do not match.');
    }
});