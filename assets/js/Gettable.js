var doc = document;

var fragment = doc.createDocumentFragment();

for (i = 0; i < 3; i++) {
    var tr = doc.createElement("tr");

    var td = doc.createElement("td");

    for(b=qr_history.length; b>0; b--){

        td.innerHTML =  qr_history[b].title;
    }

    tr.appendChild(td);

    //does not trigger reflow
    fragment.appendChild(tr);
}

var table = doc.createElement("table");

table.appendChild(fragment);

doc.getElementById("history_table").appendChild(table);