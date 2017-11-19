let Dom = {
    on: function(element, eventType, selector, handle) {
        element.addEventListener(eventType, (event) => {
            let targetElement = event.target
            while (!targetElement.matches(selector)) { //Element.matches(selector)如果元素被选择器选中,返回true
                if (element === targetElement) {
                    targetElement = null
                    break //事件代理的模式，直到点中selector的元素才发生事件
                }
                targetElement = targetElement.parentNode
            }
            targetElement && handle.call(targetElement, event, targetElement)
        })
        return element
    },
    index: function(element) {
        let siblings = element.parentNode.children //获取所有子元素
        for (index = 0; index < siblings.length; index++) { //判断在哪个位置上，返回相应index
            if (element === siblings[index]) {
                return index
            }
        }
        return -1 //没有返回-1
    },

    //获取鼠标或者触点相对于element的坐标
    getPosition: function(element, touchStarHandler, touchMoveHandler, touchEndHandler) {
        let isTouch = ('ontouched' in document)
        let touchstart, touchmove, touchend

        //判断是否在移动环境,确定事件
        if (isTouch) {
            touchstart = 'touchstart'
            touchend = 'touched'
            touchmove = 'touchmove'
        } else {
            touchstart = 'mousedown'
            touchend = 'mouseup'
            touchmove = 'mousemove'
        }

        function getPoint(event) {
            let event = event || window.event //兼容IE
            let toucheEvent = isTouch ? event.changedTouches[0] : event
            let x = toucheEvent.pageX || (toucheEvent.clientX + document.body.scrollLeft + document.documentElement.scrollLeft)
            x -= element.offsetLeft
            let y = toucheEvent.pageY || (toucheEvent.clientY + document.body.scrollTop + document.documentElement.scrollTop)
            y -= element.offsetTop
            return {
                x,
                y
            }
        }

        //handler会接收到一个event,xy坐标记录在event.point(自定义)里
        //x = event.point.x ; y = event.point.y
        element.addEventListener(touchstart, function(event) {
            event.point = getPoint(event)
            touchStarHandler && touchStarHandler.call(this, event)
        })
        element.addEventListener(touchend, function(event) {
            event.point = getPoint(event)
            touchEndHandler && touchEndHandler.call(this, event)
        })
        element.addEventListener(touchmove, function(event) {
            event.point = getPoint(event)
            touchMoveHandler && touchMoveHandler.call(this, event)
        })
    },


    //key事件绑定到window上面;假设绑定某个元素上,只有该元素被focus时才会触发key事件
    //option是一个事件对象,{'37':handler},键值对形式 ==>  keyCode:handler
    //不同的按键对应不一样的事件处理
    //eventCenter就是的事件分发中心
    //可以绑定多个键盘事件
    keyEvent: function(upOption, downOption) {
        window.addEventListener('keydown', eventCenter)
        window.addEventListener('keyup', eventCenter)

        function eventCenter(event) {
            let event = event || window.event
            if (event.type === 'keyup') {
                upOption[event.keyCode]()
            } else {
                downOption[event.keyCode]()
            }
        }
    },

    //判断滑动方向
    onSwipe: function(element, callback) {
        let x0, y0
        element.addEventListener('touchstart', function(event) { //记录初始触摸坐标
            let event = event || window.event //兼容ie
            x0 = event.touches[0].clientX
            y0 = event.touches[0].clientY
        })
        element.addEventListener('touchmove', function(event) {
            let event = event || window.event
            if (!x0 || !y0) return
            let xMove = event.touches[0].clientX, //记录移动坐标
                yMove = event.touches[0].clientY,
                xDiff = xMove - x0, //计算差值
                yDiff = yMove - y0
            if (Math.abs(xDiff) > Math.abs(y)) {
                if (xDiff > 0) {
                    callback.call(element, event, 'right')
                } else {
                    callback.call(element, event, 'left')
                }
            } else {
                if (yDiff > 0) {
                    callback.call(element, event, 'down')
                } else {
                    callback.call(element, event, 'up')
                }
            }
        })
    },

    //forEach手动版
    every: function(nodeList, fn) {
        for (let i = 0; i < nodeList.length; i++) {
            fn.call(null, nodeList[i], i)
        }
        return nodeList
    },


    //添加兄弟节点中唯一class
    addClass: function(element, className) {
        Dom.every(element.parentNode.children, (element) => {
            element.classList.remove(className)
        })
        element.classList.add(className)
    }
}