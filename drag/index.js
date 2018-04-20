!function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory)
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory()
    } else {
        root.Drag = factory()
    }
}(window,()=>{
    class Drag {
        constructor (options) {
            this.target = options.target
            //触摸开始坐标
            this.startPos = {x: 0, y: 0}
            //触摸移动距离
            this.diff = {x: 0, y: 0}
            //拖拽元素初始位置
            this.initPos = {x: 0, y: 0}
            this.init()
        }

        init () {
            document.body.addEventListener('touchmove', (e) => {
                e.preventDefault()
            })
            this.bind()
        }

        bind () {
            this.target.addEventListener('touchstart', (e) => {
                this.startPos.x = e.touches[0].clientX
                this.startPos.y = e.touches[0].clientY
            })
            this.target.addEventListener('touchmove', (e) => {
                e.preventDefault()
                this.diff.x = e.touches[0].clientX - this.startPos.x
                this.diff.y = e.touches[0].clientY - this.startPos.y
                this.setPosition(this.initPos.x + this.diff.x, this.initPos.y + this.diff.y)
            })
            this.target.addEventListener('touchend', () => {
                //每次拖拽完成，都要记录当前的位置，作为下一次拖拽的起始坐标，否则会出现跳动
                this.initPos.x += this.diff.x
                this.initPos.y += this.diff.y
                //重置变量
                this.startPos.x = this.startPos.y = this.diff.x = this.diff.y = 0
            })
        }

        setPosition(x,y){
            this.target.style.transform = `translate3d(${x}px,${y}px,0)`
        }
    }
    return Drag
})
