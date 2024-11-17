const form = document.querySelector('.login form');
const close = document.querySelector('.close a');

const labels = form.querySelectorAll('.login div');
const fields = form.querySelectorAll('input, textarea');
const submit = form.querySelector('input[type="submit"]');

const regexps = new Map([
    ["fio", /^[А-Я][а-я]+\s[А-Я][а-я]+\s[А-Я][а-я]+$/],
    ["email", /^[\w\.]+\@\w+\.\w+/],
    ["phone", /^(\+7|8)\d{10}$/],
    ["organization", /\S+/],
    ["message", /\S+/]
])

const formStatus = document.createElement('div');
formStatus.classList.add('form-status');
document.querySelector('.login').before(formStatus);

function checkInput(label) {
    let input = label.querySelector('input');

    if (input == null)
        input = label.querySelector('textarea');

    if (!/\S+/.test(input.value))
        return "Заполните поле";
    
    if (!regexps.get(label.classList[0]).test(input.value))
        return "Неверный формат ввода";

    return "";
}

function showMessage(message) {
    formStatus.innerText = message;
    formStatus.style.left = `${(window.innerWidth - formStatus.offsetWidth) / 2}px`;
    formStatus.classList.toggle('show');

    setTimeout(() => formStatus.classList.toggle('show'), 3000);
}

form.addEventListener('submit', (event) => {
    event.preventDefault();

    let valid = true;

    for (let label of labels) {
        if (label.classList.contains('consent'))
            continue;

        let errorMessage = checkInput(label);
        let hasError = (label.querySelector('.error') != null);

        if (!errorMessage && hasError) {
            label.querySelector('.error').remove();
        }
        
        if (errorMessage) {
            valid = false;

            if (hasError) {
                label.querySelector('.error').innerText = errorMessage;
                continue;
            };

            error = document.createElement('p');
            error.classList.add('error');
            error.innerText = errorMessage;

            label.append(error);
        }
    }

    if (valid) {
        fields.forEach(field => localStorage.removeItem(field.name));

        fetch('https://formcarry.com/some-endpoint', {
            method: 'POST',
            body: new FormData(form),
        }).then(response => {
            history.back();

            if (response.ok) {
                form.reset();
                showMessage("Форма успешно отправлена");
            } else {
                showMessage("При отправки формы произошла ошибка")
            }
        });
    }
})

fields.forEach(field => {
    field.addEventListener('input', () => {
        localStorage.setItem(field.name, field.value);
    });

    const savedValue = localStorage.getItem(field.name);

    if (savedValue) {
        field.value = savedValue;
    }
});

close.addEventListener('click', () => {
    history.back();
})