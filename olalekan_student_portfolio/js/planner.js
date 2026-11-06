// Interactive academic planner: create, edit, complete, delete, filter and search tasks.
// Data is stored locally in this browser. It is not synced to a server.
document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "olalekanAcademicTasks_v1";
  const form = document.getElementById("task-form");
  if (!form) return;

  const $ = id => document.getElementById(id);
  const fields = {
    id: $("task-id"), title: $("task-title"), description: $("task-description"),
    category: $("task-category"), priority: $("task-priority"), due: $("task-due")
  };
  const list = $("task-list");
  let tasks = loadTasks();
  let activeFilter = "all";
  let searchTerm = "";

  function loadTasks() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(saved) ? saved : [];
    } catch (error) {
      console.warn("Could not read saved planner tasks.", error);
      return [];
    }
  }
  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      alert("Your browser could not save the tasks. Check available storage.");
    }
  }
  function safeText(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
  }
  function isOverdue(task) {
    return Boolean(task.due && !task.completed && task.due < new Date().toISOString().slice(0, 10));
  }
  function updateDashboard() {
    const completed = tasks.filter(task => task.completed).length;
    const pending = tasks.length - completed;
    const overdue = tasks.filter(isOverdue).length;
    const percent = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
    $("total-count").textContent = tasks.length;
    $("completed-count").textContent = completed;
    $("pending-count").textContent = pending;
    $("overdue-count").textContent = overdue;
    $("progress-label").textContent = percent + "%";
    $("progress-fill").style.width = percent + "%";
    $("progress-message").textContent = tasks.length
      ? `${completed} of ${tasks.length} tasks completed. Keep moving forward.`
      : "Add your first task to start tracking your progress.";
  }
  function renderTasks() {
    const filtered = tasks.filter(task => {
      const matchesFilter = activeFilter === "all" ||
        (activeFilter === "completed" && task.completed) ||
        (activeFilter === "pending" && !task.completed);
      const haystack = `${task.title} ${task.description} ${task.category}`.toLowerCase();
      return matchesFilter && haystack.includes(searchTerm);
    }).sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      if (a.due && b.due) return a.due.localeCompare(b.due);
      return a.due ? -1 : b.due ? 1 : b.createdAt - a.createdAt;
    });

    $("visible-count").textContent = `${filtered.length} task${filtered.length === 1 ? "" : "s"}`;
    if (!filtered.length) {
      list.innerHTML = `<div class="empty-state"><span>✳</span><h4>No matching tasks</h4><p>Try another filter or add a new activity.</p></div>`;
      updateDashboard();
      return;
    }
    list.innerHTML = filtered.map(task => {
      const dueLabel = task.due ? new Date(task.due + "T00:00:00").toLocaleDateString() : "No due date";
      const priorityClass = `priority-${task.priority.toLowerCase()}`;
      return `<article class="task-item ${task.completed ? "completed" : ""}">
        <input class="task-check" type="checkbox" data-action="toggle" data-id="${safeText(task.id)}" aria-label="Mark ${safeText(task.title)} complete" ${task.completed ? "checked" : ""}>
        <div class="task-main"><strong>${safeText(task.title)}</strong>
          ${task.description ? `<p>${safeText(task.description)}</p>` : ""}
          <div class="task-meta"><span>${safeText(task.category)}</span><span class="${priorityClass}">${safeText(task.priority)} priority</span><span class="${isOverdue(task) ? "overdue" : ""}">${isOverdue(task) ? "Overdue · " : ""}${safeText(dueLabel)}</span></div>
        </div>
        <div class="task-actions"><button type="button" data-action="edit" data-id="${safeText(task.id)}">Edit</button><button type="button" data-action="delete" data-id="${safeText(task.id)}" aria-label="Delete ${safeText(task.title)}">Delete</button></div>
      </article>`;
    }).join("");
    updateDashboard();
  }
  function resetForm() {
    form.reset();
    fields.id.value = "";
    $("form-heading").textContent = "Create a task";
    $("save-task").innerHTML = 'Add task <span>＋</span>';
    $("cancel-edit").classList.add("hidden");
  }
  form.addEventListener("submit", event => {
    event.preventDefault();
    const title = fields.title.value.trim();
    if (!title) {
      fields.title.focus();
      return;
    }
    const existingIndex = tasks.findIndex(task => task.id === fields.id.value);
    const taskData = {
      id: fields.id.value || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title,
      description: fields.description.value.trim(),
      category: fields.category.value,
      priority: fields.priority.value,
      due: fields.due.value,
      completed: existingIndex >= 0 ? tasks[existingIndex].completed : false,
      createdAt: existingIndex >= 0 ? tasks[existingIndex].createdAt : Date.now()
    };
    if (existingIndex >= 0) tasks[existingIndex] = taskData;
    else tasks.push(taskData);
    saveTasks();
    resetForm();
    renderTasks();
  });
  $("cancel-edit").addEventListener("click", resetForm);
  list.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const task = tasks.find(item => item.id === button.dataset.id);
    if (!task) return;
    if (button.dataset.action === "delete") {
      if (confirm(`Delete "${task.title}"?`)) {
        tasks = tasks.filter(item => item.id !== task.id);
        if (fields.id.value === task.id) resetForm();
        saveTasks();
        renderTasks();
      }
    } else if (button.dataset.action === "edit") {
      fields.id.value = task.id;
      fields.title.value = task.title;
      fields.description.value = task.description;
      fields.category.value = task.category;
      fields.priority.value = task.priority;
      fields.due.value = task.due;
      $("form-heading").textContent = "Edit task";
      $("save-task").innerHTML = 'Save changes <span>✓</span>';
      $("cancel-edit").classList.remove("hidden");
      fields.title.focus();
    }
  });
  list.addEventListener("change", event => {
    const checkbox = event.target.closest('input[data-action="toggle"]');
    if (!checkbox) return;
    const task = tasks.find(item => item.id === checkbox.dataset.id);
    if (task) {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    }
  });
  document.querySelectorAll(".filter-btn").forEach(button => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      document.querySelectorAll(".filter-btn").forEach(item => item.classList.toggle("active", item === button));
      renderTasks();
    });
  });
  $("task-search").addEventListener("input", event => {
    searchTerm = event.target.value.trim().toLowerCase();
    renderTasks();
  });
  renderTasks();
});
