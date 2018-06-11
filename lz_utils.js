const Lz_utils = {

    //是否是中国大陆手机
    isMobile (mobile) {
        return /^1[3456789]\d{9}$/.test(mobile)
    },

    //是否是合法的中文姓名
    isChineseName (name) {
        return /^[\u4E00-\u9FA5]{1,10}$/.test(name)
    },

    //是否是合法邮箱
    isEmail (email) {
        return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(email)
    },
}

if (typeof define === 'function' && define.amd) {
    define([], Lz_utils)
} else if (typeof module === 'object' && module.exports) {
    module.exports = Lz_utils
} else {
    root.Lz_utils = Lz_utils
}