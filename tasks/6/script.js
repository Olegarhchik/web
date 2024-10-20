window.addEventListener("orientationchange", () => { location.reload(); })

// Шапка
const header = document.querySelector("header");
const burger = document.querySelector(".burger-toggle");
const main = document.querySelector("main");
const footer = document.querySelector("footer");

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

// Каталог
const catalogAdd = document.querySelectorAll(".action > svg");
const catalogContent = document.querySelector(".step-1 ~ .step");
const catalogBtn = document.querySelector(".step-1 ~ .step input:last-child");
let catalogMenu = null;
let catalogBtns = null;

let catalog = {
    order: new Array("cup", "pen", "t-shirt", "cap", "magnet"),
    prices: new Map([
        ["cup", 600],
        ["pen", 300],
        ["t-shirt", 1000],
        ["cap", 800],
        ["magnet", 200]
    ]),
    ratio: new Map([
        ["blue", 0],
        ["black", 0.04],
        ["red", 0.08],
        ["purple", 0.06],
        ["green", 0.02],
        ["faculty", 0.2],
        ["premium", 0.5],
        ["top-wrapper", 0.1]
    ]),
    names: new Map([
        ["cup", "Кружка"],
        ["pen", "Ручка"],
        ["t-shirt", "Футболка"],
        ["cap", "Бейсболка"],
        ["magnet", "Магнитик"]
    ]),
    hex: new Map([
        ["blue", "#0350a0"],
        ["black", "#000"],
        ["red", "#b60000"],
        ["purple", "#790079"],
        ["green", "#060"]
    ]),
    modNames: new Map([
        ["faculty", "логотип факультета"],
        ["premium", "премиум-дизайн"],
        ["top-wrapper", "надежная упаковка"]
    ])
};

function generateCatalogMenu(elem) {
    let tr = document.createElement("tr");
    tr.classList.add("details");
    
    let td = document.createElement("td");
    td.setAttribute("colspan", 3);
    tr.append(td);

    for (let i = 0; i < 2; i++) {
        let colors = new Map([
            ["hex", new Array("#0350a0", "#000", "#b60000", "#790079", "#060")],
            ["names", new Array("Синий", "Черный", "Красный", "Фиолетовый", "Зеленый")],
            ["id", new Array("blue", "black", "red", "purple", "green")]
        ]);

        let div = document.createElement("div");
        div.classList.add(["color", "mod"].at(i));
        div.setAttribute("onWheel", "this.scrollLeft+=event.deltaY>0?40:-40")
        td.append(div);

        let p = document.createElement("p");
        p.innerText = ["Цвет:", "Также включить:"].at(i);
        div.append(p);

        let n = [5, 3].at(i);

        for (let j = 0; j < n; j++) {
            let option = document.createElement("div");
            option.classList.add(["radio", "checkbox"].at(i));
            div.append(option);

            if (i == 0) {
                let span = document.createElement("span");
                span.style.backgroundColor = colors.get("hex")[j];
                option.append(span);
            }

            let input = document.createElement("input");
            input.setAttribute("type", ["radio", "checkbox"].at(i));
            input.setAttribute("id", [colors.get("id"), ["faculty", "premium", "top-wrapper"]][i][j]);
            if (i == 0) input.setAttribute("name", "color");
            if (i == 0 && j == 0) input.setAttribute("checked", true);
            option.append(input);

            let label = document.createElement("label");
            label.setAttribute("for", input.getAttribute("id"));
            label.innerText = [colors.get("names"), ["Логотип факультета", "Премиум-дизайн", "Надежная упаковка"]][i][j];
            option.append(label);
        }
    }

    let cancel = document.createElement("a");
    cancel.classList.add("cancel");
    cancel.classList.add("to-cart-btn");
    cancel.classList.add("products-btn");
    cancel.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="#b60000"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>`;
    td.append(cancel);

    let input = document.createElement("input");
    input.classList.add("to-cart-btn");
    input.classList.add("products-btn");
    input.setAttribute("type", "button");
    input.setAttribute("value", "В корзину");
    td.append(input);

    elem.after(tr);
    return tr;
}

catalogAdd.forEach((btn, i) => {
    const action = btn.parentElement;
    const type = catalog.order[i];
    let priceDisplay = btn.parentElement.previousElementSibling;
    let product;

    btn.addEventListener("click", () => {
        product = new Product(type);

        if (document.querySelector(".catalog-active") != null)
            return;

        action.parentElement.classList.toggle("catalog-active");
        catalogMenu = generateCatalogMenu(action.parentElement);
        catalogBtns = catalogMenu.querySelectorAll(".to-cart-btn");

        product.quantity = Number(btn.nextElementSibling.querySelector("input").value);
        
        const modification = btn.closest("tr").nextElementSibling.querySelectorAll("td > div");

        catalogBtns.forEach((btn) => {
            btn.addEventListener("click", () => {
                addToCart(btn, product);

                action.parentElement.classList.toggle("catalog-active");
                priceDisplay.innerText = `${catalog.prices.get(type)}₽`;
            })
        });

        modification.forEach((mod, i) => {
            mod.addEventListener("click", () => {
                if (i == 0) product.color = mod.querySelector("[type='radio']:checked").id;
                if (i == 1) product.mod = [...mod.querySelectorAll("[type='checkbox']:checked")].map((el) => el.id );

                const price = catalog.prices.get(type);
                const k1 = catalog.ratio.get(product.color);

                let k2 = new Array(0);
                product.mod.forEach((item) => k2.push(catalog.ratio.get(item)))
                k2 = k2.reduce((a, b) => a + b, 0);

                product.price = Math.round(price * (1 + k1 + k2));
                priceDisplay.innerText = `${product.price * product.quantity}₽`;
            })
        })
    })

    const input = action.querySelector("input");
    const minus = action.querySelector(".quantity svg:first-child");
    const plus = action.querySelector(".quantity svg:last-child");

    minus.addEventListener("click", () => {
        if (product.quantity == 1) return;

        product.quantity--;
        
        input.value = `${product.quantity}`;
        priceDisplay.innerText = `${product.price * product.quantity}₽`;
    })
    
    plus.addEventListener("click", () => {
        if (product.quantity <= 0)
            product.quantity = 1;
        else
            product.quantity++;
        
        input.value = `${product.quantity}`;
        priceDisplay.innerText = `${product.price * product.quantity}₽`;
    })
})

function addToCart(elem, product) {
    const i = findProduct(cartData, product);

    if (elem.tagName == "INPUT" && i == -1) {
        if (cartData.filter((elem) => elem != undefined).length == 0)
            catalogBtn.removeAttribute("disabled");
        
        cartData.push(product);
        cartCounter.innerText = `${cartData.filter((elem) => elem != undefined).length}`;
        cartCounter.style.display = "inline-block";
    }

    if (i != -1)
        cartData[i].quantity += product.quantity;
    
    elem.closest("tr").previousElementSibling.querySelector("input[type='number']").value = "1";
    
    catalogMenu.remove();
}

catalogBtn.addEventListener("click", () => {
    catalogContent.classList.toggle("collapsed");
    cartContent.classList.toggle("collapsed");
    fillCartContent();
})

// Корзина
const cartCounter = document.querySelector(".cart-count");
const cartContent = document.querySelector(".step-2 ~ .step");
const cartProducts = document.querySelector("table.cart tbody");
const backToCatalogBtn = document.querySelector(".cart-btns a");
const totalPrice = document.querySelector("p.total");

let cartElements = new Array();
let cartData = new Array();

function Product(type) {
    this.type = type;
    this.color = "blue";
    this.mod = new Array();
    this.price = catalog.prices.get(type);
    this.quantity = 1;
    this.added = false;
}

function findProduct(cart, product) {
    let f = -1;

    cart.forEach((elem, i) => {
        if (elem.type == product.type && 
            elem.color == product.color && 
            elem.mod.every((mod, i) => product.mod[i] == mod) &&
            elem.mod.length == product.mod.length) {
            f = i;
            return;
        }
    })

    return f;
}

backToCatalogBtn.addEventListener("click", () => {
    catalogContent.classList.toggle("collapsed");
    cartContent.classList.toggle("collapsed");
})

function generateName(product) {
    let name = catalog.names.get(product.type);
    let n = product.mod.length;

    product.mod.forEach((elem, i) => {
        if (i == 0) name += " (";

        name += catalog.modNames.get(elem);
    
        if (i == n - 1) name += ")";
        else name += ", ";
    })

    return name;
}

function updData(tr = null, product = null) {
    let total = 0;

    if (tr != null) {
        tr.querySelector(".price").innerText = `${product.price * product.quantity}₽`;
        tr.querySelector(".quantity input").value = product.quantity;
    }

    cartData.forEach((product) => total += product.price * product.quantity );

    totalPrice.innerText = totalPrice.innerText.replace(/[0-9]+/, total);
}

function fillCartContent() {
    cartData.forEach((product, i) => {
        if (product.added) {
            updData(cartElements[i], product);

            const minus = cartElements[i].querySelector("svg:first-child");
            const bin = cartElements[i].querySelector("svg.bin");

            if (product.quantity > 1 && minus.classList.contains("hidden")) {
                bin.classList.add("hidden");
                minus.classList.remove("hidden");
            }

            return;
        };

        const classes = [product.type, "product-color", "price", "add"];
        let tr = document.createElement("tr");
        cartProducts.append(tr);
        cartElements.push(tr);

        for (let j = 0; j < 4; j++) {
            let td = document.createElement("td");
            td.classList.add(classes[j]);

            if (j == 0)
                td.innerText = generateName(product);
            else if (j == 1) {
                let span = document.createElement("span");
                span.style.backgroundColor = catalog.hex.get(product.color);
                td.append(span);
            } else if (j == 2) {
                td.innerText = `${product.price * product.quantity}₽`;
            } else {
                let div = document.createElement("div");
                div.classList.add("quantity");
                div.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#0350a0"><path d="M200-440v-80h560v80H200Z"/></svg>
                <svg class="bin hidden" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#b60000"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                <input disabled min="1" type="number">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#0350a0"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>`;
                div.querySelector("input").value = product.quantity;
                
                const minus = div.querySelector("svg:first-child");
                const plus = div.querySelector("svg:last-child");
                const bin = div.querySelector("svg.bin");
                
                if (product.quantity == 1) {
                    bin.classList.remove("hidden");
                    minus.classList.add("hidden");
                }
                
                minus.addEventListener("click", () => {
                    if (product.quantity == 1) return;

                    if (product.quantity == 2) {
                        bin.classList.remove("hidden");
                        minus.classList.add("hidden");
                    }

                    product.quantity--;
                    updData(cartElements[i], product);
                })
                
                plus.addEventListener("click", () => {
                    if (product.quantity <= 0)
                        product.quantity = 0;

                    if (product.quantity == 1) {
                        bin.classList.add("hidden");
                        minus.classList.remove("hidden");
                    }
                    
                    product.quantity++;
                    updData(cartElements[i], product);
                })

                bin.addEventListener("click", () => {
                    delete cartElements[i];
                    delete cartData[i];

                    cartCounter.innerText = Number(cartCounter.innerText) - 1;

                    if (cartCounter.innerText == "0") {
                        cartCounter.style.display = "none";
                        catalogContent.classList.toggle("collapsed");
                        cartContent.classList.toggle("collapsed");
                        catalogBtn.setAttribute("disabled", "disabled");
                    }

                    updData();
                    tr.remove();
                })

                td.append(div);
            }

            product.added = true;
            tr.append(td);
        }
    })

    updData();
}
