/*
 *	@param amount:any 待检查的输入
 *	@param isInt:Boolean 是否是整数金额
 *
 */

function isValidAmout(amount, isInt) {

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



}