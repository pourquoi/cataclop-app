const nav = {
    frames: [],
    view: undefined
}

const plugin = {

    install(Vue, options) {

        Vue.prototype.$setNavFrames = function (frames) {
            nav.frames = frames
        }
        Vue.prototype.$setNavView = function (view) {
            nav.view = view
        }
        Vue.prototype.$nav = nav

        Vue.prototype.$navTo = function (c, opts) {
            if (opts && opts.frame && nav.frames.indexOf(opts.frame) !== -1) {
                if (nav.view) nav.view.selectedIndex = nav.frames.indexOf(opts.frame)
                this.$store.commit('setFrame', opts.frame)
            }
            return this.$navigateTo(c, opts)
        }
    }
};

export default plugin;