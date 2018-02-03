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
            this.bind()
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
                if (this.moveX > 100) {
                    this.onSwiperRight()
                } else if (this.moveX < -100) {
                    this.onSwiperLeft()
                }
            } else if(Math.abs(this.moveX) < Math.abs(this.moveY) && this.direction === 'vertical') {
                if (this.moveY > 100) {
                    this.onSwiperDown()
                } else if (this.moveY < -100) {
                    this.onSwiperUp()
                }
            }
        }

        //向上滑动事件处理
        onSwiperUp () {
            if(this.isAnimate) return
            this.isAnimate = true

            //边界判定
            if(this.current === this.totalPages - 1) {
                if(this.loop) {
                    this.current = 0
                    this.next = 0
                } else {
                    this.isAnimate = false
                    return
                }
            }

            this.pageList[this.next].style.top = '100%'
            this.pageList[this.next].style.zIndex = this.zIndex
            Velocity(this.pageList[this.next],{translateY: ['-100%',0]},{
                duration: this.duration,
                easing: this.easing,
                complete: () => {
                    this.current = this.next
                    this.next += 1
                    this.zIndex++
                    this.isAnimate = false
                    this.changeClass()
                    this.cb && cb()
                }
            })
        }

        changeClass () {
            this.pageList.forEach((item,index)=>{
                item.classList.remove('active')
            })
            this.pageList[this.current].classList.add('active')
        }
    }

    window.Full = Full
}()





