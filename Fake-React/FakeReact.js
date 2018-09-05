class likeButton {

	render() {
		return `
			<div>
				<Button>
					<span>点赞</span>
					<span class="icon"></span>
				</Button>
			</div>
	
		`
	}

}

const wrap = document.querySelector('#wrap')
const likeButton1 = new likeButton()

wrap.innerHTML = likeButton1.render()