const Dataform = document.getElementById('AddDataForm');
const updateData1 = JSON.parse(localStorage.getItem('updateData'));
const PremiumDiv = document.getElementById('PremiumDiv');
const Premiumbtn = document.createElement('button');
const Amount = document.getElementById('Amount');
const Desc = document.getElementById('Desc');
const Type = document.getElementById('Type');
Premiumbtn.type = 'button';
Premiumbtn.className = "btn btn-primary";
Premiumbtn.id = "btnPremumSubmit";
Premiumbtn.textContent = 'Buy Premium Membership';
const Monetarybtn = document.createElement('button');
Monetarybtn.type = 'button';
Monetarybtn.className = "btn btn-primary";
Monetarybtn.id = "Monetarybtn";
Monetarybtn.textContent = 'View Monetary Data';
const LeaderBoardbtn = document.createElement('button');
LeaderBoardbtn.type = 'button';
LeaderBoardbtn.className = "btn btn-primary";
LeaderBoardbtn.id = "btnPremumSubmit";
LeaderBoardbtn.textContent = 'View LeaderBoard';
if (updateData1) {
    if (updateData1.type === 'Expense') {
        let btnExpenseSubmit = document.getElementById('btnExpenseSubmit');
        btnExpenseSubmit.textContent = 'Update';
    }
    else if (updateData1.type === 'Income') {
        let btnIncomeSubmit = document.getElementById('btnIncomeSubmit');
        btnIncomeSubmit.textContent = 'Update';
    }
    Amount.value = updateData1.Amount;
    Desc.value = updateData1.description;
    Type.value = updateData1.sourceType;
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
        else if (response.data.result === "true") {
            PremiumDiv.innerHTML = '<h5>Premium User</h5>';
            PremiumDiv.appendChild(LeaderBoardbtn);
            PremiumDiv.appendChild(Monetarybtn);
        }
    } catch (error) {
        alert('Something Went Wrong!');
    }
})
Dataform.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (updateData1) {
        const Amount = document.getElementById('Amount');
        const Desc = document.getElementById('Desc');
        const Type = document.getElementById('Type');
        const data = {
            Amount: Amount.value,
            Desc: Desc.value,
            Type: Type.value,
        };
        const token = localStorage.getItem('token');
        const id = updateData1.id;
        const Etype = updateData1.type
        let response = await axios.post('/expense/update-expense', { Etype, id, data }, {
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
        let btnExpenseSubmit = document.getElementById('btnExpenseSubmit');
        let btnIncomeSubmit = document.getElementById('btnIncomeSubmit');
        if (btnExpenseSubmit) {
            addData('Expense');
        }
        if (btnIncomeSubmit) {
            addData('Income');
        }
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
});

LeaderBoardbtn.addEventListener('click', () => {
    window.location.href = '/expense/leaderBoardPage';
})

Monetarybtn.addEventListener('click', () => {
    window.location.href = '/expense/viewMonetaryData';
})

async function addData(type) {
    try {
        const Amount = document.getElementById('Amount');
        const Desc = document.getElementById('Desc');
        const Type = document.getElementById('Type');
        const data = {
            Amount: Amount.value,
            Desc: Desc.value,
            Type: Type.value,
            Etype: type
        };
        const token = localStorage.getItem('token');
        let response = await axios.post('/expense/post-expense', data, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        });
        const result = response.data;
        if (result.data === "success") {
            alert("Data Added Successfully!");
            window.location = '/expense/expenseMain';
        }
    }
    catch (err) {
        console.error(err);
        alert('Something went wrong!')
    }
}