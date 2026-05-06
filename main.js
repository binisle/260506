// ── 1. 랜덤 배경 이미지 (Picsum Photos) ──────────────────
const randomNum = Math.floor(Math.random() * 1000);
document.body.style.backgroundImage = "url(https://picsum.photos/seed/" + randomNum + "/1920/1080)";

// ── 2. 실시간 시계 ─────────────────────────────────────────
const timeEl = document.getElementById("time");

function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");
  timeEl.innerText = `${h}:${m}:${s}`;
}
updateClock();
setInterval(updateClock, 1000);

// ── 3. 로그인 (localStorage) ───────────────────────────────
const greetingEl = document.getElementById("greeting-text");
const USERNAME_KEY = "username";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function setGreeting(name) {
  greetingEl.innerText = `${getGreeting()}, ${name}! 👋`;
}

const savedName = localStorage.getItem(USERNAME_KEY);
if (savedName) {
  setGreeting(savedName);
} else {
  const name = prompt("What is your name?");
  if (name && name.trim()) {
    localStorage.setItem(USERNAME_KEY, name.trim());
    setGreeting(name.trim());
  }
}

// ── 4. 할 일 목록 (localStorage) ──────────────────────────
const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const TODO_KEY = "todos";

function saveTodos(todos) {
  localStorage.setItem(TODO_KEY, JSON.stringify(todos));
}

function getTodos() {
  return JSON.parse(localStorage.getItem(TODO_KEY) || "[]");
}

function renderTodos() {
  const todos = getTodos();
  todoList.innerHTML = "";
  todos.forEach(function(todo, idx) {
    const li = document.createElement("li");
    if (todo.done) li.classList.add("done");

    const text = document.createElement("span");
    text.innerText = todo.text;
    text.className = "text";
    text.addEventListener("click", function() { toggleTodo(idx); });

    const del = document.createElement("span");
    del.innerText = "✕";
    del.className = "del";
    del.addEventListener("click", function() { deleteTodo(idx); });

    li.appendChild(text);
    li.appendChild(del);
    todoList.appendChild(li);
  });
}

function toggleTodo(idx) {
  const todos = getTodos();
  todos[idx].done = !todos[idx].done;
  saveTodos(todos);
  renderTodos();
}

function deleteTodo(idx) {
  const todos = getTodos();
  todos.splice(idx, 1);
  saveTodos(todos);
  renderTodos();
}

todoForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const text = todoInput.value.trim();
  if (!text) return;
  const todos = getTodos();
  todos.push({ text: text, done: false });
  saveTodos(todos);
  todoInput.value = "";
  renderTodos();
});

renderTodos();

// ── 5. 날씨 (Open-Meteo — API 키 불필요) ──────────────────
const weatherEl = document.getElementById("weather-temp");

function getWeather(lat, lon) {
  fetch(
    "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon + "&current_weather=true"
  )
    .then(function(res) { return res.json(); })
    .then(function(data) {
      const temp = Math.round(data.current_weather.temperature);
      weatherEl.innerText = temp + "°C";
    })
    .catch(function() {
      weatherEl.innerText = "";
    });
}

function onGeoSuccess(pos) {
  getWeather(pos.coords.latitude, pos.coords.longitude);
}

function onGeoError() {
  weatherEl.innerText = "";
}

navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError);
