import { showForm, hideOverlay, showOverlay } from "./forms.js";
import {
  createDeleteButton,
  createEditButton,
  setTransitionDelay,
} from "./buttons.js";
import { renderToDo } from "./toDo.js";
import { storage, storageAvailable } from "./storage.js";
import deleteImageSRC from "../Images/icons8-löschen-50.png";
import deleteGifSRC from "../Images/icons8-löschen.gif";
import editImageSRC from "../Images/icons8-neu-erstellen-64.png";

const projectForm = document.getElementById("projectForm");
const editProjectForm = document.getElementById("editProjectForm");
const projectSelectToDoForm = document.querySelectorAll(".projectName");
const projectButton = document.getElementById("createProjectButton");
const projectContainer = document.getElementById("projectContainer");
const projectNameProjectForm = document.getElementById("editProjectName");
const projectIDFormE = document.getElementById("projectID");

let projects = initProjectData();

class project {
  constructor(name) {
    this.projectID = crypto.randomUUID();
    this.name = name;
  }
}

function editProject(element) {
  showOverlay();
  showForm(editProjectForm);
  projectNameProjectForm.value = element.name;
  projectIDFormE.value = element.projectID;
}
function deleteProject(project) {
  projects.forEach((element, index) => {
    element.projectID === project.projectID ? projects.splice(index, 1) : null;
  });
  renderProjects();
}

function addProject(projectData) {
  console.log(projectData.projectName);
  const newProject = new project(projectData.projectName);
  projects.push(newProject);
  renderProjects();
}

function initProjectList() {
  projectSelectToDoForm.forEach((element) => (element.innerHTML = ""));
  if (projects.length === 0) {
    projectSelectToDoForm.forEach((element) => {
      const filler = document.createElement("option");
      filler.value = "No Project";
      filler.textContent = "No Project Yet!";

      element.appendChild(filler);
    });
  } else {
    for (const project of projects) {
      projectSelectToDoForm.forEach((element) => {
        const projectOption = document.createElement("option");
        projectOption.textContent = project.name;
        projectOption.value = project.name;

        element.appendChild(projectOption);
      });
    }
  }
}

function renderProjects() {
  uploadProjectData();
  initProjectList();

  projectContainer.innerHTML = "";
  projects.forEach((element, index) => {
    const projectButton = document.createElement("button");
    projectButton.classList.add("project");
    projectButton.dataset.projectID = element.projectID;
    projectButton.textContent = element.name;

    projectButton.addEventListener("click", () => {
      renderToDo(element.name);
    });

    setTransitionDelay(projectButton);

    const editButton = createEditButton();
    const deleteButton = createDeleteButton();

    editButton.addEventListener("click", () => {
      element.editProject(element);
    });
    deleteButton.addEventListener("click", () => {
      element.deleteProject(element);
    });

    editButton.style.left = "auto";
    editButton.style.right = "-110px";
    editButton.style.top = "0px";

    deleteButton.style.right = "-50px";
    deleteButton.style.top = "0px";

    projectButton.appendChild(editButton);
    projectButton.appendChild(deleteButton);

    editButton.style.opacity = "0";
    deleteButton.style.opacity = "0";

    projectButton.addEventListener("mouseenter", () => {
      editButton.style.opacity = "1";
      deleteButton.style.opacity = "1";
    });
    projectButton.addEventListener("mouseleave", () => {
      editButton.style.opacity = "0";
      deleteButton.style.opacity = "0";
    });
    projectContainer.appendChild(projectButton);
  });
}

function initProjectForms() {
  projectForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(projectForm);
    projectForm.reset();
    const data = Object.fromEntries(formData.entries());
    hideOverlay();
    addProject(data);
  });

  editProjectForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(editProjectForm);
    editProjectForm.reset();
    const Data = Object.fromEntries(formData.entries());
    hideOverlay();

    console.log(project.projectID);
    console.log(Data.projectID);
    projects.find((project) => project.projectID === Data.projectID).name =
      Data.editProjectName;
    renderProjects();
    initProjectList();
  });

  projectButton.addEventListener("click", () => {
    showForm(projectForm);
    showOverlay();
  });
  renderProjects();
}

function initProjectData() {
  if (storageAvailable("localStorage")) {
    let storage = window.localStorage;

    let projectData = storage.getItem("projects")
      ? JSON.parse(storage.getItem("projects"))
      : [];

    projectData.forEach((element) => {
      Object.setPrototypeOf(element, { editProject, deleteProject });
    });

    return projectData;
  }

  return [];
}

function uploadProjectData() {
  if (storageAvailable("localStorage")) {
    let storage = window.localStorage;

    let Data_serialized = JSON.stringify(projects);

    storage.removeItem("projects");
    storage.setItem("projects", Data_serialized);
  }
}

export { projects, initProjectList, initProjectForms };
