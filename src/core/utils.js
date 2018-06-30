let utils = {
    getJSONFromServerAsync (url) {
        return new Promise((resolve, reject) => {
            var xhttp = new XMLHttpRequest()
            var responseText

            xhttp.onreadystatechange = function () {
                if (xhttp.readyState === 4 && xhttp.status === 200) {
                    responseText = JSON.parse(xhttp.responseText)
                    resolve(responseText)
                }
            }

            xhttp.open('GET', url, true)
            xhttp.send()
        })
    }
}

export default utils
