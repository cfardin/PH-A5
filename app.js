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
    const leftStatusIcon = "";
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
               <h3>${issue.title}</h3>
               <p>${issue.description}</p> 
            </div>
            <div>
                <button class="btn">lol</button>
                <button class="btn">lol</button>
            </div>
            <hr>
            <p>name</p>
            <p>date</p>
    `;

    return 

};


// loadIssues('all-btn');