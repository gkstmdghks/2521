let problems = [];
let currentIndex = null;
let isAdmin = false;
let editIndex = -1;

const pageName = window.location.pathname.split("/").pop();
const subjectKey = pageName.replace(".html", "");
const STORAGE_KEY = `problems_${subjectKey}`;

const ADMIN_PASSWORD = "1234";

// 관리자 로그인
function checkAdmin() {
  const input = document.getElementById("admin-pass").value;
  if (input === ADMIN_PASSWORD) {
    isAdmin = true;
    document.getElementById("admin-section").style.display = "block";
    document.getElementById("admin-login").style.display = "none";
    renderProblems();
  } else {
    alert("비밀번호가 틀렸습니다!");
  }
}

// 문제 저장
function saveProblems() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(problems));
  renderProblems();
}

// 문제 불러오기
function loadProblems() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) problems = JSON.parse(saved);
  renderProblems();
}

// 문제 추가 또는 수정
function addProblem() {
  if (!isAdmin) return alert("관리자만 문제를 추가할 수 있습니다!");

  const title = document.getElementById("title").value.trim();
  const imageUrl = document.getElementById("image-url")?.value.trim() || "";
  const answer = document.getElementById("answer").value.trim();

  if (!title || !answer) {
    alert("제목과 정답은 반드시 입력해야 합니다!");
    return;
  }

  const problem = { title, imageUrl, answer };

  if (editIndex !== -1) {
    problems[editIndex] = problem;
    editIndex = -1;
    document.querySelector("#add-problem button").textContent = "문제 추가";
  } else {
    problems.push(problem);
  }

  document.getElementById("title").value = "";
  if (document.getElementById("image-url")) document.getElementById("image-url").value = "";
  document.getElementById("answer").value = "";

  saveProblems();
}

// 문제 목록 렌더링
function renderProblems() {
  const list = document.getElementById("problems");
  list.innerHTML = "";

  problems.forEach((p, i) => {
    const li = document.createElement("li");
    li.textContent = p.title;
    li.onclick = () => showProblem(i);

    if (isAdmin) {
      const delBtn = document.createElement("button");
      delBtn.textContent = "삭제";
      delBtn.style.marginLeft = "10px";
      delBtn.onclick = (e) => {
        e.stopPropagation();
        if (confirm(`'${p.title}' 문제를 삭제할까요?`)) {
          problems.splice(i, 1);
          saveProblems();
        }
      };

      const editBtn = document.createElement("button");
      editBtn.textContent = "수정";
      editBtn.style.marginLeft = "5px";
      editBtn.onclick = (e) => {
        e.stopPropagation();
        document.getElementById("title").value = p.title;
        if (document.getElementById("image-url")) document.getElementById("image-url").value = p.imageUrl;
        document.getElementById("answer").value = p.answer;
        editIndex = i;
        document.querySelector("#add-problem button").textContent = "수정 완료";
      };

      li.appendChild(delBtn);
      li.appendChild(editBtn);
    }

    list.appendChild(li);
  });
}

// 문제 풀기
function showProblem(index) {
  currentIndex = index;
  const p = problems[index];
  document.getElementById("solve-title").textContent = p.title;
  const img = document.getElementById("solve-image");

  if (p.imageUrl) {
    img.src = p.imageUrl;
    img.style.display = "block";
  } else {
    img.style.display = "none";
  }

  document.getElementById("solve-section").style.display = "block";
  document.getElementById("user-answer").value = "";
  document.getElementById("result").textContent = "";
}

// 정답 확인
function checkAnswer() {
  const userInput = document.getElementById("user-answer").value.trim().toLowerCase();
  const correct = problems[currentIndex].answer.trim().toLowerCase();
  const result = document.getElementById("result");

  if (userInput === correct) {
    result.textContent = "✅ 정답입니다!";
    result.style.color = "green";
  } else {
    result.textContent = "❌ 오답입니다!";
    result.style.color = "red";
  }
}

window.onload = loadProblems;
