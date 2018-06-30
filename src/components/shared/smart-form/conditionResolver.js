export default {
    resolve (a, operator, b, type = null) {
        /* eslint-disable */
        switch (operator) {
            case '>':
                return this.gt(a, b, type)
            case '>=':
                return this.gte(a, b, type)
            case '<':
                return this.lt(a, b, type)
            case '<=':
                return this.lte(a, b, type)
            case '==':
                return this.equals(a, b, type)
            case '!=':
                return this.notEquals(a, b, type)
            case 'between':
                return this.between(a, b, type)
            case 'notBetween':
                return this.notBetween(a, b, type)
            case 'in':
                return this.in(a, b, type)
            case 'notIn':
                return this.except(a, b, type)
        }
        /* eslint-enable */
    },

    // a > b
    gt (a, b, type = null) {
        // TODO: type specific type comparisons

        return a > b
    },

    // a >= b
    gte (a, b, type = null) {
        return a >= b
    },

    // a < b
    lt (a, b, type = null) {
        return this.gte(b, a, type)
    },

    // a <= b
    lte (a, b, type = null) {
        return this.gt(b, a, type)
    },

    // a === b
    equals (a, b, type = null) {
        return a === b
    },

    // a !== b
    notEquals (a, b, type = null) {
        return !this.equals(a, b, type)
    },

    // a >= b[0] && a <= b[1]
    between (a, b, type = null) {
        return a >= b[0] && a <= b[1]
    },

    notBetween (a, b, type = null) {
        return !this.between(a, b, type)
    },

    // a in b[]
    in (a, b, type = null) {
        return b.indexOf(a) >= 0
    },

    // a not in b[]
    notIn (a, b, type = null) {
        return !this.in(a, b, type)
    }
}
