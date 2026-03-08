let allIssues = [];
let openIssues = [];
let closedIssues = [];
const allBtns = ['all-btn', 'open-btn', 'closed-btn'];

const allBtn = document.getElementById("all-btn");
const openBtn = document.getElementById("open-btn");
const closedBtn = document.getElementById("closed-btn");


// toggle system for tab buttons and changing tabs 
const toggleBtn = (id) =>{
    for(let b of allBtns){
        const btn = document.getElementById(b);

        if(b === id){
            btn.classList.add('bg-primary', 'text-white');
        } else{
            btn.classList.remove('bg-primary', 'text-white');
        }
    }
};
   

const modify = (issue) =>{
    const div = document.createElement("div");
    div.className = "badge badge-soft";

    const priorityBadge = {
        high: "badge-secondary",
        medium: "badge-warning",
        low: "badge-info"
    }

    div.classList.add(priorityBadge[issue.priority]);

    return div;
};

const borderChanger = (div, issue) =>{
   const border = {
        closed: 'border-primary',
        open: 'border-success'
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
const loadIssues = (btn) =>{

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
const displayIssue = (btn) =>{
    const issueContainer = document.getElementById("issue-container");
    issueContainer.innerHTML = "";

    toggleBtn(btn);
    
    const issueDisplayCount = document.getElementById("issue_count");

    const issue = {
        "all-btn" : allIssues,
        "open-btn" : openIssues,
        "closed-btn" : closedIssues
    }
    issueDisplayCount.innerText = issue[btn].length;

    // const cardsDiv = document.createElement('div');

    // cardsDiv.innerHTML = `

    // `

    issue[btn].forEach(issue => {
        issueContainer.appendChild(issueCard(issue));
    });
};

// for makeing the issue card 
const issueCard = (issue) =>{
    let leftStatusIcon = "";
    if(issue.status === 'open'){
        leftStatusIcon = "./assets/Open-Status.png";
    } else {
        leftStatusIcon = "./assets/Closed-Status.png";
    }

    const cards = document.createElement("div");
    cards.className = "bg-white p-6 rounded-lg space-y-2 h-[100%] w-full"
    cards.innerHTML =  `
            <div class="flex justify-between head">
                <img src="${leftStatusIcon}" alt="">
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

    header.appendChild(modify(issue));
    return cards;

};



loadIssues('all-btn');