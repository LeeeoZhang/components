/*
    移动端fullPage,基于Velocity.js
 */

!function () {
    class Full {
        constructor (options) {
            this.startX = 0
            this.startY = 0
            this.moveX = 0
            this.moveY = 0
            this.wrap1 = options.wrap1
            this.pageList = options.pageList
            this.totalPages = this.pageList.length
            this.current = 0 //当前页数
            this.next = 1    //下一页数
            this.zIndex = 1
            this.isAnimate = false
            this.loop = options.loop
            this.cb = options.cb
            this.duration = options.duration || 300
            this.easing = options.easing || 'swing'
            this.direction = options.direction || 'vertical'
            this.init()
        }

        init () {
            this.bind()
            this.setPagePos()
            if (this.direction === 'vertical') {
                this.pageList[0].style.transform = 'translateY(-100%)'
                this.pageList[0].classList.add('active')
            } else {
                this.pageList[0].style.transform = 'translateX(-100%)'
                this.pageList[0].classList.add('active')
            }
        }

        //事件绑定
        bind () {
            //禁止浏览器默认滑动
            document.addEventListener('touchmove', function (event) {
                event.preventDefault()
            }, {passive: false})

            this.wrap1.addEventListener('touchstart', (event) => {
                this.onTouchStart(event)
            })
            this.wrap1.addEventListener('touchmove', (event) => {
                this.onTouchMove(event)
            })
            this.wrap1.addEventListener('touchend', () => {
                this.onTouchEnd()
            })
        }

        onTouchStart (event) {
            let evt = event || window.event
            this.startX = evt.touches[0].clientX
            this.startY = evt.touches[0].clientY
        }

        onTouchMove (event) {
            let evt = event || window.event
            this.moveX = evt.touches[0].clientX - this.startX
            this.moveY = evt.touches[0].clientY - this.startY
        }

        onTouchEnd () {
            if (Math.abs(this.moveX) > Math.abs(this.moveY) && this.direction === 'horizontal') {
                if (this.moveX > 50) {
                    this.onSwiperRight()
                } else if (this.moveX < -50) {
                    this.onSwiperLeft()
                }
            } else if (Math.abs(this.moveX) < Math.abs(this.moveY) && this.direction === 'vertical') {
                if (this.moveY > 50) {
                    this.onSwiperDown()
                } else if (this.moveY < -50) {
                    this.onSwiperUp()
                }
            }
        }

        //向上滑动事件处理
        onSwiperUp () {
            if (this.isAnimate) return
            this.isAnimate = true

            //边界判定
            if (this.current === this.totalPages - 1) {
                if (this.loop) {
                    this.current = 0
                    this.next = 0
                } else {
                    this.isAnimate = false
                    return
                }
            }
            this.swiperNext()
        }

        //向下滑动事件
        onSwiperDown () {
            if (this.isAnimate) return
            this.isAnimate = true

            if (this.current === 0) {
                if (this.loop) {
                    this.current = this.totalPages
                    this.next = this.totalPages - 1
                } else {
                    this.isAnimate = false
                    return
                }
            }
            this.swiperPre()
        }

        //向左滑动事件处理
        onSwiperLeft () {
            if (this.isAnimate) return
            this.isAnimate = true

            //边界判定
            if (this.current === this.totalPages - 1) {
                if (this.loop) {
                    this.current = 0
                    this.next = 0
                } else {
                    this.isAnimate = false
                    return
                }
            }
            this.swiperNext()
        }

        //向右滑动事件
        onSwiperRight () {
            if (this.isAnimate) return
            this.isAnimate = true

            if (this.current === 0) {
                if (this.loop) {
                    this.current = this.totalPages
                    this.next = this.totalPages - 1
                } else {
                    this.isAnimate = false
                    return
                }
            }
            this.swiperPre()
        }

        changeClass () {
            this.pageList.forEach(item => {
                item.classList.remove('active')
            })
            this.pageList[this.current].classList.add('active')
        }

        resetMove () {
            this.moveX = 0
            this.moveY = 0
        }

        setPagePos () {
            this.pageList.forEach(item => {
                if (this.direction === 'vertical') {
                    item.style.top = '100%'
                } else {
                    item.style.left = '100%'
                }
            })
        }

        swiperNext () {
            let dir = this.direction === 'vertical' ? 'top' : 'left'
            let trans = this.direction === 'vertical' ? 'translateY' : 'translateX'
            this.pageList[this.next].style[dir] = '100%'
            this.pageList[this.next].style.zIndex = this.zIndex
            Velocity(this.pageList[this.next], {[trans]: ['-100%', 0]}, {
                duration: this.duration,
                easing: this.easing,
                complete: () => {
                    this.resetMove()
                    this.current = this.next
                    this.next += 1
                    this.zIndex++
                    this.isAnimate = false
                    this.changeClass()
                    this.cb && cb()
                }
            })
        }

        swiperPre () {
            let dir = this.direction === 'vertical' ? 'top' : 'left'
            let trans = this.direction === 'vertical' ? 'translateY' : 'translateX'
            this.pageList[this.current - 1].style[dir] = '-100%'
            this.pageList[this.current - 1].style.zIndex = this.zIndex
            Velocity(this.pageList[this.current - 1], {[trans]: ['100%', 0]}, {
                duration: this.duration,
                easing: this.easing,
                complete: () => {
                    this.resetMove()
                    this.next = this.current
                    this.current = this.current - 1
                    this.zIndex++
                    this.isAnimate = false
                    this.changeClass()
                    this.cb && cb()
                }
            })
        }
    }

    window.Full = Full
}()





