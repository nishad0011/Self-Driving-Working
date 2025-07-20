const _ = require('lodash');
class Person {
    constructor(name) {
        this.name = name
    }
    prnt() {
        console.log("name is", this.name);
        return
    }
}

let person = new Person("nishad")

let person2 = _.cloneDeep(person);
person2.name = "a"

person.prnt()
person2.prnt()
