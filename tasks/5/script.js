const header = document.querySelector("header");
const main = document.querySelector("main");
const footer = document.querySelector("footer");

const burger = document.querySelector(".burger-toggle");
const select = document.querySelector("select");
const options = document.querySelectorAll("option");
const button = document.querySelector("input[type='button']");
const form = document.querySelector("form");
const divs = document.querySelectorAll(".step");

let inputs;
let cart = {
    prices: new Map(),
    names: new Map(),
    presence: new Map(),
    total: new Map()
};

cart.prices.set("cup", 600);
cart.prices.set("pen", 300);
cart.prices.set("t-shirt", 1000);
cart.prices.set("cap", 800);
cart.prices.set("magnet", 200);

cart.names.set("cup", "Кружка");
cart.names.set("pen", "Ручка");
cart.names.set("t-shirt", "Футболка");
cart.names.set("cap", "Бейсболка");
cart.names.set("magnet", "Магнитик");

resetCart = function() {
    cart.presence.set("cup", 0);
    cart.presence.set("pen", 0);
    cart.presence.set("t-shirt", 0);
    cart.presence.set("cap", 0);
    cart.presence.set("magnet", 0);

    cart.total.set("cup", 0);
    cart.total.set("pen", 0);
    cart.total.set("t-shirt", 0);
    cart.total.set("cap", 0);
    cart.total.set("magnet", 0);
}

function addListeners() {
    inputs.forEach((input) => {
        input.addEventListener("focus", () => {
            if (input.classList.contains("invalid")) {
                input.classList.remove("invalid");
                input.parentNode.parentNode.nextSibling.innerHTML = "";

                cart.total.set(input.previousSibling.getAttribute("for"), 0);
            }
        })

        input.addEventListener("blur", () => {
            let regexp = /[1-9][0-9]*/;
            let type = input.previousSibling.getAttribute("for");

            if (input.value.match(regexp) == null || input.value.match(regexp)[0] != input.value) {
                input.classList.add("invalid");
                input.parentNode.parentNode.nextSibling.innerHTML = "Неверный формат заполнения";
                return;
            }

            cart.total.set(type, Number(input.value) * cart.prices.get(type));

            document.querySelector(".total").innerHTML = document.querySelector(".total").innerHTML.replace(/[0-9]+/, [...cart.total.values()].reduce((a, b) => a + b));
        })
    })
}

burger.addEventListener("click", () => { 
    const navHeight = document.querySelector("nav").offsetHeight;
    let headerHeight;

    burger.classList.toggle("active");

    if (burger.classList.contains("active")) {
        headerHeight = 80 + navHeight;
    } else {
        headerHeight = 70;
    }

    header.style.height = headerHeight + "px";
    main.style.minHeight = `${window.innerHeight - (headerHeight + 30 + footer.offsetHeight)}px`;
})

window.addEventListener("resize", () => { location.reload(); })

button.addEventListener("click", () => {
    options.forEach((option) => {
        if (!option.matches(":checked"))
            return;

        if (cart.presence.get(option.value) == 1) {
            return;
        }

        let product = document.createElement("div");
        product.classList.add("to-buy");

        let img = document.createElement("img");
        img.setAttribute("src", `img/${option.value}.svg`)
        product.append(img);

        let p = document.createElement("p");
        product.append(p);

        let label = document.createElement("label");
        label.setAttribute("for", option.value);
        label.innerHTML = cart.names.get(option.value);
        p.append(label);

        let input = document.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("value", "1");
        p.append(input);

        let error = document.createElement("div");
        error.classList.add("error");

        divs[1].prepend(error);
        divs[1].prepend(product);
        cart.presence.set(option.value, 1);
        cart.total.set(option.value, cart.prices.get(option.value));

        document.querySelector(".total").innerHTML = `Итого: ${[...cart.total.values()].reduce((a, b) => a + b)} р.`;
    })

    if (Array.from(cart.presence.values()).every((el) => el == 0))
        return;

    inputs = document.querySelectorAll("input[type='text']");
    addListeners();

    divs.forEach((div) => {
        div.classList.toggle("collapsed");
    })
})

document.querySelector(".step-1").addEventListener("click", () => {
    if ([...cart.presence.values()].every((el) => el == 0))
        return;

    let children = divs[1].childNodes;

    for (let i = 0; i < children.length; i++) {
        if (children[i].tagName == "DIV") {
            children[i].remove();
            i--;
        }
    }

    resetCart();

    divs.forEach((div) => {
        div.classList.toggle("collapsed");
    })
})

form.addEventListener("submit", (event) => {
    if (document.querySelectorAll(".invalid").length > 0)
        event.preventDefault();
})