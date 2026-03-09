let allIssues = [];
let openIssues = [];
let closedIssues = [];
const allBtns = ['all-btn', 'open-btn', 'closed-btn'];

const allBtn = document.getElementById("all-btn");
const openBtn = document.getElementById("open-btn");
const closedBtn = document.getElementById("closed-btn");
const spinner = document.getElementById("spinner");

const issueContainer = document.getElementById("issue-container");


// loading spinner 
const loadingSpinner = (b) => {
    if (b) {
        spinner.classList.remove("hidden");
    } else {
        spinner.classList.add("hidden");
    }
}


// toggle system for tab buttons and changing tabs 
const toggleBtn = (id) => {
    for (let b of allBtns) {
        const btn = document.getElementById(b);

        if (b === id) {
            btn.classList.add('bg-primary', 'text-white');
        } else {
            btn.classList.remove('bg-primary', 'text-white');
        }
    }
};


const modify = (issue) => {
    const div = document.createElement("div");
    div.className = "badge badge-soft";

    const priorityBadge = {
        high: "badge-secondary",
        medium: "badge-warning",
        low: "badge-info"
    }

    div.classList.add(priorityBadge[issue.priority]);
    div.textContent = issue.priority;

    return div;
};

const borderChanger = (div, issue) => {
    const border = {
        closed: 'border-purple',
        open: 'border-green'
    }
    div.classList.add(border[issue.status]);
};

const labelAdder = (l, labels) => {
    for (let i of labels) {
        const div = document.createElement('div');
        div.className = "badge badge-soft";

        if (i === 'bug') {
            div.classList.add("badge-error");
        }
        else if (i === 'help wanted') {
            div.classList.add("badge-warning");
        }
        else {
            div.classList.add("badge-accent");
        }

        div.textContent = i.toUpperCase();
        l.appendChild(div);
    }
};




// loading all data for api 
const loadIssues = (btn) => {

    loadingSpinner(true);
    toggleBtn(btn);

    fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
        .then(res => res.json())
        .then(data => {
            allIssues = data.data;

            openIssues = allIssues.filter(issue => issue.status === "open");
            closedIssues = allIssues.filter(issue => issue.status === "closed");

            displayIssue(btn);
        });
};

// for displaying all the issues 
const displayIssue = (btn) => {
    // const issueContainer = document.getElementById("issue-container");
    issueContainer.innerHTML = "";

    toggleBtn(btn);

    const issueDisplayCount = document.getElementById("issue_count");

    const issue = {
        "all-btn": allIssues,
        "open-btn": openIssues,
        "closed-btn": closedIssues
    }
    issueDisplayCount.innerText = issue[btn].length;

    // const cardsDiv = document.createElement('div');

    // cardsDiv.innerHTML = `

    // `

    issue[btn].forEach(issue => {
        issueContainer.appendChild(issueCard(issue));
    });

    loadingSpinner(false);
};

// for makeing the issue card 
const issueCard = (issue) => {
    let statusIcon;
    if (issue.status === 'open') {
        statusIcon = "./assets/Open-Status.png";
    } else if (issue.status === 'closed') {
        statusIcon = "./assets/Closed-Status.png";
    }


    const cards = document.createElement("div");
    cards.className = "bg-white p-6 rounded-lg space-y-2 h-[100%] w-full"
    cards.innerHTML = `
            <div class="flex justify-between head">
                <img src="${statusIcon}" alt="">
            </div>
            <div>
               <h3 class="text-[18px] font-semibold">${issue.title}</h3>
               <p class="text-[#64748B]">${issue.description}</p> 
            </div>
            <div class="labels">
            </div>
            <hr>
            <div class="labels">
                <p>#${issue.id} by ${issue.author}</p>
                <p>${issue.createdAt}</p>
            </div>
    `;

    const header = cards.querySelector(".head");
    const labels = cards.querySelector(".labels");
    borderChanger(cards, issue);
    labelAdder(labels, issue.labels);


    cards.onclick = function () {
        cardModal(issue);
    }


    header.appendChild(modify(issue));


    return cards;

};

// searching system 
const searching = async() => {
    issueContainer.innerHTML = "";
    loadingSpinner(true);

    const input = document.getElementById("search-input").value.toLowerCase();
    // const searchBtn = document.getElementById("search-btn");

    const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${input}`);
    
    const data = await res.json();
    toggleBtn("");
    const match = data.data;
    
    const issueCount = document.getElementById("issue_count");
    issueCount.textContent = match.length;
    match.forEach(i =>{
        const div = issueCard(i);
        issueContainer.appendChild(div);
    });
    loadingSpinner(false)
};

// modal for the cards info
const cardModal = (card) => {
    const modalCard = document.getElementById("my_modal");
    modalCard.innerHTML = `
        <div class="modal-box space-y-6 ">
            <h3 class="text-xl font-bold">${card.title}</h3>
            <div class="flex gap-1 items-center">
                <div class="text-white text-center ${card.status === 'open' ? "badge badge-success" : "badge badge-primary"}">${card.status === "open" ? "Opened" : "Closed"}</div>
                <p class = "text-[#64748B] text-[12px]">Opened by ${card.author} at ${new Date(card.createdAt).toLocaleDateString()}</p>
            </div>

            <div class="labels">
            </div>

            <p class="text-[#64748B]">
                ${card.description}
            </p>

            <div class="flex justify-between items-center bg-neutral-100 rounded-md p-2">
                <div class="text-left">
                    <p class="text-[#64748B] ">Assignee:</p>
                    <p class="font-semibold">${card.author}</p>
                </div>

                <div class="text-left">
                    <p class="text-[#64748B]">Priority:</p>
                    <p class="priority">${card.priority.toUpperCase()}</p>
                </div>
            </div>
            <div class="modal-action">
                <form method="dialog">
                    <!-- if there is a button in form, it will close the modal -->
                    <button class="btn btn-primary">Close</button>
                </form>
            </div>
        </div>
    `;

    const labels = modalCard.querySelector('.labels');
    labelAdder(labels, card.labels);

    const badge = {
        high: "badge badge-error",
        medium: "badge badge-warning",
        low: "badge"
    }

    const priority = modalCard.querySelector('.priority');
    priority.className = badge[card.priority];

    modalCard.showModal();

};

loadIssues('all-btn');