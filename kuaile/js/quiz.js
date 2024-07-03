console.log('begin');
const btns = document.querySelector('.dropdown-menu').querySelectorAll('li');
let quizList = [];

for (let i = 0; i < btns.length; i++) {
  btns[i].addEventListener('click', showQuiz);
}

const submitBtn = document.querySelector('.submit');
submitBtn.addEventListener('click', () => {
  const quizNode = document.querySelector('#quiz');
  quizNode.style.display = 'none';
  const postNode = document.querySelector('#post');
  postNode.style.display = 'block';
});

function showQuiz(event) {
  const difficulty = event.target.textContent || event.target.innerText;
  console.log('我点了，点的是谁？', difficulty);
  quizList = generateQuizzes(difficulty);

  const tableBody = document.querySelector('.table').querySelector('tbody');
  tableBody.innerHTML = ''; // 清空表格内容

  for (let i = 0; i < quizList.length; i++) {
    const quiz = quizList[i];
    const tr = document.createElement('tr');
    const indexTd = document.createElement('td');
    indexTd.textContent = i + 1;
    tr.appendChild(indexTd);

    const questionTd = document.createElement('td');
    questionTd.textContent = quiz.join(' ');
    tr.appendChild(questionTd);

    const answerTd = document.createElement('td');
    answerTd.textContent = ''; // 答案这里先空着，等用户提交后再填写
    tr.appendChild(answerTd);

    tableBody.appendChild(tr);
  }

  const postNode = document.querySelector('#post');
  postNode.style.display = 'none';
  const quizNode = document.querySelector('#quiz');
  quizNode.style.display = 'block';
}

function generateQuizzes(difficulty) {
  let quizList = [];
  const numQuestions = 5;

  switch (difficulty) {
    case '白银':
      quizList = generateMultipleQuizzes(numQuestions, generateQuizSilver);
      break;
    case '青铜':
      quizList = generateMultipleQuizzes(numQuestions, generateQuizBronze);
      break;
    case '王者':
      quizList = generateMultipleQuizzes(numQuestions, generateQuizKing);
      break;
    default:
      console.log('选择了无效的难度级别');
  }

  console.log('生成的题目集合:', quizList);
  return quizList;
}

function generateMultipleQuizzes(numQuestions, generateFunc) {
  let quizzes = [];
  for (let j = 0; j < numQuestions; j++) {
    const quiz = generateFunc();
    quizzes.push(quiz);
  }
  return quizzes;
}

function generateQuizSilver() {
  let quiz = [];
  for (let i = 0; i < 5; i++) {
    if (i % 2 === 0) {
      quiz.push(Math.round(Math.random() * 20));
    } else {
      quiz.push(generateOp());
    }
  }
  return quiz;
}

function generateQuizBronze() {
  let quiz = [];
  for (let i = 0; i < 5; i++) {
    if (i % 2 === 0) {
      quiz.push(Math.round(Math.random() * 10));
    } else {
      quiz.push(generateOp());
    }
  }
  return quiz;
}

function generateQuizKing() {
  let quiz = [];
  for (let i = 0; i < 5; i++) {
    if (i % 2 === 0) {
      quiz.push(Math.round(Math.random() * 100));
    } else {
      quiz.push(generateOp());
    }
  }
  return quiz;
}

function generateOp() {
  const ops = ['+', '-', '*', '/'];
  return ops[Math.floor(Math.random() * 4)];
}
