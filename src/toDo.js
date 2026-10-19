import { showForm, hideOverlay, showOverlay } from "./forms.js";
import { createDeleteButton, createEditButton } from "./buttons.js";
import { storage, storageAvailable } from "./storage.js";

const toDoForm = document.getElementById("toDoForm");
const editToDoForm = document.getElementById("editToDoForm");
const createToDo = document.querySelector(".addToDo");
const toDoFormElement = document.getElementById("editToDo");
const projectFormElement = document.querySelectorAll(".projectName");
const deadlineFormElement = document.getElementById("editDeadline");
const priorityFormElement = document.getElementById("editPrio");
const TableBody = document.querySelector(".tableBody");
const toDoIDElement = document.getElementById("toDoID");
const seeAllToDos = document.getElementById("seeAllToDos");

let toDos = initToDoData();
console.log(toDos);

class toDo {
  constructor(name, project, deadline, priority, status) {
    this.name = name;
    this.project = project;
    this.deadline = deadline;
    this.priority = priority;
    this.status = status;
    this.toDoID = crypto.randomUUID();
  }
}
function editToDo() {
  showOverlay();
  showForm(editToDoForm);

  toDoFormElement.value = this.name;
  projectFormElement.forEach((element) => (element.value = this.project));
  deadlineFormElement.value = this.deadline;
  priorityFormElement.value = this.priority;
  toDoIDElement.value = this.toDoID;
}

function addToDo(toDoData) {
  const newToDo = new toDo(
    toDoData.toDo,
    toDoData.project,
    toDoData.deadline,
    toDoData.prio,
    toDoData.status,
  );
  Object.setPrototypeOf(newToDo, { editToDo });
  toDos.push(newToDo);
  renderToDo();
}

function renderToDo(filter = null) {
  uploadToDoData();
  TableBody.innerHTML = `
          
        <tr>
            <th>Name</th>
            <th>Project</th>
            <th>Deadline</th>
            <th>Prio</th>
            <th>Status</th>
        </tr>
        
      `;

  toDos.forEach((element, index) => {
    if (element.project === filter || filter === null) {
      const tableRow = document.createElement("tr");

      for (const key in element) {
        if (key === "toDoID") break;
        if (key === "status") {
          const checkboxCell = document.createElement("td");
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.checked = element[key];

          checkboxCell.appendChild(checkbox);
          tableRow.appendChild(checkboxCell);
        } else {
          const tableData = document.createElement("td");

          tableData.textContent = element[key];
          tableRow.appendChild(tableData);
        }
      }

      const deleteButton = createDeleteButton();
      const editButton = createEditButton();

      tableRow.append(deleteButton);
      tableRow.append(editButton);

      tableRow.addEventListener("mouseenter", () => {
        editButton.style.opacity = "1";
        deleteButton.style.opacity = "1";
      });
      tableRow.addEventListener("mouseleave", () => {
        editButton.style.opacity = "0";
        deleteButton.style.opacity = "0";
      });

      deleteButton.addEventListener("click", () => {
        toDos.splice(index, 1);
        renderToDo();
      });

      editButton.addEventListener("click", () => {
        element.editToDo();
      });

      TableBody.appendChild(tableRow);
    }
  });
}

function initToDoForms() {
  toDoForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(toDoForm);
    toDoForm.reset();
    const data = Object.fromEntries(formData.entries());
    hideOverlay();
    addToDo(data);
    renderToDo();
  });
  editToDoForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(editToDoForm);
    editToDoForm.reset();
    const data = Object.fromEntries(formData.entries());
    hideOverlay();

    let toDoElement = toDos.find((toDo) => toDo.toDoID === data.toDoID);
    toDoElement.name = data.editToDo;
    toDoElement.project = data.editProject;
    toDoElement.deadline = data.editDeadline;
    toDoElement.priority = data.editPrio;

    renderToDo();
  });
  createToDo.addEventListener("click", () => {
    showOverlay();
    showForm(toDoForm);
  });
  seeAllToDos.addEventListener("click", () => {
    renderToDo();
    console.log(toDos);
  });
  renderToDo();
}
function initToDoData() {
  if (storageAvailable("localStorage")) {
    let storage = window.localStorage;

    let toDoData = storage.getItem("toDos")
      ? JSON.parse(storage.getItem("toDos"))
      : [];

    toDoData.forEach((toDo) => {
      Object.setPrototypeOf(toDo, { editToDo });
    });

    return toDoData;
  }

  return [];
}

function uploadToDoData() {
  if (storageAvailable("localStorage")) {
    let storage = window.localStorage;

    let Data_serialized = JSON.stringify(toDos);

    storage.removeItem("toDos");
    storage.setItem("toDos", Data_serialized);
  }
}

export { toDos, initToDoForms, renderToDo };
