import "./styles.css";
import { projects, initProjectList, initProjectForms } from "./project.js";
import { toDos, initToDoForms, renderToDo } from "./toDo.js";
import { showForm, hideOverlay, showOverlay } from "./forms.js";
import {
  createDeleteButton,
  createEditButton,
  setTransitionDelay,
} from "./buttons.js";

const projectForm = document.getElementById("projectForm");
const toDoForm = document.getElementById("toDoForm");
const overlay = document.querySelector(".overlay");
const TableBody = document.querySelector(".tableBody");
const buttons = document.querySelectorAll("button");

function initApp() {
  initProjectForms();
  initToDoForms();
  initProjectList();
}

(() => {
  const prio = document.getElementById("prio");
  const editPrio = document.getElementById("editPrio");
  const prioOutput = document.querySelectorAll(".rangeValue");

  prio.addEventListener("input", () => {
    prioOutput.forEach((element) => (element.textContent = prio.value));
  });
  editPrio.addEventListener("input", () => {
    prioOutput.forEach((element) => (element.textContent = editPrio.value));
  });

  buttons.forEach((element) => {
    setTransitionDelay(element);
  });
})();

initApp();
