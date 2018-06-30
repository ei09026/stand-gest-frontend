export default {
    // Merge Vue-bindable classes
    // classes (Array): Can contain strings, class-binding-objects or arrays of strings
    mergeClasses (classes) {
        if (!Array.isArray(classes)) {
            return null
        }

        let mergedClass = {}

        for (let i=0; i<classes.length; i++) {
            let thisClass = classes[i]

            if (Array.isArray(thisClass)) {
                for (let j=0; j<thisClass.length; j++) {
                    mergedClass[thisClass[j]] = true
                }
            } else if (typeof thisClass === 'object') {
                Object.assign(mergedClass, thisClass)
            } else if (typeof thisClass === 'string') {
                mergedClass[thisClass] = true
            }
        }

        return mergedClass
    }
}
