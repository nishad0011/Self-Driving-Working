const mutation_slider = document.getElementById("mutation_slider")
const mutation_slider_label = document.getElementById("mutation_slider_label")
mutation_slider.addEventListener("input", (e) => {
    mutation_slider_label.innerText = "Mutation : " + ((e.target.value * 100).toFixed(1)) + "%"
})

const no_of_cars = document.getElementById("no_of_cars")
let simulation = start_simulation(50, 1);

const start_btn = document.getElementById("start_btn")
start_btn.addEventListener("click", () => {
    simulation = start_simulation(no_of_cars.value, mutation_slider, random_traffic_cb.checked, load_bestcar_cb.checked);
})


//Random traffic toggle handler
const random_traffic_cb = document.getElementById("random_traffic_cb")
const toggle = document.getElementById("toggle")
const toggle_btn = document.getElementById("toggle_btn")

toggle.addEventListener("click", () => {
    random_traffic_cb.click();
})

random_traffic_cb.addEventListener("change", (e) => {
    if (random_traffic_cb.checked) {
        toggle.classList.add("toggle_enabled")
        toggle_btn.classList.add("toggle_btn_enabled")
    } else {
        toggle.classList.remove("toggle_enabled")
        toggle_btn.classList.remove("toggle_btn_enabled")
    }
})

//Best car toggle handler
const load_bestcar_cb = document.getElementById("load_bestcar_cb")
const best_car_toggle = document.getElementById("best_car_toggle")
const best_car_toggle_btn = document.getElementById("best_car_toggle_btn")

best_car_toggle.addEventListener("click", () => {
    load_bestcar_cb.click();
})

load_bestcar_cb.addEventListener("change", (e) => {
    if (load_bestcar_cb.checked) {
        best_car_toggle.classList.add("toggle_enabled")
        best_car_toggle_btn.classList.add("toggle_btn_enabled")

        mutation_slider.disabled = true;
        no_of_cars.disabled = true;
    } else {
        best_car_toggle.classList.remove("toggle_enabled")
        best_car_toggle_btn.classList.remove("toggle_btn_enabled")

        mutation_slider.disabled = false;
        no_of_cars.disabled = false;
    }
})