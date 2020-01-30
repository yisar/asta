import { reactive, watch } from '../dist/reactivity'

const person = reactive({
  first: 'Bob',
  last: 'Smith',
  get full() {
    return `${this.first} ${this.last}`
  }
})

watch(() => console.log(person.full))
watch(() => console.log(person.first))
person.first = 'Ann'
