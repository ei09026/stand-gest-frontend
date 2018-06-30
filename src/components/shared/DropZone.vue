<template>
    <form class="dropzone"
        :id="id"
        :action="url">
        <slot></slot>
    </form>
</template>

<script>
    export default {
        props: {
            id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            },
            clickable: {
                type: Boolean,
                default: true
            },
            paramName: {
                type: String,
                default: 'file'
            },
            acceptedFileTypes: {
                type: String
            },
            thumbnailHeight: {
                type: Number,
                default: 200
            },
            thumbnailWidth: {
                type: Number,
                default: 200
            },
            showRemoveLink: {
                type: Boolean,
                default: true
            },
            maxFileSizeInMB: {
                type: Number,
                default: 2
            },
            maxNumberOfFiles: {
                type: Number,
                default: 5
            },
            autoProcessQueue: {
                type: Boolean,
                default: true
            },
            headers: {
                type: Object
            },
            language: {
                type: Object,
                default: function () {
                    return {}
                }
            },
            previewTemplate: {
                type: Function,
                default: (options) => {
                    return `
                        <div class="dz-preview dz-file-preview">
                            <div class="dz-image" style="width: ${options.thumbnailWidth}px;height: ${options.thumbnailHeight}px">
                            <img data-dz-thumbnail /></div>
                            <div class="dz-details" style="width: ${options.thumbnailWidth}px;height: ${options.thumbnailHeight}px">
                                <div class="dz-size"><span data-dz-size></span></div>
                                <div class="dz-filename"><span data-dz-name></span></div>
                            </div>
                            <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
                            <div class="dz-error-message"><span data-dz-errormessage></span></div>
                            <div class="dz-success-mark bg-success">${options.doneIcon}</div>
                            <div class="dz-error-mark bg-danger">${options.errorIcon}</div>
                        </div>
                    `
                }
            },
            useCustomDropzoneOptions: {
                type: Boolean,
                default: false
            },
            dropzoneOptions: {
                type: Object,
                default () {
                    return {}
                }
            },
            resizeWidth: {
                type: Number,
                default: null
            },
            resizeHeight: {
                type: Number,
                default: null
            },
            resizeMimeType: {
                type: String,
                default: null
            },
            resizeQuality: {
                type: Number,
                default: 0.8
            },
            resizeMethod: {
                type: String,
                default: 'contain'
            },
            uploadMultiple: {
                type: Boolean,
                default: false
            },
            duplicateCheck: {
                type: Boolean,
                default: false
            },
            parallelUploads: {
                type: Number,
                default: 2
            },
            timeout: {
                type: Number,
                default: 30000
            }
        },
        methods: {
            manuallyAddFile: function (file, fileUrl, callback, crossOrigin, options) {
                this.dropzone.emit('addedfile', file)
                this.dropzone.emit('thumbnail', file, fileUrl)
                this.dropzone.createThumbnailFromUrl(file, fileUrl, callback, crossOrigin)
                this.dropzone.emit('complete', file)

                if (!options || !options.dontSubstractMaxFiles) {
                    // this.dropzone.options['maxFiles'] = this.dropzone.options['maxFiles'] - 1; // doesn't make sense!
                }

                if (!options || !options.dontAddToFiles) {
                    this.dropzone.files.push(file)
                }

                this.$emit('vdropzone-file-added-manually', file)
            },
            setOption: function (option, value) {
                this.dropzone.options[option] = value
            },
            removeAllFiles: function () {
                this.dropzone.removeAllFiles(true)
            },
            processQueue: function () {
                let dropzoneEle = this.dropzone
                this.dropzone.processQueue()
                this.dropzone.on('success', function () {
                    dropzoneEle.options.autoProcessQueue = true
                })
                this.dropzone.on('queuecomplete', function () {
                    dropzoneEle.options.autoProcessQueue = false
                })
            },
            removeFile: function (file) {
                this.dropzone.removeFile(file)
            },
            getAcceptedFiles: function () {
                return this.dropzone.getAcceptedFiles()
            },
            getRejectedFiles: function () {
                return this.dropzone.getRejectedFiles()
            },
            getUploadingFiles: function () {
                return this.dropzone.getUploadingFiles()
            },
            getQueuedFiles: function () {
                return this.dropzone.getQueuedFiles()
            },
            getProp: function (attributeProp, objectProp) {
                if (!this.useCustomDropzoneOptions) {
                    return attributeProp
                }

                if (objectProp !== undefined && objectProp !== null && objectProp !== '') {
                    return objectProp
                } else {
                    return attributeProp
                }
            }
        },
        computed: {
            languageSettings () {
                let defaultValues = {
                    dictDefaultMessage: '<br>' + this.$i18n.t('ui-elements.dropzone.drop-files-here-to-upload'),
                    dictCancelUpload: this.$i18n.t('ui-elements.dropzone.cancel-upload'),
                    dictCancelUploadConfirmation: this.$i18n.t('ui-elements.dropzone.are-you-sure-cancel'),
                    dictFallbackMessage: this.$i18n.t('ui-elements.dropzone.your-browser-doesnt-support-drag-and-drop'),
                    dictFallbackText: this.$i18n.t('ui-elements.dropzone.please-use-form-to-upload'),
                    dictFileTooBig: this.$i18n.t('ui-elements.dropzone.file-is-too-big'),
                    dictInvalidFileType: this.$i18n.t('ui-elements.dropzone.you-cant-upload-files-of-this-type'),
                    dictMaxFilesExceeded: this.$i18n.t('ui-elements.dropzone.you-cant-upload-more-files'),
                    dictRemoveFile: this.$i18n.t('actions.delete'),
                    dictRemoveFileConfirmation: null,
                    dictResponseError: this.$i18n.t('ui-elements.dropzone.server-responded-with-status-code')
                }

                for (let attrname in this.language) {
                    defaultValues[attrname] = this.language[attrname]
                }

                if (this.useCustomDropzoneOptions) {
                    if (this.dropzoneOptions.language) {
                        for (let attrname in this.dropzoneOptions.language) {
                            defaultValues[attrname] = this.dropzoneOptions.language[attrname]
                        }
                    }
                }

                return defaultValues
            },
            cloudIcon: function () {
                return '<i class="fa fa-cloud-upload-alt"></i>'
            },
            doneIcon: function () {
                return '<i class="fa fa-check"></i> ' + this.$i18n.t('general.success')
            },
            errorIcon: function () {
                return '<i class="fa fa-times"></i> ' + this.$i18n.t('general.error')
            }
        },
        mounted () {
            if (this.$isServer) {
                return
            }
            let Dropzone = require('dropzone')
            Dropzone.autoDiscover = false
            let element = document.getElementById(this.id)
            this.dropzone = new Dropzone(element, {
                clickable: this.getProp(this.clickable, this.dropzoneOptions.clickable),
                paramName: this.getProp(this.paramName, this.dropzoneOptions.paramName),
                thumbnailWidth: this.getProp(this.thumbnailWidth, this.dropzoneOptions.thumbnailWidth),
                thumbnailHeight: this.getProp(this.thumbnailHeight, this.dropzoneOptions.thumbnailHeight),
                maxFiles: this.getProp(this.maxNumberOfFiles, this.dropzoneOptions.maxNumberOfFiles),
                maxFilesize: this.getProp(this.maxFileSizeInMB, this.dropzoneOptions.maxFileSizeInMB),
                addRemoveLinks: this.getProp(this.showRemoveLink, this.dropzoneOptions.showRemoveLink),
                acceptedFiles: this.getProp(this.acceptedFileTypes, this.dropzoneOptions.acceptedFileTypes),
                autoProcessQueue: this.getProp(this.autoProcessQueue, this.dropzoneOptions.autoProcessQueue),
                headers: this.getProp(this.headers, this.dropzoneOptions.headers),
                previewTemplate: this.previewTemplate(this),
                dictDefaultMessage: this.cloudIcon + this.languageSettings.dictDefaultMessage,
                dictCancelUpload: this.languageSettings.dictCancelUpload,
                dictCancelUploadConfirmation: this.languageSettings.dictCancelUploadConfirmation,
                dictFallbackMessage: this.languageSettings.dictFallbackMessage,
                dictFallbackText: this.languageSettings.dictFallbackText,
                dictFileTooBig: this.languageSettings.dictFileTooBig,
                dictInvalidFileType: this.languageSettings.dictInvalidFileType,
                dictMaxFilesExceeded: this.languageSettings.dictMaxFilesExceeded,
                dictRemoveFile: this.languageSettings.dictRemoveFile,
                dictRemoveFileConfirmation: this.languageSettings.dictRemoveFileConfirmation,
                dictResponseError: this.languageSettings.dictResponseError,
                resizeWidth: this.getProp(this.resizeWidth, this.dropzoneOptions.resizeWidth),
                resizeHeight: this.getProp(this.resizeHeight, this.dropzoneOptions.resizeHeight),
                resizeMimeType: this.getProp(this.resizeMimeType, this.dropzoneOptions.resizeMimeType),
                resizeQuality: this.getProp(this.resizeQuality, this.dropzoneOptions.resizeQuality),
                resizeMethod: this.getProp(this.resizeMethod, this.dropzoneOptions.resizeMethod),
                uploadMultiple: this.getProp(this.uploadMultiple, this.dropzoneOptions.uploadMultiple),
                parallelUploads: this.getProp(this.parallelUploads, this.dropzoneOptions.parallelUploads),
                timeout: this.getProp(this.timeout, this.dropzoneOptions.timeout)
            })

            // Handle the dropzone events
            let vm = this

            this.dropzone.on('thumbnail', function (file) {
                vm.$emit('vdropzone-thumbnail', file)
            })

            this.dropzone.on('addedfile', function (file) {
                /**
                 * If Duplicate Check enabled remove duplicate file and emit the event.
                 */
                if (vm.duplicateCheck) {
                    if (this.files.length) {
                        var _i, _len
                        for (_i = 0, _len = this.files.length; _i < _len - 1; _i++) {
                            if (this.files[_i].name === file.name) {
                                this.removeFile(file)
                                vm.$emit('duplicate-file', file)
                            }
                        }
                    }
                }

                vm.$emit('vdropzone-file-added', file)
            })

            this.dropzone.on('addedfiles', function (files) {
                vm.$emit('vdropzone-files-added', files)
            })

            this.dropzone.on('removedfile', function (file) {
                vm.$emit('vdropzone-removed-file', file)
            })

            this.dropzone.on('success', function (file, response) {
                vm.$emit('vdropzone-success', file, response)
            })

            this.dropzone.on('successmultiple', function (file, response) {
                vm.$emit('vdropzone-success-multiple', file, response)
            })

            this.dropzone.on('error', function (file, error, xhr) {
                vm.$emit('vdropzone-error', file, error, xhr)
            })

            this.dropzone.on('sending', function (file, xhr, formData) {
                vm.$emit('vdropzone-sending', file, xhr, formData)
            })

            this.dropzone.on('sendingmultiple', function (file, xhr, formData) {
                vm.$emit('vdropzone-sending-multiple', file, xhr, formData)
            })

            this.dropzone.on('queuecomplete', function (file, xhr, formData) {
                vm.$emit('vdropzone-queue-complete', file, xhr, formData)
            })

            this.dropzone.on('totaluploadprogress', function (totaluploadprogress, totalBytes, totalBytesSent) {
                vm.$emit('vdropzone-total-upload-progress', totaluploadprogress, totalBytes, totalBytesSent)
            })

            vm.$emit('vdropzone-mounted')
        },
        beforeDestroy () {
            this.dropzone.disable()
        }
    }
</script>

<style lang="less">
    @import url('~dropzone/dist/basic.css');
    @import url('~dropzone/dist/dropzone.css');

    .dropzone .dz-preview .dz-image {
        border-radius: 7px;
        margin: auto;
    }

    .dropzone .dz-preview .dz-details {
        border-radius: 7px;
        margin: auto;
        padding: 10px 13px;
    }

    .dropzone .dz-preview .dz-details .dz-size {
        border-radius: 3px;
    }

    .dropzone .dz-preview .dz-details .dz-size>span {
        padding: 0 5px;
    }

    .dropzone .dz-preview .dz-details .dz-filename {
        margin: 47px 0 0 0;
        border-radius: 3px;
    }

    .dropzone .dz-preview .dz-details .dz-filename>span {
        padding: 0 5px;
    }

    .dropzone .dz-preview .dz-success-mark,
    .dropzone .dz-preview .dz-error-mark {
        margin: 0px;
        padding: 0px 5px;
        width: initial;
        height: initial;
        border-radius: 3px;
        top: 54px;
        left: 16px;
    }

    .dropzone .dz-preview .dz-error-message {
        background: #ed5565;
    }

    .dropzone .dz-preview .dz-error-message::after {
        border-bottom: 6px solid #ed5565;
    }
</style>
