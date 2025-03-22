 // DOM Elements
 const taskForm = document.getElementById('task-form');
 const taskInput = document.getElementById('task-input');
 const taskList = document.getElementById('task-list');
 const emptyState = document.getElementById('empty-state');
 const filterButtons = document.querySelectorAll('.filter-btn');

 // State
 let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
 let currentFilter = 'all';

 // Initialize the app
 function init() {
     renderTasks();
     setupEventListeners();
 }

 // Set up event listeners
 function setupEventListeners() {
     // Add task form submission
     taskForm.addEventListener('submit', addTask);

     // Filter buttons
     filterButtons.forEach(button => {
         button.addEventListener('click', () => {
             // Update active filter button
             filterButtons.forEach(btn => btn.classList.remove('active'));
             button.classList.add('active');
             
             // Update current filter and re-render
             currentFilter = button.dataset.filter;
             renderTasks();
         });
     });
 }

 // Add a new task
 function addTask(e) {
     e.preventDefault();
     
     const taskText = taskInput.value.trim();
     if (!taskText) return;
     
     // Create new task object
     const newTask = {
         id: Date.now().toString(),
         text: taskText,
         completed: false,
         createdAt: new Date()
     };
     
     // Add to tasks array
     tasks.push(newTask);
     
     // Save to localStorage
     saveTasks();
     
     // Clear input
     taskInput.value = '';
     
     // Re-render tasks
     renderTasks();
 }

 // Toggle task completion status
 function toggleTask(taskId) {
     tasks = tasks.map(task => {
         if (task.id === taskId) {
             return { ...task, completed: !task.completed };
         }
         return task;
     });
     
     saveTasks();
     renderTasks();
 }

 // Delete a task
 function deleteTask(taskId) {
     tasks = tasks.filter(task => task.id !== taskId);
     saveTasks();
     renderTasks();
 }

 // Save tasks to localStorage
 function saveTasks() {
     localStorage.setItem('tasks', JSON.stringify(tasks));
 }

 // Render tasks based on current filter
 function renderTasks() {
     // Filter tasks based on current filter
     let filteredTasks = tasks;
     
     if (currentFilter === 'active') {
         filteredTasks = tasks.filter(task => !task.completed);
     } else if (currentFilter === 'completed') {
         filteredTasks = tasks.filter(task => task.completed);
     }
     
     // Clear task list (except empty state)
     const taskItems = document.querySelectorAll('.task-item');
     taskItems.forEach(item => item.remove());
     
     // Show/hide empty state
     if (filteredTasks.length === 0) {
         emptyState.style.display = 'block';
         if (currentFilter === 'all' && tasks.length === 0) {
             emptyState.textContent = 'No tasks yet. Add a task to get started!';
         } else {
             emptyState.textContent = `No ${currentFilter} tasks found.`;
         }
     } else {
         emptyState.style.display = 'none';
     }
     
     // Render each task
     filteredTasks.forEach(task => {
         const taskItem = document.createElement('li');
         taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
         
         taskItem.innerHTML = `
             <input 
                 type="checkbox" 
                 class="task-checkbox" 
                 ${task.completed ? 'checked' : ''}
             >
             <span class="task-text">${task.text}</span>
             <div class="task-actions">
                 <button class="btn btn-delete">Delete</button>
             </div>
         `;
         
         // Add event listeners
         const checkbox = taskItem.querySelector('.task-checkbox');
         checkbox.addEventListener('change', () => toggleTask(task.id));
         
         const deleteButton = taskItem.querySelector('.btn-delete');
         deleteButton.addEventListener('click', () => deleteTask(task.id));
         
         // Add to task list
         taskList.appendChild(taskItem);
     });
 }

 // Initialize the app
 init();