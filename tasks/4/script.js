const form = document.querySelector('.login form');
const labels = form.querySelectorAll('label');
const submit = form.querySelector('input[type="submit"]');

form.addEventListener("submit", (event) => {
    event.preventDefault();

    let valid = true;

    for (let label of labels) {
        let input = label.querySelector('input').value;
        let error = label.querySelector('.error');

        if (input && error != null) {
            error.remove();
        }
        
        if (!input) {
            valid = false;

            if (error != null) continue;

            error = document.createElement('p');
            error.classList.add('error');
            error.innerText = "Поле должно быть заполнено";

            label.append(error);
        }
    }
    
    if (valid) form.submit();
})