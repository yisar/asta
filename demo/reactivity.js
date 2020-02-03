import { reactive, watch, computed } from '../dist/index'

const person = reactive({
  first: 'Bob',
  last: 'Smith'
})



watch(() => console.log(person.first), 1)
person.first = 'Ann'
person.first = 'Haha'
person.first = 'lala'
