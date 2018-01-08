function Carousel(option) {
    this.startX = 0
    this.diffX = 0
    this.wrap1 = option.wrap1
    this.wrap2 = option.wrap2
    this.pageNum = option.pageNum
    this.eachWidth = option.eachWidth
    this.index = 1
    this.locl = false
    this.bind()
}
Carousel.prototype = {
    constructor: Carousel,
    bind: function () {
        let _this = this
        _this.wrap1.addEventListener('touchstart', function (event) {
            _this.startX = event.touches[0].pageX
        })
        _this.wrap1.addEventListener('touchmove', function (event) {
            _this.diffX = event.touches[0].pageX - _this.startX
        })
        _this.wrap1.addEventListener('touchend', function () {
            if (_this.diffX > 50) {
                console.log('右滑')
                _this.pre()
            }
            if (_this.diffX < -50) {
                console.log('左滑')
                _this.next()
            }
        })
    },
    next: function(){
        if(this.index >= this.pageNum - 1 ) this.index = this.pageNum - 1
        this.wrap2.style.transform = `translateX(${-this.eachWidth*this.index}px)`
        this.index +=1 
    },
    pre: function(){
        this.index -=1 
        if(this.index < 0  ) this.index = 0
        this.wrap2.style.transform = `translateX(${-this.eachWidth*this.index}px)`
    },
}

let option = {
    wrap1: document.querySelector('.wrap1'),
    wrap2: document.querySelector('.wrap2'),
    pageNum: 5,
    eachWidth: 200,
}

new Carousel(option)







var a = []
function xx(){
    for(let i =0 ;i<8; i++) {
        for(let j=0;j<8;j++) {
            a.push([i,j])
        }
    }
}
xx()
console.log(a.length)