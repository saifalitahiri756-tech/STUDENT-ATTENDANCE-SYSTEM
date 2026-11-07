const initialStudents = [
  {name:"Ayesha Khan", id:"STU-001", status:"Present"},
  {name:"Ahmed Ali", id:"STU-002", status:"Absent"},
  {name:"Fatima Noor", id:"STU-003", status:"Present"},
  {name:"Usman Tariq", id:"STU-004", status:"Unmarked"},
  {name:"Hira Malik", id:"STU-005", status:"Present"}
];
const today = new Date().toISOString().slice(0,10);
let students = JSON.parse(localStorage.getItem("attendly_students") || "null") || initialStudents;
const rows = document.getElementById("studentRows");
const search = document.getElementById("searchInput");
document.getElementById("todayLabel").textContent = new Date().toLocaleDateString(undefined,{weekday:"short",month:"short",day:"numeric",year:"numeric"});

function save(){ localStorage.setItem("attendly_students",JSON.stringify(students)); render(); }
function render(){
  const q = search.value.trim().toLowerCase();
  const filtered = students.filter(s=>s.name.toLowerCase().includes(q)||s.id.toLowerCase().includes(q));
  rows.innerHTML = "";
  filtered.forEach(s=>{
    const tr = document.createElement("tr");
    const nameCell = document.createElement("td");
    nameCell.innerHTML = `<div class="student-name"></div><div class="student-sub">Student</div>`;
    nameCell.querySelector(".student-name").textContent=s.name;
    const idCell=document.createElement("td"); idCell.className="id-cell"; idCell.textContent=s.id;
    const statusCell=document.createElement("td");
    const badge=document.createElement("span"); badge.className="status "+s.status.toLowerCase(); badge.textContent=s.status; statusCell.appendChild(badge);
    const actionCell=document.createElement("td"); const actions=document.createElement("div"); actions.className="actions";
    ["Present","Absent"].forEach(status=>{
      const btn=document.createElement("button"); btn.className="action-btn"+(s.status===status?(status==="Present"?" selected-present":" selected-absent"):""); btn.textContent=status;
      btn.addEventListener("click",()=>{s.status=status;save();}); actions.appendChild(btn);
    });
    actionCell.appendChild(actions); tr.append(nameCell,idCell,statusCell,actionCell); rows.appendChild(tr);
  });
  const present=students.filter(s=>s.status==="Present").length;
  const absent=students.filter(s=>s.status==="Absent").length;
  document.getElementById("totalCount").textContent=students.length;
  document.getElementById("presentCount").textContent=present;
  document.getElementById("absentCount").textContent=absent;
  document.getElementById("rateCount").textContent=(students.length?Math.round(present/students.length*100):0)+"%";
  document.getElementById("listCount").textContent=`Showing ${filtered.length} of ${students.length} students`;
  document.getElementById("emptyState").hidden=filtered.length!==0;
}
search.addEventListener("input",render);
document.getElementById("addStudentBtn").addEventListener("click",()=>{
  const name=prompt("Enter the student's full name:");
  if(!name||!name.trim()) return;
  const id=prompt("Enter the student ID (for example STU-006):");
  if(!id||!id.trim()) return;
  if(students.some(s=>s.id.toLowerCase()===id.trim().toLowerCase())){alert("That student ID already exists.");return;}
  students.push({name:name.trim(),id:id.trim(),status:"Unmarked"});save();
});
render();
