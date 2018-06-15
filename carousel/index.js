!function () {
    class Carousel {
        constructor (option) {
            this.startX = 0
            this.diffX = 0
            this.wrap1 = option.wrap1
            this.wrap2 = option.wrap2
            this.pageNum = option.pageNum
            this.eachWidth = option.eachWidth
            this.onTransitionEnd = option.onTransitionEnd
            this.preIndex = -1
            this.currentIndex = 0
            this.nextIndex = 1
            this.lock = false
            this.bind()
        }

        bind () {
            this.wrap2.style.width = this.eachWidth * this.pageNum
            this.wrap1.addEventListener('touchstart', (event) => {
                this.startX = event.touches[0].pageX
            })
            this.wrap1.addEventListener('touchmove', (event) => {
                this.diffX = event.touches[0].pageX - this.startX
            })
            this.wrap1.addEventListener('touchend', () => {
                if (this.diffX > 50) {
                    console.log('右滑')
                    this.pre()
                }
                if (this.diffX < -50) {
                    console.log('左滑')
                    this.next()
                }
                this.diffX = this.startX = 0
            })
            this.wrap2.addEventListener('webkitTransitionEnd', (event) => {
                this.onTransitionEnd && this.onTransitionEnd(this.currentIndex)
            })
        }

        next () {
            if (this.nextIndex > this.pageNum - 1) {
                this.nextIndex = this.pageNum - 1
            } else {
                this.preIndex += 1
                this.currentIndex += 1
            }
            this.wrap2.style.transform = `translateX(${-this.eachWidth * this.nextIndex}px)`
            this.nextIndex += 1
        }

        pre () {
            if (this.preIndex < 0) {
                this.preIndex = 0
            } else {
                this.nextIndex -= 1
                this.currentIndex -= 1
            }
            this.wrap2.style.transform = `translateX(${-this.eachWidth * this.preIndex}px)`
        }
    }

    let option = {
        wrap1: document.querySelector('.wrap1'),
        wrap2: document.querySelector('.wrap2'),
        pageNum: 5,
        eachWidth: 200,
    }

    new Carousel(option)
}()


