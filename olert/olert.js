!function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory)
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory()
    } else {
        root.olert = factory()
    }
}(window, () => {
    class Olert {
        constructor () {
            this.wrap = null
            this.contentWrap = null
            this.olertWrap = null
            this.confirmBtn = null
            this.confirmHandler = null
            this.loadingWrap = null
            this.init()
            this.bind()
        }


        $ (selector){
            return document.querySelector(selector)
        }

        $$ (selector) {
            return document.querySelectorAll(selector)
        }

        init () {
            let olertlHtml = `<div class="olert">
                                <p class="content"></p>
                                <div class="confirm-button">确定</div>
                        </div>`
            let loadingHtml = `<div class="loading">
                                    <i class="loading-icon"></i>
                                    <div class="loading-text"></div>
                               </div>`
            let modalWrap = document.createElement('div')
            let loadingWrap = document.createElement('div')
            modalWrap.classList.add('olert-modal')
            modalWrap.innerHTML = olertlHtml
            loadingWrap.classList.add('loading-modal')
            loadingWrap.innerHTML = loadingHtml
            document.body.appendChild(modalWrap)
            document.body.appendChild(loadingWrap)
            this.wrap = this.$('.olert-modal')
            this.contentWrap = this.$('.olert-modal .content')
            this.olertWrap = this.$('.olert-modal .olert')
            this.confirmBtn = this.$('.olert-modal .confirm-button')
            this.loadingWrap = this.$('.loading-modal')
        }

        show (options) {
            this.contentWrap.innerText = options.title
            this.olertWrap.classList.add(options.tween)
            this.wrap.style.display = 'block'
            this.confirmHandler = options.confirm
        }

        bind () {
            this.confirmBtn.addEventListener('click', () => {
                this.wrap.style.display = 'none'
                this.confirmHandler && this.confirmHandler.call()
            })
        }

        showLoading (options) {
            this.$('.loading-modal .loading-text').innerText = options.title || '加载中...'
            this.loadingWrap.style.display = 'block'
        }

        hideLoading () {
            this.loadingWrap.style.display = 'none'
        }
    }
    return new Olert()
})