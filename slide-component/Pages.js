/*
    移动端全屏滚动组件
 */
class Pages {
    constructor (options) {
        this.startX = 0
        this.startY = 0
        this.moveX = 0
        this.moveY = 0
        this.current = 0 //当前页数
        this.next = 1 //下一页数
        this.zIndex = 1
        this.isAnimate = false
        this.wrap = options.wrap
        this.pageList = options.pageList
        this.totalPages = this.pageList.length
        this.loop = options.loop
        this.cb = options.cb
        this.duration = options.duration || 300
        this.easing = options.easing || 'linear'
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

    setPagePos () {
        this.pageList.forEach(item => {
            if (this.direction === 'vertical') {
                item.style.top = '100%'
            } else {
                item.style.left = '100%'
            }
        })
    }

    //事件绑定
    bind () {
        //禁止浏览器默认滑动
        document.addEventListener('touchmove', function (event) {
            event.preventDefault()
        })
        this.wrap.addEventListener('touchstart', (event) => {
            this.onTouchStart(event)
        })
        this.wrap.addEventListener('touchmove', (event) => {
            this.onTouchMove(event)
        })
        this.wrap.addEventListener('touchend', () => {
            this.onTouchEnd()
        })
    }

    //touchstart处理函数
    onTouchStart (event) {
        let evt = event || window.event
        this.startX = evt.touches[0].clientX
        this.startY = evt.touches[0].clientY
    }

    //touchmove处理函数
    onTouchMove (event) {
        let evt = event || window.event
        this.moveX = evt.touches[0].clientX - this.startX
        this.moveY = evt.touches[0].clientY - this.startY
    }

    //touchend处理函数
    onTouchEnd () {
        if (Math.abs(this.moveX) > Math.abs(this.moveY) && this.direction === 'horizontal') {
            if (this.moveX > 50) {
                this.onSwiperPre()
            } else if (this.moveX < -50) {
                this.onSwiperNext()
            }
        } else if (Math.abs(this.moveX) < Math.abs(this.moveY) && this.direction === 'vertical') {
            if (this.moveY > 50) {
                this.onSwiperPre()
            } else if (this.moveY < -50) {
                this.onSwiperNext()
            }
        }
    }

    //上一页滑动事件处理
    onSwiperNext () {
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

    //下一页滑动事件
    onSwiperPre () {
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

    //重置移动距离，放置触碰翻页
    resetMove () {
        this.moveX = 0
        this.moveY = 0
    }

    swiperNext () {
        //判断上下滑动还是左右滑动,获取不一样的参数
        let dir = this.direction === 'vertical' ? 'top' : 'left'
        let trans = this.direction === 'vertical' ? 'translateY' : 'translateX'
        //过渡完成时的回调函数，处理页面过渡结束后的页面属性
        let onTransitionEnd = function () {
            this.pageList[this.next].removeEventListener('webkitTransitionEnd', onTransitionEnd)
            //重置滑动距离,避免点击翻页
            this.resetMove()
            this.current = this.next
            this.next += 1
            //递增zIndex,让每次过渡的页面层级都是最高的
            this.zIndex++
            this.isAnimate = false
            //切换class
            this.changeClass()
            this.cb && cb.call(this)
            this.pageList[(this.current - 1) < 0 ? (this.totalPages - 1) : (this.current - 1)].style.transition = ''
            this.pageList[(this.current - 1) < 0 ? (this.totalPages - 1) : (this.current - 1)].style.transform = ''
        }.bind(this)
        //将要过渡的页面提前放在屏幕外面
        this.pageList[this.next].style[dir] = '100%'
        //设置过渡属性
        this.pageList[this.next].style.zIndex = this.zIndex
        this.pageList[this.next].style.transition = 'transform ease 0.5s'
        this.pageList[this.next].style.transform = `${trans}(-100%)`
        this.pageList[this.next].addEventListener('webkitTransitionEnd', onTransitionEnd)
    }

    swiperPre () {
        let dir = this.direction === 'vertical' ? 'top' : 'left'
        let trans = this.direction === 'vertical' ? 'translateY' : 'translateX'
        let onTransitionEnd = function () {
            this.pageList[this.current - 1].removeEventListener('webkitTransitionEnd', onTransitionEnd)
            //重置滑动距离,避免点击即可翻页
            this.resetMove()
            this.next = this.current
            this.current = this.current - 1
            //递增zIndex,让每次过渡的页面层级都是最高的
            this.zIndex++
            this.isAnimate = false
            //切换class
            this.changeClass()
            this.cb && cb.call(this)
            this.pageList[(this.current + 1) >= this.totalPages ? 0 : (this.current + 1)].style.transition = ''
            this.pageList[(this.current + 1) >= this.totalPages ? 0 : (this.current + 1)].style.transform = ''
        }.bind(this)
        this.pageList[this.current - 1].style[dir] = '-100%'
        this.pageList[this.current - 1].style.zIndex = this.zIndex
        this.pageList[this.current - 1].style.transition = 'transform ease 0.5s'
        this.pageList[this.current - 1].style.transform = `${trans}(100%)`
        this.pageList[this.current - 1].addEventListener('webkitTransitionEnd', onTransitionEnd)
    }
}