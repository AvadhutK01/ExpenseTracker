let tabel = document.getElementById("table");
let tabelbody = document.getElementById("tablebody");
document.addEventListener('DOMContentLoaded', fetchData());

async function fetchData() {
    try {
        const result = await axios.get('/expense/viewLeaderBoardData');
        displayData(result.data)
    } catch (error) {
        alert('Internal Server Error!');
    }
}


async function displayData(data) {
    tabelbody.innerText = "";
    if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
            let tr = document.createElement("tr");
            let td = document.createElement("td");
            td.id = "td";
            td.appendChild(document.createTextNode(i + 1));
            tr.appendChild(td);
            let td1 = document.createElement("td");
            td1.id = "td1";
            td1.appendChild(document.createTextNode(data[i].name));
            tr.appendChild(td1);
            let td2 = document.createElement("td");
            td2.id = "td2";
            td2.appendChild(document.createTextNode(data[i].totalExpense));
            tr.appendChild(td2);
            let td3 = document.createElement("td");
            td3.id = "td3";
            td3.appendChild(document.createTextNode(data[i].totalIncome));
            tr.appendChild(td3);
            tabelbody.appendChild(tr);
        }
    } else {
        tabel.innerHTML = "<h5>No Data Found</h5>";
    }
}
