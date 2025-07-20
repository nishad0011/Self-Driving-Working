
const carCanvas = document.querySelector("#carCanvas");
const networkCanvas = document.querySelector("#networkCanvas");

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const width = 230;
carCanvas.width = width;
networkCanvas.width = 400;



const road = new Road(width / 2, width);

let index = 0;
let animationObject = null

let cars = [];
let bestCarBrain = cars[0];
let traffic = [];

function generateCars(N, mutation) {
    const cars = [];
    if (localStorage.getItem('bestCarBrain')) {
        const curBrain = JSON.parse(localStorage.getItem('bestCarBrain'))

        //get saved car and assign to cars[0]
        const car0 = new Car(road.getLaneCenter(1), 100, 40, 60, "AI")
        car0.brain = JSON.parse(JSON.stringify(curBrain))
        cars.push(car0);
        // deepcopy car0 into tempCar and mutate
        for (let i = 1; i < N; i++) {
            tempCar = new Car(road.getLaneCenter(1), 100, 40, 60, "AI")
            tempCar.brain = JSON.parse(JSON.stringify(curBrain))
            NeuralNetwork.mutate(tempCar.brain, mutation);
            cars.push(tempCar);
        }
    } else {
        for (let i = 0; i < N; i++) {
            // constructor(x, y, width, height, controlType, maxspeed = 4)
            cars.push(new Car(road.getLaneCenter(1), 100, 40, 60, "AI"));
        }
    }

    return cars;
}

function generateTraffic(blocks) {
    const traffic = [];
    const offset = 0;
    for (let i = 1; i <= blocks; i++) {
        //get 0,1,or 2 cars
        no_of_parallel_cars = Math.floor(Math.random() * 3);
        switch (no_of_parallel_cars) {
            case 1: {
                let lane = Math.floor(Math.random() * 3);
                const nc = new Car(road.getLaneCenter(lane), offset - 100 * i, 30, 50, 'DUMMYCAR', 2);
                traffic.push(nc);
                break
            }
            case 2: {
                let free_lane = Math.floor(Math.random() * 3);

                const nc = new Car(road.getLaneCenter((free_lane + 1) % 3), offset - (100 * i), 30, 50, 'DUMMYCAR', 2);
                const nc2 = new Car(road.getLaneCenter((free_lane + 2) % 3), offset - (100 * i), 30, 50, 'DUMMYCAR', 2);

                traffic.push(nc);
                traffic.push(nc2);
                break;
            }
            default: {
                break;
            }
        }

    }

    return traffic;
}

function save() {
    console.log("saving best car (No.", index, ")");
    localStorage.setItem("bestCarBrain", JSON.stringify(bestCarBrain.brain));
}
function discard() {
    localStorage.removeItem('bestCarBrain');
    mutation_slider2.value = 1
    mutation_slider_label2.innerText = "Mutation : " + (mutation_slider2.value * 100).toFixed(1) + "%"
}

function animate(time) {
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    //next frame
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.border, []);
    }

    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.border, traffic);
    }

    if (cars[0].controlType != "KEY") {

        //car.update(road.border, traffic);

        bestCarBrain = cars[0];
        let cur_min_y = bestCarBrain.y;
        index = 0;
        for (let z = 1; z < cars.length; z++) {
            if (cars[z].y < cur_min_y) {
                cur_min_y = cars[z].y;
                index = z;
                bestCarBrain = cars[z];
            }
        }


        networkCtx.lineDashOffset = - time / 100; // neural network bias line movement
        Visualizer.drawNetwork(networkCtx, bestCarBrain.brain);

        carCtx.translate(0, -bestCarBrain.y + carCanvas.height * 0.7);



    }
    else {
        carCtx.translate(0, -cars[0].y + carCanvas.height * 0.7);
    }

    road.draw(carCtx);

    // Drawing traffic
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx, 'teal');
    }


    carCtx.globalAlpha = 0.3;
    for (let i = 0; i < cars.length; i++) {
        if (cars[i] != bestCarBrain) cars[i].draw(carCtx, 'blue');
    }
    carCtx.globalAlpha = 1;
    bestCarBrain.draw(carCtx, 'blue', drawSensors = true);


    frames++;

    console.log("Best car is No.", index);


    animationObject = requestAnimationFrame(animate);
}

const mutation_slider2 = document.getElementById("mutation_slider")
const mutation_slider_label2 = document.getElementById("mutation_slider_label")

function start_simulation(N, mutation_slider) {
    if (animationObject) {
        cancelAnimationFrame(animationObject)
    }


    // if no bestCarBrain set mutation to 1
    if (!localStorage.getItem('bestCarBrain')) {
        mutation_slider2.value = 1
        mutation_slider_label2.innerText = "Mutation : " + (mutation_slider2.value * 100).toFixed(1) + "%"
    }
    console.log("Starting new simulation: N=", N, " mutation=", mutation_slider.value);


    cars = generateCars(N, mutation_slider.value);
    // cars = [new Car(road.getLaneCenter(1), 100, 40, 60, 'KEY')];

    // traffic = generateTraffic(10);
    traffic = [
        new Car(road.getLaneCenter(1), -100, 40, 60, 'DUMMYCAR', 2),
        new Car(road.getLaneCenter(0), -300, 40, 60, 'DUMMYCAR', 2),
        new Car(road.getLaneCenter(2), -300, 40, 60, 'DUMMYCAR', 2),
        new Car(road.getLaneCenter(2), -500, 40, 60, 'DUMMYCAR', 2),
        new Car(road.getLaneCenter(1), -500, 40, 60, 'DUMMYCAR', 2),
        new Car(road.getLaneCenter(0), -700, 40, 60, 'DUMMYCAR', 2),
        new Car(road.getLaneCenter(1), -700, 40, 60, 'DUMMYCAR', 2),
    ];



    animate();
}



