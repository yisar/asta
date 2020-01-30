import { observable, observe } from '@nx-js/observer-util'

const person = observable({
  firstName: 'Bob',
  lastName: 'Smith',
  name:() =>(`${this.firstName} ${this.lastName}`)
})

observe(() => console.log(person.name))


// logs 'Ann Smith'
person.firstName = 'Ann'
