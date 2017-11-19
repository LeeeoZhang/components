//封装
let Tab = (function() {
    function bind(tabContainer,contentContainer) {
        let tabItems = tabContainer.querySelectorAll('li')                  //bind()从外部无法被访问
        let contentItems = contentContainer.querySelectorAll('li')
        tabContainer.addEventListener('click', function (e) {
            let clickTarget = e.target
            if (clickTarget.tagName.toLowerCase() === 'li') {
                tabItems.forEach(function (item, index) {
                    item.classList.remove('active')
                })
                clickTarget.classList.add('active')
                let targetIndex = [].indexOf.call(tabItems, clickTarget)
                contentItems.forEach(function (item, index) {
                    item.classList.remove('show')
                })
                contentItems[targetIndex].classList.add('show')
            }
        })
    }
    return {
        init: function(tabContainer,contentContainer) {
            bind(tabContainer,contentContainer)
        }
    }
})()
Tab.init(document.querySelectorAll('.tab-container>.tab')[0],document.querySelectorAll('.tab-container>.content')[0])
Tab.init(document.querySelectorAll('.tab-container>.tab')[1],document.querySelectorAll('.tab-container>.content')[1])

//不知道什么写法。。
// let tabContainer = document.querySelector('.tab-container>.tab')
// let contentContainer = document.querySelector('#tab-container>.content')
// let tabItems = tabContainer.querySelectorAll('li')
// let contentItems = contentContainer.querySelectorAll('li')
//
// tabContainer.addEventListener('click',function(e) {
//     let clickTarget = e.target
//     if(clickTarget.tagName.toLowerCase() === 'li') {
//         tabItems.forEach(function(item,index) {
//             item.classList.remove('active')
//         })
//         clickTarget.classList.add('active')
//         let targetIndex = [].indexOf.call(tabItems,clickTarget)
//         contentItems.forEach(function(item,index) {
//             item.classList.remove('show')
//         })
//         contentItems[targetIndex].classList.add('show')
//     }
// })



//面对对象写法
// function Tab(tabContainer,contentContainer) {
//     this.tabContainer = tabContainer
//     this.contentContainer = contentContainer
//     this.tabItems = this.tabContainer.querySelectorAll('li')
//     this.contentItems = this.contentContainer.querySelectorAll('li')
//     this.bind()
// }
// Tab.prototype.bind = function() {
//     let _this = this
//     this.tabContainer.addEventListener('click',function(e) {
//         let clickTarget = e.target
//         if(clickTarget.tagName.toLowerCase() === 'li') {
//             _this.tabItems.forEach(function(item,index) {
//                 item.classList.remove('active')
//             })
//             clickTarget.classList.add('active')
//             let targetIndex = [].indexOf.call(_this.tabItems,clickTarget)
//             _this.contentItems.forEach(function(item,index) {
//                 item.classList.remove('show')
//             })
//             _this.contentItems[targetIndex].classList.add('show')
//         }
//     })
// }
//
// new Tab(document.querySelectorAll('.tab-container>.tab')[0],document.querySelectorAll('.tab-container>.content')[0])
// new Tab(document.querySelectorAll('.tab-container>.tab')[1],document.querySelectorAll('.tab-container>.content')[1])


