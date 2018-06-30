let allowedTypes = [
    {
        key: 'csv',
        icon: 'fas fa-file-excel',
        title: 'CSV'
    },
    {
        key: 'pdf',
        icon: 'fas fa-file-pdf',
        title: 'PDF'
    }
]

export default {
    getTypesFromKeys (keys) {
        return allowedTypes.filter(type => {
            return keys.indexOf(type.key) >= 0
        })
    }
}
