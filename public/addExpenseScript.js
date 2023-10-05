const ExpenseAmount = document.getElementById('ExpenseAmount');
const ExpenseDesc = document.getElementById('ExpenseDesc');
const ExpenseType = document.getElementById('ExpenseType');
const btnSubmit = document.getElementById('btnSubmit');
const updateData = JSON.parse(localStorage.getItem('updateData'));
const PremiumDiv = document.getElementById('PremiumDiv');
const Premiumbtn = document.createElement('button');
Premiumbtn.type = 'button';
Premiumbtn.className = "btn btn-primary";
Premiumbtn.id = "btnPremumSubmit";
Premiumbtn.textContent = 'Buy Premium Membership';
if (updateData) {
    btnSubmit.textContent = 'Update';
    ExpenseAmount.value = updateData.expenseAmount;
    ExpenseDesc.value = updateData.description;
    ExpenseType.value = updateData.expenseType;
}
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
    } catch (error) {
        alert('Something Went Wrong!');
    }
})
document.getElementById('AddExpenseForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const data = {
            ExpenseAmount: ExpenseAmount.value,
            ExpenseDesc: ExpenseDesc.value,
            ExpenseType: ExpenseType.value
        };

        if (updateData) {
            const token = localStorage.getItem('token');
            const id = updateData.id;
            let response = await axios.post('/expense/update-expense', { id, data }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                }
            });
            const result = response.data;
            if (result.data === "success") {
                alert("Expense Updated Successfully!");
                localStorage.removeItem('updateData');
                window.location = '/expense/expenseMain';
            }
        } else {
            const token = localStorage.getItem('token');
            let response = await axios.post('/expense/post-expense', data, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                }
            });
            const result = response.data;
            if (result.data === "success") {
                alert("Expense Added Successfully!");
                window.location = '/expense/expenseMain';
            }
        }
    }
    catch (err) {
        alert('Something went wrong!')
        console.error(err);
    }
});

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
                localStorage.setItem('Premium', true);
                alert('You are Premium Member now!');
                window.location.href = '/expense/expenseMain';
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
})