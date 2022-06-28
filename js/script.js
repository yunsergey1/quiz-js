// Получаем все необходимые элементы

const startBtn = document.querySelector(".start__btn button");
const infoBox = document.querySelector(".info__box");
const quitBtn = infoBox.querySelector(".buttons .quit");
const continueBtn = infoBox.querySelector(".buttons .continue");
const quizBox = document.querySelector(".quiz__box");
const nextBtn = quizBox.querySelector(".next__btn");
const totalQuestions = quizBox.querySelector(".total__questions");
const optionList = document.querySelector(".option__list");
const timerCounter = quizBox.querySelector(".timer__sec");
const timerLine = quizBox.querySelector(".timer__line");
const quizHeader = quizBox.querySelector(".quiz__box header");
const resultBox = document.querySelector(".result__box");
const restartQuiz = resultBox.querySelector(".restart");
const quitQuiz = resultBox.querySelector(".quit");
const resultScoreText = resultBox.querySelector(".score__text");
const timerOff = quizBox.querySelector(".timer__text");

// Если кликнуть на кнопку "Начать QUIZ"
startBtn.onclick = () => {
	infoBox.classList.add('active'); // Показать ПРАВИЛА ИГРЫ
}

// Нажимаем на кнопку ВЫЙТИ ИЗ QUIZ
quitBtn.onclick = () => {
	infoBox.classList.remove('active'); // Скрыть ПРАВИЛА ИГРЫ
}

let questionCount = 0;
let counter;
let timeValue = 15;
let userScore = 0;

restartQuiz.onclick = () => {
	quizBox.classList.add("active");
	resultBox.classList.remove("active");
	let questionCount = 0;
	let counter;
	let timeValue = 15;
	let userScore = 0;
	showQuestions(questionCount);
	questionsCounter(questionCount);
	clearInterval(counter);
	startTimer(timeValue);
	clearInterval(counterLine);
	startTimerLine(0);
	nextBtn.style.display = "none";
	timerOff.textContent = "Осталось сек."
}

quitQuiz.onclick = () => {
	window.location.reload();
}

// Нажимаем на кнопку ПРОДОЛЖИТЬ
continueBtn.onclick = () => {
	quizBox.classList.add('active'); // Показать QUIZ BOX
	infoBox.classList.remove('active'); // Скрыть ПРАВИЛА ИГРЫ
	showQuestions(questionCount);
	questionsCounter(questionCount);
	startTimer(timeValue);
	startTimerLine(0);
}

// Нажимаем на СЛЕДУЮЩИЙ ВОПРОС
nextBtn.onclick = () => {
	if (questionCount < questions.length - 1) {
		questionCount++;
		clearInterval(counter);
		startTimer(timeValue);
		startTimerLine(0);
		showQuestions(questionCount);
		questionsCounter(questionCount);
		nextBtn.style.display = "none";
		timerOff.textContent = "Осталось сек."
	} else {
		clearInterval(counter);
		clearInterval(counterLine);
		console.log('ВОПРОСЫ ЗАКОНЧИЛИСЬ!')
		showResultBox();
	}
}

// Получаем вопрос и варианты ответов из массива
showQuestions = (index) => {
	const questionText = document.querySelector(".question__text");
	let optionElements = document.querySelectorAll(".option");

	// Проверяем, есть ли в контейнере блоки с вопросами
	if (optionList.childNodes.length > 0) {
		optionElements.forEach(e => e.remove()); // если они есть, то удаляем блоки с вопросами.
	};

	// Создаем элемент с вопросом.
	let questionTag = `<span>${questions[index].num}. ${questions[index].question}</span>`;
	// Вставляем элемент с вопросом в Заголовок блока
	questionText.innerHTML = questionTag;

	// Выводим список вопросов в блок
	questions[index].options.forEach(text => {
		let optionText = `<li class="option"><span>${text}</span></li>`
		optionList.insertAdjacentHTML('beforeend', optionText);
	});

	// Добавляем к каждому элементу функцию onclick="optionSelected()"
	const option = optionList.querySelectorAll(".option");
	option.forEach(e => {
		e.setAttribute("onclick", "optionSelected(this)");
	})
}


optionSelected = (answer) => {
	clearInterval(counter);
	clearInterval(counterLine);
	let userAnswer = answer.textContent; // получаем значение ответа
	let correctAnswer = questions[questionCount].answer;
	let correct = `<i class="icon check"><img src="/img/check.svg"></img></i>`;
	let wrong = `<i class="icon cross"><img src="/img/cross.svg"></img></i>`;
	let optionElements = quizBox.querySelectorAll('.option');
	if (userAnswer == correctAnswer) {
		userScore += 1;
		console.log('ваш счет:' + userScore)
		console.log('ВЫ ДАЛИ ВЕРНЫЙ ОТВЕТ!')
		answer.insertAdjacentHTML('beforeend', correct);
		answer.classList.add('correct');
	} else {
		console.log('ВЫ ОТВЕТИЛИ НЕПРАВИЛЬНО(((((((');
		answer.insertAdjacentHTML('beforeend', wrong);
		answer.classList.add('wrong');

		// если ответ неверный, то автоматически подсвечивать верный ответ
		optionElements.forEach(e => {
			if (e.textContent == correctAnswer) {
				e.setAttribute("class", "option correct");
			}
		})
	}

	// после выбора ответа отключаем остальные кнопки
	optionElements.forEach(e => e.classList.add("disabled"));
	nextBtn.style.display = "block";
}

showResultBox = () => {
	infoBox.classList.remove('active'); // Скрыть ПРАВИЛА ИГРЫ
	quizBox.classList.remove('active'); // Скрыть QUIZ BOX
	resultBox.classList.add('active'); // Показать
	if (userScore == questions.length) {
		let scoreText = `<span>Вы правильно ответили на <p>ВСЕ</p> <p>${questions.length}</p> вопросов!</span>`;
		resultScoreText.insertAdjacentHTML('beforeend', scoreText);
	} else if (userScore > questions.length / 2) {
		let scoreText = `<span>Вы набрали <p>${userScore}</p>из <p>${questions.length}</p></span>`;
		resultScoreText.insertAdjacentHTML('beforeend', scoreText);
	} else {
		let scoreText = `<span>к сожалению, Вы набрали лишь <p>${userScore}</p>из <p>${questions.length}</p></span> `;
		resultScoreText.insertAdjacentHTML('beforeend', scoreText);
	}
};


// Делаем таймер
startTimer = (time) => {
	counter = setInterval(timer, 1000); 
	function timer() {
		let optionElements = quizBox.querySelectorAll('.option');
		if (time < 10) {
			timerCounter.textContent = `0${time}`;
		} else {
			timerCounter.textContent = time;
		}
		time--;
		if (time < 0) {
			clearInterval(counter); // Останавливаем таймер
			timerCounter.textContent = "00";
			timerOff.textContent = "Время вышло"

			let correctAnswer = questions[questionCount].answer;
			// если ответ неверный, то автоматически подсвечивать верный ответ
			optionElements.forEach(e => {
				if (e.textContent == correctAnswer) {
					e.setAttribute("class", "option correct");
				}
			})
			// после выбора ответа отключаем остальные кнопки
			optionElements.forEach(e => e.classList.add("disabled"));
			nextBtn.style.display = "block";
		}
	};
}

// Делаем таймер линию
startTimerLine = (time) => {
	timerStep = quizHeader.clientWidth / timeValue
	counterLine = setInterval(timer, 100); 
	function timer() {
		time += timerStep/11;
		timerLine.style.width = time + 'px';
		if (time >= quizHeader.clientWidth) {
			clearInterval(counterLine); // Останавливаем таймер
		}
	};
}

// Выводим счетчик вопросов в футер
questionsCounter = (index) => {
	totalQuestions.innerHTML = `<span><p>${index + 1}</p>из<p>${questions.length}</p>вопросов</span>`;
}



