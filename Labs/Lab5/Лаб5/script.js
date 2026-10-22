// Лабораторная работа 5 — вариант 6

// Вывод результата и на страницу, и в консоль
function print(outId, text) {
    document.getElementById(outId).textContent = text;
    console.log(text);
}


/* ===================================================
   ЗАДАНИЕ 1. Дан день, месяц и год.
   Определить, корректна ли дата (без объекта Date).
   =================================================== */

function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function daysInMonth(month, year) {
    switch (month) {
        case 2:
            return isLeapYear(year) ? 29 : 28;
        case 4: case 6: case 9: case 11:
            return 30;
        default:
            return 31;
    }
}

// Возвращает пустую строку, если дата корректна, иначе — причину ошибки
function checkDate(day, month, year) {
    if (!Number.isInteger(day) || !Number.isInteger(month) || !Number.isInteger(year)) {
        return "день, месяц и год должны быть целыми числами";
    }
    if (year < 1) {
        return "год должен быть положительным";
    }
    if (month < 1 || month > 12) {
        return "месяц должен быть от 1 до 12";
    }
    const maxDay = daysInMonth(month, year);
    if (day < 1 || day > maxDay) {
        return "в этом месяце дней от 1 до " + maxDay;
    }
    return "";
}

document.getElementById("btn1").onclick = function () {
    const dayText   = document.getElementById("day").value;
    const monthText = document.getElementById("month").value;
    const yearText  = document.getElementById("year").value;

    if (dayText === "" || monthText === "" || yearText === "") {
        print("out1", "Ошибка: заполните день, месяц и год");
        return;
    }

    const day   = Number(dayText);
    const month = Number(monthText);
    const year  = Number(yearText);

    const error = checkDate(day, month, year);
    const date  = day + "." + month + "." + year;

    if (error === "") {
        print("out1", "Дата " + date + " корректна" +
            (month === 2 && day === 29 ? " (" + year + " — високосный год)" : ""));
    } else {
        print("out1", "Дата " + date + " некорректна: " + error);
    }
};


/* ===================================================
   ЗАДАНИЕ 2
   =================================================== */

const EPS = 1e-5;

// Чтение массива из поля ввода
function readArray() {
    const text = document.getElementById("arr").value.trim();
    if (text === "") return null;

    const arr = text.split(/[\s,;]+/).map(Number);
    if (arr.some(isNaN)) return null;
    return arr;
}

// Часть А (без методов Array — только циклы и индексы):
// сумма элементов между первым и последним элементами, для которых |x - e| <= 1e-5
function partA(arr) {
    let first = -1;
    let last = -1;

    for (let i = 0; i < arr.length; i++) {
        if (Math.abs(arr[i] - Math.E) <= EPS) {
            if (first === -1) first = i;
            last = i;
        }
    }

    if (first === -1 || first === last) {
        return { first: first, last: last, sum: null };
    }

    let sum = 0;
    for (let i = first + 1; i < last; i++) {
        sum += arr[i];
    }

    return { first: first, last: last, sum: sum };
}

// Часть Б (с методами Array):
// удалить элементы, у которых сумма цифр модуля целой части — простое число
function isPrime(n) {
    if (n < 2) return false;
    for (let i = 2; i * i <= n; i++) {
        if (n % i === 0) return false;
    }
    return true;
}

function digitSum(x) {
    return String(Math.abs(Math.trunc(x)))
        .split("")
        .reduce((sum, d) => sum + Number(d), 0);
}

function shouldRemove(x) {
    return isPrime(digitSum(x));
}

function partB(arr) {
    return arr.filter(x => !shouldRemove(x));
}

// Случайный массив из 10 чисел от -100 до 100, в который на 2 случайных места вставлено число e
document.getElementById("btnRand").onclick = function () {
    const arr = Array.from({ length: 10 }, () => +(Math.random() * 200 - 100).toFixed(1));

    const i = Math.floor(Math.random() * 5);        // в первой половине
    const j = 5 + Math.floor(Math.random() * 5);    // во второй половине
    arr[i] = 2.718282;
    arr[j] = 2.718282;

    document.getElementById("arr").value = arr.join(" ");
};

document.getElementById("btn2").onclick = function () {
    const arr = readArray();

    if (arr === null) {
        print("out2", "Ошибка: введите числа через пробел или запятую");
        return;
    }

    let text = "Исходный массив: [" + arr.join(", ") + "]\n\n";

    // Часть А
    const a = partA(arr);
    if (a.first === -1) {
        text += "Часть А: в массиве нет чисел, близких к e (|x - e| <= 1e-5)\n";
    } else if (a.sum === null) {
        text += "Часть А: найдено только одно число, близкое к e (индекс " + a.first +
                "), между элементами нечего суммировать\n";
    } else {
        text += "Часть А: первое число, близкое к e, — индекс " + a.first +
                ", последнее — индекс " + a.last + "\n";
        text += "Сумма элементов между ними = " + +a.sum.toFixed(6) + "\n";
    }

    // Часть Б
    const removed = arr.filter(shouldRemove);
    const b = partB(arr);
    text += "\nЧасть Б: удалены элементы [" + removed.join(", ") + "]\n";
    text += "Результат: [" + b.join(", ") + "]";

    print("out2", text);
};


/* ===================================================
   ЗАДАНИЕ 4. Дано предложение.
   Найти самое длинное слово в предложении.
   =================================================== */

function longestWords(sentence) {
    // Слово — последовательность букв, цифр и дефисов (знаки препинания отбрасываем)
    const words = sentence.match(/[A-Za-zА-Яа-яЁё0-9-]+/g) || [];

    let maxLength = 0;
    for (const w of words) {
        if (w.length > maxLength) maxLength = w.length;
    }

    // Если самых длинных слов несколько — возвращаем все (без повторов)
    const result = words.filter(w => w.length === maxLength);
    return { words: [...new Set(result)], length: maxLength };
}

document.getElementById("btn4").onclick = function () {
    const sentence = document.getElementById("sentence").value.trim();

    if (sentence === "") {
        print("out4", "Ошибка: введите предложение");
        return;
    }

    const r = longestWords(sentence);

    if (r.words.length === 0) {
        print("out4", "В предложении нет слов");
        return;
    }

    if (r.words.length === 1) {
        print("out4", "Самое длинное слово: «" + r.words[0] + "» (" + r.length + " символов)");
    } else {
        print("out4", "Самые длинные слова (" + r.length + " символов): «" +
            r.words.join("», «") + "»");
    }
};
