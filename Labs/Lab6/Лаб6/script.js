// Лабораторная работа 6 — проверка формы заказа

const form   = document.getElementById("orderForm");
const result = document.getElementById("result");
const f      = form.elements;   // поля формы (form.name занят именем самой формы)

// Показать ошибку под полем и подсветить поле
function showError(id, message) {
    document.getElementById(id + "-error").textContent = message;
    const field = document.getElementById(id);
    if (field) field.classList.add("invalid");
}

// Убрать все ошибки
function clearErrors() {
    document.querySelectorAll(".error").forEach(e => e.textContent = "");
    document.querySelectorAll(".invalid").forEach(e => e.classList.remove("invalid"));
}

// Проверка всех полей. Возвращает true, если ошибок нет
function validate() {
    clearErrors();
    let ok = true;

    // Имя: обязательно, только буквы (рус./лат.), пробел или дефис, от 2 до 30 символов
    const name = f["name"].value.trim();
    if (name === "") {
        showError("name", "Введите имя");
        ok = false;
    } else if (!/^[А-Яа-яЁёA-Za-z][А-Яа-яЁёA-Za-z\s-]{1,29}$/.test(name)) {
        showError("name", "Имя должно содержать только буквы (от 2 до 30 символов)");
        ok = false;
    }

    // Email: обязательно, формат имя@домен.зона
    const email = f.email.value.trim();
    if (email === "") {
        showError("email", "Введите электронную почту");
        ok = false;
    } else if (!/^[\w.-]+@[\w-]+(\.[\w-]+)*\.[A-Za-z]{2,}$/.test(email)) {
        showError("email", "Некорректный email, пример: ivan@mail.ru");
        ok = false;
    }

    // Телефон: обязательно, российский номер +7 или 8 и ещё 10 цифр
    const phone = f.phone.value.trim();
    const digits = phone.replace(/[\s()-]/g, "");
    if (phone === "") {
        showError("phone", "Введите номер телефона");
        ok = false;
    } else if (!/^(\+7|8)\d{10}$/.test(digits)) {
        showError("phone", "Некорректный номер, пример: +7 900 123-45-67");
        ok = false;
    }

    // Одежда и размер: должны быть выбраны
    if (f.clothes.value === "") {
        showError("clothes", "Выберите товар");
        ok = false;
    }
    if (f.size.value === "") {
        showError("size", "Выберите размер");
        ok = false;
    }

    // Количество: целое число от 1 до 10
    const quantity = f.quantity.value.trim();
    if (quantity === "") {
        showError("quantity", "Укажите количество");
        ok = false;
    } else if (!/^\d+$/.test(quantity) || +quantity < 1 || +quantity > 10) {
        showError("quantity", "Количество — целое число от 1 до 10");
        ok = false;
    }

    // Адрес: обязателен только при доставке курьером, не короче 10 символов
    const address = f.address.value.trim();
    if (f.delivery.value === "Курьер") {
        if (address === "") {
            showError("address", "Введите адрес доставки");
            ok = false;
        } else if (address.length < 10) {
            showError("address", "Адрес слишком короткий (минимум 10 символов)");
            ok = false;
        }
    }

    // Согласие с условиями
    if (!f.agree.checked) {
        showError("agree", "Необходимо согласиться с условиями заказа");
        ok = false;
    }

    return ok;
}

// Отправка формы
form.addEventListener("submit", function (event) {
    event.preventDefault();          // не перезагружаем страницу
    result.classList.add("hidden");

    if (!validate()) return;

    // Собираем данные
    const data = [
        ["Имя",            f["name"].value.trim()],
        ["Email",          f.email.value.trim()],
        ["Телефон",        f.phone.value.trim()],
        ["Одежда",         f.clothes.value],
        ["Размер",         f.size.value],
        ["Количество",     f.quantity.value],
        ["Способ доставки", f.delivery.value],
        ["Адрес",          f.address.value.trim() || "—"],
        ["Способ оплаты",  f.payment.value]
    ];

    // Выводим данные на экран
    let html = "<h2>Заказ оформлен!</h2><table>";
    data.forEach(([key, value]) => {
        const safe = String(value).replace(/</g, "&lt;").replace(/>/g, "&gt;");
        html += "<tr><td>" + key + "</td><td>" + safe + "</td></tr>";
    });
    html += "</table>";

    result.innerHTML = html;
    result.classList.remove("hidden");

    // Очищаем форму
    form.reset();
});

// Кнопка «Очистить» убирает и ошибки
form.addEventListener("reset", clearErrors);

// Ошибка у поля пропадает, когда пользователь начинает его исправлять
form.addEventListener("input", function (event) {
    const id = event.target.id;
    const err = document.getElementById(id + "-error");
    if (err) {
        err.textContent = "";
        event.target.classList.remove("invalid");
    }
});
