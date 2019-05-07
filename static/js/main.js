
let editingTr = undefined;
let editingTrHTML;


function editMenu(me) {


    if (me.innerText == 'Zapisz' || me.innerText == 'Usuń') {
        let form = document.createElement('form');
        form.style.display = "none";
        form.method = "POST";
        if (me.innerText == 'Zapisz') {
            let name = me.parentElement.parentElement.children[1].children[0].value;
            let price = me.parentElement.parentElement.children[2].children[0].value;
            form.action = "/menu/edit-dish"
            form.innerHTML = `
                <input name="name" value="${name}">
                <input name="price" value="${price}">
                <input name="id" value="${me.value}">
                <button type="submit">Wyslij</button>
            `;

            document.body.appendChild(form)
            form.submit();


        }
        else {
            form.action = "/menu/delete-dish"
            form.innerHTML = `
                <input name="id" value="${me.value}">
                <button type="submit">Wyslij</button>
            `;

            document.body.appendChild(form)
            form.submit();

        }
        return;
    }
    else {

    }
    let tr = me.parentElement.parentElement;

    if (me.innerText == "Edytuj" && !editingTr) {
        editingTr = tr;
        editingTrHTML = tr.innerHTML;

    }
    else if (me.innerText == "Edytuj" && editingTr) {

        editingTr.innerHTML = editingTrHTML;
        editingTr = tr;
        editingTrHTML = tr.innerHTML;

    }


    if (me.innerText == 'Wróć') {
        tr.innerHTML = editingTrHTML
        editingTr = undefined;
        return;

    }


    tr.children[1].innerHTML = `<input name="name" type="text" value="${tr.children[1].children[0].innerHTML}">`;
    tr.children[2].innerHTML = `<input name="price" type="text" value="${tr.children[2].children[0].innerText.replace("zł", "")}">`;
    tr.children[3].children[0].innerText = "Zapisz"
    tr.children[4].children[0].innerText = "Wróć"
}

function selectTable(id) {
    let form = document.createElement('form');
    form.style.display = "none";
    form.method = "POST";
    form.action = "/";
    form.innerHTML = `
        <input type="hidden" name="id" value="${id}">
        <button type="submit"></button>
    `;

    document.body.appendChild(form)
    form.submit();
}

let reservData = {};

function makeReservation(e, bt) {
    e.preventDefault();
    let rsv = document.querySelector('#wantReserv');
    let blocker = document.querySelector('#blocker');
    rsv.style.display = "block";
    blocker.style.display = "block";

    let form = bt.parentElement.parentElement;
    reservData.last = form.querySelector('input[name="last"]').value
    reservData.tableNumber = form.querySelector('input[name="tableNumber"]').value
    reservData.tableId = form.querySelector('input[name="tableId"]').value
    reservData.date = form.querySelector('input[name="date"]').value
    reservData.time = bt.value;
    console.log(reservData);

}

function reservDishNow() {

    let form = document.createElement('form');
    form.style.display = "none";
    form.method = "POST";
    form.action = "/order-dishes";
    form.innerHTML = `
    <input type="hidden" name="tableNumber" value="${reservData.tableNumber}">
    <input type="hidden" name="last" value="${reservData.last}">
    <input type="hidden" name="tableId" value="${reservData.tableId}">
    <input type="hidden" name="date" value="${reservData.date}">
    <input type="hidden" name="time" value="${reservData.time}">
    <input type="hidden" name="order" value="{}">
    `;

    document.body.appendChild(form)
    form.submit();
}


function reservDishAfter(order = "") {
    let rsv = document.querySelector('#wantReserv');
    let blocker = document.querySelector('#blocker');
    rsv.style.display = "none";
    blocker.style.display = "none";
    console.log('a');

    let form = document.createElement('form');
    form.style.display = "none";
    form.method = "POST";
    form.action = "/order";
    form.innerHTML = `
    <input type="hidden" name="tableNumber" value="${reservData.tableNumber}">
    <input type="hidden" name="last" value="${reservData.last}">
    <input type="hidden" name="tableId" value="${reservData.tableId}">
    <input type="hidden" name="date" value="${reservData.date}">
    <input type="hidden" name="time" value="${reservData.time}">
    <input type="hidden" name="order" value="${order}">
    `;

    document.body.appendChild(form)
    form.submit();




}

orders = []

function addDish(index, id) {
    console.log('s');

    let trs = document.querySelectorAll('#menu-table tr');
    console.log(trs);
    console.log(index);

    for (let [i, tr] of trs.entries()) {
        if (i == index + 1) {
            console.log(tr.children[1].innerText);
            for (let order of orders) {
                if (order.id == id) {
                    order.amount++;
                    return renderOrders()
                }
            }

            orders.push({
                id: id,
                name: tr.children[1].innerText,
                price: tr.children[2].innerText,
                amount: 1
            })

            console.log(orders);
            renderOrders()
            break;
        }
    }
}

function renderOrders() {
    let total = 0;
    let table = document.querySelector('#orders');
    table.innerHTML = `   
            <tr><th colspan="5"><center>Twoje zamówienie</center></th></tr>  
            <tr>
            <th>lp.</th>
            <th>Nazwa</th>
            <th>Cena</th>
            <th>Ilość</th>
            <th></th>
        </tr>`;
    for (let [i, order] of orders.entries()) {
        table.innerHTML += `
            <tr>
                <td>${i}. </td>
                <td>${order.name}</td>
                <td>${order.price}</td>
                <td class="oamount"><input type="number" value="${order.amount}" onchange="changeAmount(this)"></td>
                <td class="odelete"><button onclick="delDish(${i})">Usuń</button></td>
            </tr>
        `;
        total += order.price.replace('zł', '') * order.amount;

    }
    console.log(total);

    total = total.toFixed(2);
    console.log(total);

    table.innerHTML += `
    <tr>
        <td colspan="3"></td>
        <th colspan="2" class="osuma">Suma: ${total}zł</th>
    </tr>
`

    document.querySelector('#send').value = JSON.stringify({ orders: orders, total })


}


function changeAmount(t) {
    let nr = t.parentElement.parentElement.children[0].innerText;
    if (t.value < 1) t.value = 1;
    for (let [i, order] of orders.entries()) {
        if (i == nr) {
            order.amount = t.value
        }
    }
    renderOrders()
}

function delDish(i) {
    orders.splice(i, 1);
    renderOrders()
}

try {
    renderOrders()
}
catch {

}
