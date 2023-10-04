let tabel = document.getElementById("table");
let tabelbody = document.getElementById("tablebody");
document.addEventListener('DOMContentLoaded', fetchData());

async function fetchData() {
    const result = await axios.get('/expense/viewExpensesData');
    displayData(result.data)
}

async function displayData(data) {
    tabelbody.innerText = "";
    if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
            let tr = document.createElement("tr");
            tr.setAttribute("data-id", data[i].id);
            let td1 = document.createElement("td");
            td1.id = "td1";
            td1.appendChild(document.createTextNode(data[i].expenseAmount));
            tr.appendChild(td1);
            let td2 = document.createElement("td");
            td2.id = "td2";
            td2.appendChild(document.createTextNode(data[i].expenseType));
            tr.appendChild(td2);
            let td3 = document.createElement("td");
            td3.id = "td3";
            td3.appendChild(document.createTextNode(data[i].description));
            tr.appendChild(td3);
            let td4 = document.createElement("td");
            var delbutton = document.createElement('button');
            delbutton.className = "btn btn-danger btn-sm float-right m-0 delete";
            delbutton.addEventListener('click', () => {
                deleteData(data[i].id);
            });
            delbutton.appendChild(document.createTextNode("Delete"));
            let td5 = document.createElement("td");
            var Editbutton = document.createElement('button');
            Editbutton.className = "btn mr-1 btn-info btn-sm float-right ms-2 edit";
            Editbutton.addEventListener('click', () => {
                setUpdate(data[i]);
            })
            Editbutton.appendChild(document.createTextNode("Edit"));
            td4.appendChild(Editbutton);
            td5.appendChild(delbutton);
            tr.appendChild(td4);
            tr.appendChild(td5);
            tabelbody.appendChild(tr);
        }
    }
    else {
        tabel.innerHTML = "<h5>No Data Found</h5>";
    }
}

async function deleteData(id) {
    await axios.post(`/expense/deleteExpensedata`, { id });
    window.location.href = '/expense/viewExpenses';
}

async function setUpdate(data) {
    localStorage.setItem('updateData', JSON.stringify(data));
    window.location.href = '/expense/expenseMain';
}