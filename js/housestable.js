let table = document.getElementById("houses");
let fragment = document.createDocumentFragment();
let thead = document.createElement('thead');
let tbody = document.createElement('tbody');
let price, plex, link;

const currency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0,
  });

(async() => {
    /* parse workbook */
    const url = "houses.xlsx";
    const workbook = XLSX.read(await (await fetch(url)).arrayBuffer());
  
    /* get first worksheet */
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const raw_data = XLSX.utils.sheet_to_json(worksheet, {header:1});

    raw_data.forEach((row, index) => {
        let tr = document.createElement('tr');
        for (let i = 0; i < row.length; i++) {
            let cell;
            if (index === 0) {
                cell = document.createElement('th');
                switch (row[i]) {
                    case 'Maison':
                        price = i;
                        break;
                    case 'Plex':
                        plex = i;
                        break;
                    case 'Adresse web':
                        link = i;
                        break;
                }
                cell.innerText = row[i];
            } else {
                cell = document.createElement('td');
                if (row[i] == undefined) {
                    cell.innerText = "";
                } else if (i === price) {
                    cell.innerText = currency.format(row[i]);
                } else if (i === plex) {
                    let arr = row[i].split('\n');
                    arr.forEach(el => {
                        let span = document.createElement('span');
                        span.classList.add('badge','text-bg-secondary');
                        span.innerText = el;
                        cell.appendChild(span);
                    })
                } else if (i === link) {
                    let btn = document.createElement('a');
                    btn.setAttribute('type',"button");
                    btn.classList.add('link-primary');
                    btn.setAttribute('data-bs-toggle',"modal");
                    btn.setAttribute('data-bs-target',"#frame");
                    btn.setAttribute('data-jl-src',row[i]);
                    btn.setAttribute('data-jl-loc',row[1])
                    btn.innerText = row[i];
                    cell.appendChild(btn);
                } else {
                    cell.innerText = row[i];
                }
            }
            tr.appendChild(cell);
        }
        if (index === 0) {
            thead.appendChild(tr);
        } else {
            tbody.appendChild(tr);
        }
    });
    fragment.appendChild(thead);
    fragment.appendChild(tbody);
    table.appendChild(fragment);
})();

const modal = document.getElementById('frame')
if (modal) {
  modal.addEventListener('show.bs.modal', event => {
    // Button that triggered the modal
    const button = event.relatedTarget
    // Extract info from data-bs-* attributes
    const loc = button.getAttribute('data-jl-loc');
    const src = button.getAttribute('data-jl-src');
    // If necessary, you could initiate an Ajax request here
    // and then do the updating in a callback.

    // Update the modal's content
    const modalTitle = modal.querySelector('.modal-title');
    const modalNewTab = modal.querySelector('#newtab');
    const modalIFrame = modal.querySelector('.modal-body iframe');

    modalTitle.textContent = loc;
    modalNewTab.setAttribute('href',src);
    modalIFrame.setAttribute('src',src);
  });
  modal.addEventListener('hide.bs.modal', event => {
    modal.querySelector('#spinner').classList.remove('invisible');
  })
};

const iframe = document.querySelector("iframe");
iframe.addEventListener( "load", event => {
    document.getElementById('spinner').classList.add('invisible');

});
