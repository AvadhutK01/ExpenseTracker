
let table1 = document.getElementById("table1");
let tablebody1 = document.getElementById("tablebody1");
let table2 = document.getElementById("table2");
let tablebody2 = document.getElementById("tablebody2");
let table3 = document.getElementById("table3");
let tablebody3 = document.getElementById("tablebody3");
let table4 = document.getElementById("table4");
let tablebody4 = document.getElementById("tablebody4");
let table5 = document.getElementById("table5");
let tablebody5 = document.getElementById("tablebody5");
const dailyDataArray = [];
const weeklyDataArray = [];
const monthlyDataArray = [];
const yearlyDataArray = [];
const btnDownload = document.getElementById('btnDownload');
document.addEventListener('DOMContentLoaded', fetchData);

async function fetchData() {
    const token = localStorage.getItem('token');
    const result = await axios.get('/expense/viewReportExpensesData', {
        headers: {
            "Authorization": token
        }
    });
    const yearlyResult = await axios.get('/expense/viewYearlyExpensesData', {
        headers: {
            "Authorization": token
        }
    });
    const DownloadUrl = await axios.get('/expense/getDownloadUrl', {
        headers: {
            "Authorization": token
        }
    });

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US');
    const [day, month, year] = formattedDate.split('/');
    const today = `${month}/${day}/${year}`;
    const thisWeekStart = new Date(currentDate);
    thisWeekStart.setDate(currentDate.getDate() - currentDate.getDay());
    const thisWeekStartFormatted = `${thisWeekStart.getDate()}/${thisWeekStart.getMonth() + 1}/${thisWeekStart.getFullYear()}`;
    const thisMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const thisMonthStartFormatted = `${thisMonthStart.getDate()}/${thisMonthStart.getMonth() + 1}/${thisMonthStart.getFullYear()}`;

    const dailyData = result.data.filter(item => {
        const [itemDay, itemMonth, itemYear] = item.date.split('/');
        const itemDate = new Date(`${itemYear}/${itemMonth}/${itemDay}`);
        const formattedItemDate = `${itemDate.getDate()}/${itemDate.getMonth() + 1}/${itemDate.getFullYear()}`;
        return formattedItemDate === today;
    });

    const weeklyData = result.data.filter(item => {
        const [itemDay, itemMonth, itemYear] = item.date.split('/');
        const itemDate = new Date(`${itemDay}/${itemMonth / 1}-${itemYear}`).toDateString();
        return itemDate >= thisWeekStartFormatted;
    });
    const monthlyData = result.data.filter(item => {
        const [itemDay, itemMonth, itemYear] = item.date.split('/');
        const itemDate = new Date(itemYear, itemMonth - 1, itemDay).toDateString();
        return itemDate >= thisMonthStartFormatted;
    });
    const currentYear = new Date().getFullYear();
    const yearlyData = yearlyResult.data.filter(item => {
        const [itemMonth, itemYear] = item.year.split('-').map(Number);
        return itemYear === currentYear;
    });
    displayData(dailyData, table1, tablebody1, dailyDataArray);
    displayData(weeklyData, table2, tablebody2, weeklyDataArray);
    displayData(monthlyData, table3, tablebody3, monthlyDataArray);
    displayYearlyReport(yearlyData, table4, tablebody4, yearlyDataArray);
    displayDownloadUrl(DownloadUrl.data, table5, tablebody5);
}

async function displayData(data, tablebody, table, dataArray) {
    clearTableBody(tablebody);
    if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
            let tr = document.createElement("tr");
            tr.className = 'text-center'
            let td1 = document.createElement("td");
            td1.id = "td1";
            td1.appendChild(document.createTextNode(data[i].date));
            tr.appendChild(td1);
            let td2 = document.createElement("td");
            td2.id = "td2";
            td2.appendChild(document.createTextNode(data[i].Amount));
            tr.appendChild(td2);
            let td3 = document.createElement("td");
            td3.id = "td3";
            td3.appendChild(document.createTextNode(data[i].sourceType));
            tr.appendChild(td3);
            let td4 = document.createElement("td");
            td4.id = "td4";
            td4.appendChild(document.createTextNode(data[i].description));
            tr.appendChild(td4);
            let td5 = document.createElement("td");
            td5.id = "td5";
            td5.appendChild(document.createTextNode(data[i].type));
            tr.appendChild(td5);
            tablebody.appendChild(tr);
            dataArray.push({
                date: new Date(data[i].updatedAt).toISOString().split('T')[0],
                amount: data[i].Amount,
                sourceType: data[i].sourceType,
                description: data[i].description,
                type: data[i].type
            });
        }
        flag = false;
    }
    else {
        table.innerHTML = "<div class='text-center'><h5>No Data Found</h5></div>";
    }

}

async function displayYearlyReport(data, tablebody, table, dataArray) {
    await clearTableBody(tablebody);
    if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
            let dateParts = data[i].year.split('-');
            let month = parseInt(dateParts[0], 10);
            let year = parseInt(dateParts[1], 10);
            let formattedDate = new Date(year, month - 1);
            let monthName = formattedDate.toLocaleString('en-US', { month: 'long' });

            let tr = document.createElement("tr");
            tr.className = 'text-center'
            let td1 = document.createElement("td");
            td1.id = "td1";
            td1.appendChild(document.createTextNode(`${monthName} ${year}`));
            tr.appendChild(td1);
            let td2 = document.createElement("td");
            td2.id = "td2";
            td2.appendChild(document.createTextNode(data[i].TotalIncomme));
            tr.appendChild(td2);
            let td3 = document.createElement("td");
            td3.id = "td3";
            td3.appendChild(document.createTextNode(data[i].TotalExpense));
            tr.appendChild(td3);
            let td4 = document.createElement("td");
            td4.id = "td4";
            td4.appendChild(document.createTextNode(data[i].Savings));
            tr.appendChild(td4);
            tablebody.appendChild(tr);
            dataArray.push({
                monthYear: `${monthName} ${year}`,
                totalIncome: data[i].TotalIncomme,
                totalExpense: data[i].TotalExpense,
                savings: data[i].Savings
            });
        }
    }
    else {
        table.innerHTML = "<div class='text-center'><h5>No Data Found</h5></div>";
    }
}

async function displayDownloadUrl(data, table, tablebody) {
    await clearTableBody(tablebody);
    if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
            let tr = document.createElement("tr");
            tr.className = 'text-center'
            let td1 = document.createElement("td");
            td1.id = "td1";
            td1.appendChild(document.createTextNode(data[i].date));
            tr.appendChild(td1);
            let td2 = document.createElement("td");
            let downloadLink = document.createElement("a");
            downloadLink.href = data[i].fileUrl;
            downloadLink.target = "_blank";
            downloadLink.appendChild(document.createTextNode(document.innerHTML = `${data[i].fileUrl}`));
            td2.appendChild(downloadLink);
            tr.appendChild(td2);
            tablebody.appendChild(tr);
        }
        let extraTr = document.createElement("tr");
        let extraTd = document.createElement("td");
        extraTd.textContent = 'new data will be added here';
        extraTr.appendChild(extraTd);
        tablebody.appendChild(extraTr);
    }
    else {
        table.innerHTML = "<div class='text-center'><h5>No Data Found</h5></div>";
    }
}

btnDownload.addEventListener('click', (e) => {
    $('#downloadModal').modal('show');
    const downloadAllButton = document.getElementById('BtnAllDownload');
    const downloadReportButton = document.getElementById('BtnReportDownload');
    downloadAllButton.addEventListener('click', () => {
        downloadData('All');
        $('#downloadModal').modal('hide');
    });
    downloadReportButton.addEventListener('click', () => {
        downloadData('Report');
        $('#downloadModal').modal('hide');
    });
});


async function downloadData(type) {
    const queryParams = {
        dailyData: dailyDataArray,
        weeklyData: weeklyDataArray,
        monthlyData: monthlyDataArray,
        yearlyData: yearlyDataArray,
        downloadType: type
    };

    try {
        const token = localStorage.getItem('token');
        const response = await axios.post('/expense/download', queryParams, {
            headers: {
                "Authorization": token
            }
        });
        var a = document.createElement('a');
        a.href = response.data.fileUrl;
        a.click();
        fetchData();
    } catch (error) {
        console.log(error);
        alert('something went wrong');
    }
}



async function clearTableBody(tablebody) {
    const rows = tablebody.getElementsByTagName('tr');
    for (let i = rows.length - 1; i > 0; i--) {
        tablebody.removeChild(rows[i]);
    }
}


