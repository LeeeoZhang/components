!function () {
    class FullPage {
        constructor(pageContainer, duration) {
            this.pageContainer = pageContainer
            this.duration = duration
            this.currentIndex = 0
            this.isAnimate = false
            this.targetIndex = 0
            this.bindEvents()
        }

        bindEvents() {
            this.pageContainer.addEventListener('wheel', (e) => {
                this.targetIndex = this.currentIndex + (e.deltaY > 0 ? 1 : -1)
                this.gotoSection(this.targetIndex).then(() => {
                    this.currentIndex = this.targetIndex
                    this.isAnimate = false
                }).catch((error) => {
                    console.log(error)
                })
            })
        }

        gotoSection() {
            let _this = this
            return new Promise((resolve, reject) => {
                if (this.isAnimate) {
                    return reject()
                } else if (this.targetIndex < 0) {
                    return reject()
                } else if (this.targetIndex >= this.pageContainer.children.length) {
                    return reject()
                }
                this.isAnimate = true
                this.pageContainer.children[0].addEventListener('transitionend', function callback() {
                    _this.pageContainer.children[0].removeEventListener('transitionend', callback)
                    resolve()
                })
                for (let i = 0; i < this.pageContainer.children.length; i++) {
                    this.pageContainer.children[i].style.transform = `translateY(-${100 * this.targetIndex}%)`
                }
            })
        }
    }
    new FullPage(document.querySelector('.page'))
}()


