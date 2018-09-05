const Lez_utils = {

    //是否是中国大陆手机
    isMobile(mobile) {
        return /^1[3456789]\d{9}$/.test(mobile)
    },

    //是否是合法的中文姓名
    isChineseName(name) {
        return /^[\u4E00-\u9FA5]{1,10}$/.test(name)
    },

    //是否是合法邮箱
    isEmail(email) {
        return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(email)
    },

    //是否是合法金额
    isValidAmout(amount, isInt) {

        function isNumber(val) {
            if (val === '' || val === ' ' || val === null) {
                return false
            }
            if (!isNaN(val)) {
                return false
            }
            return true
        }

        //如果不是数字，则不是合法的金额
        if (!isNumber) {
            return false
        }

        if ()


    },
}

if (typeof define === 'function' && define.amd) {
    define([], Lez_utils)
} else if (typeof module === 'object' && module.exports) {
    module.exports = Lez_utils
} else {
    root.Lz_utils = Lez_utils
}