import mime from 'mime-types'
import fileSaver from 'file-saver'
import jsonExport from 'jsonexport/dist'

let saveFile = (data, mimeType, fileName = null, contentType = null) => {
    var blob = new Blob([data], {type: contentType || mimeType})

    fileSaver.saveAs(blob, (fileName || 'export') + '.' + mime.extension(mimeType))
}

let exportService = {
    // (object) jsonExportOptions: Check available options at:
    // http://kauegimenes.github.io/jsonexport/#customization
    exportCsv (data, fileName = null, jsonExportOptions = null) {
        // Default options
        let options = {
            rowDelimiter: ';',

            handleBoolean (value, name) {
                return value ? 'X' : ''
            }
        }

        if (jsonExportOptions) {
            Object.assign(options, jsonExportOptions)
        }

        jsonExport(data, options, (error, csv) => {
            if (error) {
                throw new Erro(error)
            } else {
                saveFile(csv, 'text/csv', fileName, 'text/csv;charset=utf-8')
            }
        })
    }
}

export default exportService
