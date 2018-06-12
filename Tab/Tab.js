/*
* Tab组件
* @param {Node} tabCt tab container
* @param {Node} contentCt 内容container
* */

!function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory)
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory()
    } else {
        root.Tab = factory()
    }
}(window, () => {
    class Tab {
        constructor (tabCt, contentCt) {
            this.tabCt = tabCt
            this.contentCt = contentCt
            this.init()
        }

        init () {
            this.bind()
        }

        bind () {
            const tabCt = this.tabCt
            const contentCt = this.contentCt
            const tabItems = tabCt.querySelectorAll('li')
            const contentItems = contentCt.querySelectorAll('li')
            tabCt.addEventListener('click', (event) => {
                let target = event.target
                if (target.tagName.toLowerCase() === 'li') {
                    tabItems.forEach(function (item, index) {
                        item.classList.remove('active')
                    })
                    target.classList.add('active')
                    let targetIndex = [].indexOf.call(tabItems, target)
                    contentItems.forEach(function (item, index) {
                        item.classList.remove('show')
                    })
                    contentItems[targetIndex].classList.add('show')
                }
            })
        }
    }

    return Tab
})


