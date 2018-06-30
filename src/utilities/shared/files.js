export default {
    downloadString (fileName, data, type) {
        let blob = new Blob([data], { type })

        if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, fileName)
        } else {
            let elem = window.document.createElement('a')

            elem.href = window.URL.createObjectURL(blob)
            elem.download = fileName

            document.body.appendChild(elem)
            elem.click()
            document.body.removeChild(elem)
        }
    }
}
