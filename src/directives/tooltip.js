var initialize = function (el, binding) {
    // Default options.
    // For the documentation about options, please refer to:
    // https://getbootstrap.com/docs/3.3/javascript/#tooltips-options
    var defaultOptions = {
        placement: 'top',
        container: 'body'
    }

    var options = Object.assign(defaultOptions, binding.value)

    $(el).tooltip(options)
}

export default {
    bind (el, binding) {
        initialize(el, binding)
    },

    update (el, binding) {
        if (binding.value.title !== binding.oldValue.title) {
            $(el).tooltip('hide')
            .attr('data-original-title', binding.value.title)
            .tooltip('fixTitle')
        }
    },

    unbind (el) {
        $(el).tooltip('destroy')
    }
}
