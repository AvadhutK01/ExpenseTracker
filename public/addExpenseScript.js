const ExpenseAmount = document.getElementById('ExpenseAmount');
const ExpenseDesc = document.getElementById('ExpenseDesc');
const ExpenseType = document.getElementById('ExpenseType');
const btnSubmit = document.getElementById('btnSubmit');
const updateData = JSON.parse(localStorage.getItem('updateData'));

if (updateData) {
    btnSubmit.textContent = 'Update';
    ExpenseAmount.value = updateData.expenseAmount;
    ExpenseDesc.value = updateData.description;
    ExpenseType.value = updateData.expenseType;
}

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
