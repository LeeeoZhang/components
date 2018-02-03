!function () {
    class Carousel {
        constructor (option) {
            this.startX = 0
            this.diffX = 0
            this.wrap1 = option.wrap1
            this.wrap2 = option.wrap2
            this.pageNum = option.pageNum
            this.eachWidth = option.eachWidth
            this.index = 1
            this.lock = false
            this.bind()
        }

        bind () {
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
                if (_his.diffX < -50) {
                    console.log('左滑')
                    this.next()
                }
            })
        }

        next () {
            if (this.index >= this.pageNum - 1) this.index = this.pageNum - 1
            this.wrap2.style.transform = `translateX(${-this.eachWidth * this.index}px)`
            this.index += 1
        }

        pre () {
            this.index -= 1
            if (this.index < 0) this.index = 0
            this.wrap2.style.transform = `translateX(${-this.eachWidth * this.index}px)`
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


