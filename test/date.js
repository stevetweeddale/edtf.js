'use strict'

const { Date } = require('..')

describe('Date', () => {

  describe('constructor()', () => {
    it('Date', () =>
      expect(new Date(new global.Date(2015, 11)))
        .to.be.an.edtf
        .and.have.year(2015))

    it('ExtDate', () => {
      const a = new Date()
      const b = new Date(a)

      expect(b).to.be.an.edtf.and.not.equal(a)
    })
  })

  describe('.next()', () => {
    it('YYYY', () => {
      expect(new Date([1980]).next().edtf).to.eql('1981')
      expect(new Date([-1]).next().edtf).to.eql('0000')
    })

    it('YYYY-MM', () => {
      expect(new Date([1980, 7]).next().edtf).to.eql('1980-09')
      expect(new Date([-1, 11]).next().edtf).to.eql('0000-01')
      expect(new Date([2015, 11]).next().edtf).to.eql('2016-01')
    })

    it('YYYY-MM-DD', () => {
      expect(new Date([1980, 7, 24]).next().edtf).to.eql('1980-08-25')
      expect(new Date([-1, 11, 31]).next().edtf).to.eql('0000-01-01')
      expect(new Date([2016, 1, 28]).next().edtf).to.eql('2016-02-29')
      expect(new Date([2015, 1, 28]).next().edtf).to.eql('2015-03-01')
    })
  })

  describe('comparison operators', () => {
    it('<', () => {
      expect(new Date([1980])).to.be.below(new Date([1980, 7]))
    })

    it('>', () => {
      expect(new Date('198X')).to.be.above(new Date('196X'))
    })
  })

  describe('compare()', () => {
    function compare(a, b) {
      return new Date(a).compare(new Date(b))
    }

    it('no overlap', () => {
      expect(compare([2001], [2002])).to.eql(-1)
      expect(compare([2002], [2001])).to.eql(1)
      expect(compare([2001], [2001])).to.eql(0)
    })
  })

  describe('between()', () => {
    function between(a, b) {
      return [...new Date(a).between(new Date(b))].map(d => d.values)
    }

    it('YYYY', () => {
      expect(between([2001], [2002])).to.eql([])
      expect(between([2001], [2001])).to.eql([])
      expect(between([2002], [2001])).to.eql([])
      expect(between([2003], [2001])).to.eql([[2002]])
    })
  })

  describe('until()', () => {
    function until(a, b) {
      return [...new Date(a).until(new Date(b))].map(d => d.values)
    }

    it('YYYY', () => {
      expect(until([2001], [2002])).to.eql([[2001], [2002]])
      expect(until([2001], [2001])).to.eql([[2001]])
      expect(until([2002], [2001])).to.eql([[2002], [2001]])
      expect(until([2003], [2001])).to.eql([[2003], [2002], [2001]])
    })
  })

  describe('.edtf', () => {
    it('default', () =>
      expect(new Date().edtf)
        .to.match(/^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d\.\d\d\dZ$/))

    it('YYYY', () => {
      expect(new Date([2014]).edtf).to.eql('2014')
      expect(new Date([123]).edtf).to.eql('0123')
      expect(new Date([14]).edtf).to.eql('0014')
      expect(new Date([0]).edtf).to.eql('0000')
      expect(new Date([-2]).edtf).to.eql('-0002')
      expect(new Date([-42]).edtf).to.eql('-0042')
      expect(new Date([-9999]).edtf).to.eql('-9999')
    })

    it('YYYY-MM', () => {
      expect(new Date([2014, 3]).edtf).to.eql('2014-04')
      expect(new Date([123, 0]).edtf).to.eql('0123-01')
      expect(new Date([14, 8]).edtf).to.eql('0014-09')
      expect(new Date([0, 0]).edtf).to.eql('0000-01')
      expect(new Date([-2, 11]).edtf).to.eql('-0002-12')
    })

    it('YYYY-MM-DD', () => {
      expect(new Date([2014, 3, 15]).edtf).to.eql('2014-04-15')
      expect(new Date([2016, 1, 29]).edtf).to.eql('2016-02-29')
      expect(new Date([2015, 1, 29]).edtf).to.eql('2015-03-01')
    })

    it('YYYY-MM-XX', () =>
      expect(new Date({ values: [2014, 3, 15], unspecified: 'day' }).edtf)
        .to.eql('2014-04-XX'))

    it('YYYY-XX-DD', () =>
      expect(new Date({ values: [2014, 3, 15], unspecified: 'month' }).edtf)
        .to.eql('2014-XX-15'))

    it('XXXX-MM-DD', () =>
      expect(new Date({ values: [2014, 3, 15], unspecified: 'year' }).edtf)
        .to.eql('XXXX-04-15'))

    it('XXXX-XX-DD', () =>
      expect(new Date({ values: [2014, 3, 15], unspecified: 'xxxxxxdd' }).edtf)
        .to.eql('XXXX-XX-15'))

    it('YXYX-MX-DD', () =>
      expect(new Date({ values: [2014, 3, 15], unspecified: 'yxyxmxdd' }).edtf)
        .to.eql('2X1X-0X-15'))

    it('YYYY-MM-DD?', () =>
      expect(new Date({ values: [2014, 3, 15], uncertain: true }).edtf)
        .to.eql('2014-04-15?'))

    it('YYYY-MM-?DD', () =>
      expect(new Date({ values: [2014, 3, 15], uncertain: 'day' }).edtf)
        .to.eql('2014-04-?15'))

    it('YYYY-MM?-DD', () =>
      expect(new Date({ values: [2014, 3, 15], uncertain: 'xxxxxxdd' }).edtf)
        .to.eql('2014-04?-15'))

    it('YYYY-?MM-DD', () =>
      expect(new Date({ values: [2014, 3, 15], uncertain: 'month' }).edtf)
        .to.eql('2014-?04-15'))

    it('YYYY?-MM-DD', () =>
      expect(new Date({ values: [2014, 3, 15], uncertain: 'year' }).edtf)
        .to.eql('2014?-04-15'))

    it('YYYY-MM?-~DD', () =>
      expect(new Date({
        values: [2004, 5, 11], uncertain: 'xxxxxxdd', approximate: 'day'
      }).edtf).to.eql('2004-06?-~11'))

    it('YYYY-%MM-DD', () =>
      expect(new Date({
        values: [2004, 5, 11], uncertain: 'month', approximate: 'month'
      }).edtf).to.eql('2004-%06-11'))

    it('YYYY%-MM-DD', () =>
      expect(new Date({
        values: [2004, 5, 11], uncertain: 'year', approximate: 'year'
      }).edtf).to.eql('2004%-06-11'))

    it('YYYY?-MM~-DD', () =>
      expect(new Date({
        values: [2004, 5, 11], uncertain: 'year', approximate: 'xxxxxxdd'
      }).edtf).to.eql('2004?-06~-11'))

    it('YYYY?-MM-?DD', () =>
      expect(new Date({
        values: [2004, 5, 11], uncertain: 'xxxxmmxx'
      }).edtf).to.eql('2004?-06-?11'))

    it('YYYY-?MM-?DD', () =>
      expect(new Date({
        values: [2004, 5, 11], uncertain: 'yyyyxxxx'
      }).edtf).to.eql('2004-?06-?11'))
  })
})
