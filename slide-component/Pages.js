/*
    移动端fullPage
 */
!function () {
    //禁止浏览器默认滑动
    document.addEventListener('touchmove', function (event) {
        event.preventDefault()
    },{passive: false})

    function Pages (params) {
        this.startX = 0
        this.startY = 0
        this.moveX = 0
        this.moveY = 0
        this.wrap1 = params.wrap1
        this.pageList = params.pageList
        this.totalPages = this.pageList.length
        this.current = 0    //当前页数
        this.next = 1     //下一页数
        this.prev = 0       //前一页数
        this.zIndex = 1
        this.isAnimate = false
        this.loop = params.loop
        this.bind()
    }

    //事件绑定
    Pages.prototype.bind = function () {
        var _this = this
        this.wrap1.addEventListener('touchstart', function (event) {
            _this.touchStart(event)
        })
        this.wrap1.addEventListener('touchmove', function (event) {
            _this.touchMove(event)
        })
        this.wrap1.addEventListener('touchend', function (event) {
            _this.touchEnd(event)
        })
    }

    //touchstart事件处理,记录初始触摸坐标
    Pages.prototype.touchStart = function (event) {
        var evt = event || window.event       //兼容ie
        this.startX = evt.touches[0].clientX
        this.startY = evt.touches[0].clientY
    }

    //touchmove事件处理,记录移动距离
    Pages.prototype.touchMove = function (event) {
        var evt = event || window.event
        var xMove = evt.touches[0].clientX  //移动坐标
        var yMove = evt.touches[0].clientY
        this.moveX = xMove - this.startX
        this.moveY = yMove - this.startY
    }

    //通过moveY,moveX判断滑动方向
    Pages.prototype.touchEnd = function () {
        if (Math.abs(this.moveX) > Math.abs(this.moveY)) {
            if (this.moveX > 50) {
                console.log('向右滑动')
            } else if (this.moveX < -50) {
                console.log('向左滑动')
            }
        } else {
            if (this.moveY > 50) {
                console.log('向下滑动')
                this.downHandler()
            } else if (this.moveY < -50) {
                console.log('向上滑动')
                this.upHandler()
            }
        }
    }

    //向上滑动事件处理
    Pages.prototype.upHandler = function () {
        if(this.isAnimate) return
        this.isAnimate = true       //动画锁

        //边界判定
        if(this.current + 1 === this.totalPages) {
            //循环滚动吗?
            if(this.loop) {
                this.current = -1
                this.next = 0
            } else {
                this.isAnimate = false
                return
            }
        }

        var _this = this
        this.pageList[this.next].style.top = '100%'
        this.pageList[this.next].style.zIndex = this.zIndex
        Velocity(this.pageList[this.next], {
            translateY: ['-100%',0]
        }, {
            duration: 500,
            easing: 'swing',
            complete: function () {
                _this.current++
                _this.next = _this.current + 1
                _this.prev = _this.current - 1
                _this.zIndex++
                _this.isAnimate = false
            }
        })
    }

    //向下滑动事件处理
    Pages.prototype.downHandler = function () {
        if(this.isAnimate) return
        this.isAnimate = true

        //边界判定
        if(this.current === 0) {
            //循环滚动吗?
            if(this.loop) {
                this.prev = this.totalPages - 1
                this.current = 10
            } else {
                this.isAnimate = false
                return
            }
        }

        var _this = this
        this.pageList[this.prev].style.top = '-100%'
        this.pageList[this.prev].style.zIndex = this.zIndex
        Velocity(this.pageList[this.prev], {
            translateY: ['100%',0]
        }, {
            duration: 500,
            easing: 'swing',
            complete: function () {
                _this.current--
                _this.next = _this.current + 1
                _this.prev = _this.current - 1
                _this.zIndex++
                _this.isAnimate = false
            }
        })
    }

    window.Pages = Pages

}()