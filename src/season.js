'use strict'

const assert = require('assert')
const ExtDateTime = require('./interface')
const { pad } = require('./date')

const V = new WeakMap()

class Season extends ExtDateTime {
  constructor(input) {
    super()

    V.set(this, [])

    switch (typeof input) {
    case 'number':
      this.year = input
      this.season = arguments[1] || 21
      break

    case 'string':
      input = Season.parse(input)
      // eslint-disable-line no-fallthrough

    case 'object':
      if (Array.isArray(input))
        input = { values: input }

      {
        assert(input !== null)
        if (input.type) assert.equal('Season', input.type)

        assert(input.values)
        assert.equal(2, input.values.length)

        this.year = input.values[0]
        this.season = input.values[1]
      }
      break

    case 'undefined':
      this.year = new Date().getUTCFullYear()
      this.season = 21
      break

    default:
      throw new RangeError('Invalid season value')
    }
  }

  get year() {
    return this.values[0]
  }

  set year(year) {
    return this.values[0] = Number(year)
  }

  get season() {
    return this.values[1]
  }

  set season(season) {
    return this.values[1] = Number(season)
  }

  get values() {
    return V.get(this)
  }

  // TODO next/prev

  get min() { // eslint-disable-line complexity
    switch (this.season) {
    case 21:
    case 25:
    case 32:
    case 33:
    case 40:
    case 37:
      return ExtDateTime.UTC(this.year, 0)

    case 22:
    case 26:
    case 31:
    case 34:
      return ExtDateTime.UTC(this.year, 3)

    case 23:
    case 27:
    case 30:
    case 35:
    case 41:
      return ExtDateTime.UTC(this.year, 6)

    case 24:
    case 28:
    case 29:
    case 36:
      return ExtDateTime.UTC(this.year, 9)

    case 38:
      return ExtDateTime.UTC(this.year, 4)

    case 39:
      return ExtDateTime.UTC(this.year, 8)

    default:
      return ExtDateTime.UTC(this.year, 0)
    }
  }

  get max() { // eslint-disable-line complexity
    switch (this.season) {
    case 21:
    case 25:
    case 32:
    case 33:
      return ExtDateTime.UTC(this.year, 3) - 1

    case 22:
    case 26:
    case 31:
    case 34:
    case 40:
      return ExtDateTime.UTC(this.year, 6) - 1

    case 23:
    case 27:
    case 30:
    case 35:
      return ExtDateTime.UTC(this.year, 9) - 1

    case 24:
    case 28:
    case 29:
    case 36:
    case 41:
    case 39:
      return ExtDateTime.UTC(this.year + 1, 0) - 1

    case 37:
      return ExtDateTime.UTC(this.year, 5) - 1

    case 38:
      return ExtDateTime.UTC(this.year, 9) - 1

    default:
      return ExtDateTime.UTC(this.year + 1, 0) - 1
    }
  }

  toEDTF() {
    return `${pad(this.year)}-${this.season}`
  }
}

module.exports = Season
