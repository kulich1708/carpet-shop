import { modules } from "../files/modules.js";

if (!localStorage.getItem('carpet-shop')) {
	localStorage.setItem('carpet-shop', JSON.stringify({ 'user': { 'address': {}, 'img': 'img/common/not-photo.png', 'payment': {} } }))
}

// Все крупные города страны, в рабочем проекте этот массив должен браться из базы данных
let cities = ['Аксай', 'Нур-Султан', 'Аксу', 'Актау', 'Актобе', 'Алматы', 'Алтай', 'Арысь', 'Атырау', 'Балшах', 'Бейнеу', 'Есик', 'Жанаозен', 'Жаркент', 'Жезказган', 'Жетысай', 'Капшагай', 'Караганда', 'Каскелен', 'Кентау', 'Кокшетау', 'Кордай', 'Костанай', 'Костанай', 'Кульсары', 'Кызылорда', 'Лисаковск', 'Павлодар', 'Петропавловск', 'Рудный', 'Сарань', 'Сатпаев', 'Семей', 'Степногорск', 'Талгар', 'Талдыкорган', 'Тараз', 'Текели', 'Темиртау', 'Туркестан', 'Усть - Каменогорск', 'Шахтинск', 'Шиели', 'Шу', 'Шымкент', 'Щучинск', 'Экибастуз'];
let citySpell = [];

const selectsCity = document.querySelectorAll('.select_city');

cities.forEach((city, index) => {
	citySpell.push(cities[index].toLowerCase());
	const cityColumn = document.querySelectorAll('.city-popup__column');
	let cityItem = document.createElement('button')
	cityItem.classList.add('city-popup__item');
	cityItem.innerHTML = city;
	cityItem.setAttribute('data-close', '');
	cityColumn[Math.ceil((index + 1) / Math.ceil(cities.length / 4)) - 1].appendChild(cityItem);
	selectsCity.forEach(selectCity => {
		selectCity.insertAdjacentHTML('beforeend', `<option value="${city}">${city}</option>`)
	});
})

const citySearch = document.querySelector('.city-popup__input input');
if (citySearch) {
	citySearch.addEventListener('keyup', e => {
		let citySearchValue = citySearch.value.toLowerCase();
		let searchResults = [];
		citySpell.forEach((elem, index) => {
			!elem.includes(citySearchValue) ? searchResults.push(index) : null;
		})
		const cityItems = document.querySelectorAll('.city-popup__item');
		cityItems.forEach(e => {
			e.classList.remove('_hidden');
		})
		for (let i = 0; i < searchResults.length; i++) {
			const searchResultItem = cityItems[searchResults[i]];
			searchResultItem.classList.add('_hidden');
		}
	})
}

window.updateAccountInfo = (changedData) => {
	let accountInfoBlocks = []
	if (!changedData) {
		accountInfoBlocks = document.querySelectorAll('[data-get-user-info]');
	} else {
		changedData.forEach(element => {
			accountInfoBlocks = [...accountInfoBlocks, ...document.querySelectorAll(`[data-get-user-info="${element}"]`)];
		});
	}
	accountInfoBlocks.forEach(accountInfoBlock => {
		let accountInfo = accountInfoBlock.getAttribute('data-get-user-info').split(',').map(e => e.trim())
		let accountInfoLenght = accountInfoBlock.getAttribute('data-get-user-info-lenght')
		let userInfo = JSON.parse(localStorage.getItem('carpet-shop'))['user']

		for (const type of accountInfo) {
			if (userInfo) {
				userInfo = userInfo[type]
			}
		}
		if (userInfo) {
			if (accountInfoLenght) {
				accountInfoLenght = accountInfoLenght.split(',').map(e => e.trim())
				if (accountInfoLenght[1] == 'last') {
					userInfo = userInfo.slice(-accountInfoLenght[0],)
				} else {
					userInfo = userInfo.slice(0, +accountInfoLenght[0])
				}
			}
			if (accountInfoBlock.tagName == 'INPUT') {
				accountInfoBlock.value = userInfo
			} else if (accountInfoBlock.tagName == 'IMG') {
				accountInfoBlock.src = userInfo
				if (accountInfoBlock.closest('picture')) {
					accountInfoBlock.closest('picture').querySelector('source').setAttribute('srcset', userInfo)
				}
			} else if (accountInfoBlock.tagName == 'SELECT') {
				const options = accountInfoBlock.querySelectorAll(`option`)
				options.forEach(option => {
					option.removeAttribute('selected')
					if (option.value == userInfo) {
						option.setAttribute('selected', '')
					}
				});
			} else {
				accountInfoBlock.innerHTML = userInfo
			}
		} else {
			if (accountInfoBlock.tagName == 'INPUT') {
				accountInfoBlock.value = ''
			} else if (accountInfoBlock.tagName == 'SELECT') {
				const options = accountInfoBlock.querySelectorAll(`option`)
				options.forEach(option => {
					option.removeAttribute('selected')
					option.value == '' ? option.setAttribute('selected', '') : null
				});
			} else {
				accountInfoBlock.innerHTML = ''
			}
		}
	});
	userName()
}
function addAccountLineData(block, data, type) {
	let items = block.querySelector('.item-account__body_no-change');
	items = block.querySelectorAll('.item-account__body_no-change');
	let item = items[0]
	items.forEach(item => {
		item.parentElement.removeChild(item)
	});
	if (data && item) {
		for (let index = 0; index < data; index++) {
			const cloneItem = item.cloneNode(true)
			block.append(cloneItem)
		}
	}

	items = block.querySelectorAll('.item-account__body_no-change');
	items.forEach((item, index) => {
		const itemDataBlocks = item.querySelectorAll('[data-get-user-info]');

		const dataUser = JSON.parse(localStorage.getItem('carpet-shop'))['user']
		itemDataBlocks.forEach(itemDataBlock => {
			const attributeGetInfo = itemDataBlock.getAttribute('data-get-user-info')
			if (attributeGetInfo) itemDataBlock.setAttribute('data-get-user-info', attributeGetInfo.replace(/\$\{.*\$\}/, Object.keys(dataUser[type])[index]))
		});

		const itemButtons = item.querySelectorAll('.actions-account__item_change, .actions-account__item_delete');
		itemButtons.forEach(itemButton => {
			itemButton.setAttribute(`data-${type}-id`, Object.keys(dataUser[type])[index].replace(/\$\{/, '').replace(/\$\}/, ''))
		});
	});
}
function showAccountItem() {
	const itemBlocks = document.querySelectorAll('.item-account');
	itemBlocks.forEach(itemBlock => {
		const itemType = itemBlock.getAttribute('data-account-item')
		if (itemType) {
			const userData = JSON.parse(localStorage.getItem('carpet-shop'))
			const dataType = userData['user'][itemType]
			if (!dataType) {
				userData[itemType] = {}
				localStorage.setItem('carpet-shop', JSON.stringify(userData))
			}

			if (Object.keys(dataType).length) {
				itemBlock.classList.remove('_empty')
				addAccountLineData(itemBlock, Object.keys(JSON.parse(localStorage.getItem('carpet-shop'))['user'][itemType]).length, itemType)
			} else {
				itemBlock.classList.add('_empty')
			}
			const tab = itemBlock.closest('.tabs-account')
			const tabItemAcitve = itemBlock.closest('.tabs-account__item._active');
			if (tab && tabItemAcitve && document.documentElement.offsetWidth < 767.98) {
				tab.style.height = tabItemAcitve.offsetHeight + 'px'
			}
		}

	});
}
showAccountItem()
const accountButtons = document.querySelectorAll('.item-account__button');
accountButtons.forEach(button => {
	button.addEventListener("click", function (e) {
		const itemAccount = button.closest('.item-account')
		if (itemAccount) {
			const form = itemAccount.querySelector('.item-account__body_change')
			const itemType = itemAccount.getAttribute('data-account-item')
			if (itemType) {
				const itemStorageKeys = Object.keys(JSON.parse(localStorage.getItem('carpet-shop'))['user'][itemType])
				let quantItem
				quantItem = itemStorageKeys.length ? itemStorageKeys.at(-1).replace('${', '').replace('$}', '') : 0
				if (form) openChangeForm(form, +quantItem + 1)
			}
		}
	});
});
window.openChangeForm = (form, num) => {
	form.classList.add('_active')

	const itemAccountHeader = form.parentElement.querySelector('.item-account__header');
	const itemAccountReturn = form.parentElement.querySelector('.item-account__return').children;
	const itemsAccountBody = form.parentElement.querySelectorAll('.item-account__body_no-change, .item-account__body_empty');
	const formTitle = form.parentElement.querySelector('.form-change-title');
	const itemAccountReturn2 = form.parentElement.querySelectorAll('[data-da^=".item-account__return,"]');

	itemAccountHeader ? itemAccountHeader.classList.add('_disabled') : null

	itemsAccountBody.forEach(itemAccountBody => {
		itemAccountBody.classList.add('_disabled')
	});

	Array.from(itemAccountReturn).forEach(element => {
		element.classList.add('_disabled')
	})
	itemAccountReturn2.forEach(element => {
		element.classList.add('_disabled')
	})
	if (formTitle) formTitle.classList.remove('_disabled')

	const changedData = []
	const getInfoBlocks = form.querySelectorAll('[data-get-user-info], [data-set-user-info]');
	getInfoBlocks.forEach(getInfoBlock => {
		const attributeGetInfo = getInfoBlock.getAttribute('data-get-user-info')
		if (attributeGetInfo) getInfoBlock.setAttribute('data-get-user-info', attributeGetInfo.replace(/\$\{.*\$\}/, `\${${num}$}`))
		const attributeSetInfo = getInfoBlock.getAttribute('data-set-user-info')
		if (attributeSetInfo) getInfoBlock.setAttribute('data-set-user-info', attributeSetInfo.replace(/\$\{.*\$\}/, `\${${num}$}`))
		getInfoBlock.getAttribute('data-set-user-info') ? changedData.push(getInfoBlock.getAttribute('data-set-user-info')) : null
	});

	updateAccountInfo(changedData)
	setDataInInputs(form)
	const formSelects = form.querySelectorAll('.select')
	formSelects.forEach(formSelect => {
		const originalSelect = modules.select.getSelectElement(formSelect).originalSelect;
		modules.select.setSelectTitleValue(formSelect, originalSelect)

	});

	const tab = form.closest('.tabs-account')
	const tabItem = form.closest('.tabs-account__item')
	if (tab && tabItem && document.documentElement.offsetWidth < 767.98) {
		tab.style.height = tabItem.offsetHeight + 'px'
	}
}
window.closeChangeForm = (form) => {
	form.classList.remove('_active')

	const itemAccountHeader = form.parentElement.querySelector('.item-account__header');
	const itemAccountReturn = form.parentElement.querySelector('.item-account__return').children;
	const itemsAccountBody = form.parentElement.querySelectorAll('.item-account__body_no-change, .item-account__body_empty');
	const formTitle = form.parentElement.querySelector('.form-change-title');
	const itemAccountReturn2 = form.parentElement.querySelectorAll('[data-da^=".item-account__return,"]');

	itemAccountHeader ? itemAccountHeader.classList.remove('_disabled') : null
	itemsAccountBody.forEach(itemAccountBody => {
		itemAccountBody.classList.remove('_disabled')
	});
	Array.from(itemAccountReturn).forEach(element => {
		element.classList.remove('_disabled')
	})
	itemAccountReturn2.forEach(element => {
		element.classList.remove('_disabled')
	})
	if (formTitle) {
		formTitle.classList.add('_disabled')
	}
	const changedData = []
	const inputs = form.querySelectorAll('[data-set-user-info]');
	inputs.forEach(input => {
		changedData.push(input.getAttribute('data-set-user-info'))
	});
	showAccountItem()
	updateAccountInfo(changedData)
	setDataInInputs(form)


}
window.deleteAccountItem = (button, id) => {
	if (button.closest('.item-account')) {
		const itemType = button.closest('.item-account').getAttribute('data-account-item')
		if (itemType) {
			const dataUser = JSON.parse(localStorage.getItem('carpet-shop'))
			const deletedData = Object.keys(dataUser['user'][itemType][`\${${id}\$}`]).map(item => [itemType, `\${${id}\$}`, item].join(', '))
			delete dataUser['user'][itemType][`\${${id}\$}`];
			localStorage.setItem('carpet-shop', JSON.stringify(dataUser))
			showAccountItem()
			updateAccountInfo(deletedData)
		}
	}
}

function userName() {
	const userNameBLock = document.querySelector('.user-account__name');
	const userData = JSON.parse(localStorage.getItem('carpet-shop'))['user']
	if (userNameBLock) {
		if (!userData['first_name'] && !userData['last_name']) {
			userNameBLock.classList.add('_empty')
		} else {
			userNameBLock.classList.remove('_empty')
		}
	}
}
userName()

function showPaymentItem() {
	const paymentItems = document.querySelectorAll('[data-payment-item-type]');
	paymentItems.forEach(paymentItem => {
		const paymentItemType = paymentItem.getAttribute('data-payment-item-type')
		const dataItem = JSON.parse(localStorage.getItem('carpet-shop'))['user'][paymentItemType]
		const paymentItemNewInputs = paymentItem.querySelectorAll(`.item-payment-form input, .item-payment-form select`);
		if (Object.keys(dataItem).length == 0) {
			paymentItem.classList.add('_empty')
			paymentItemNewInputs.forEach(input => {
				input.disabled = false
			});
		} else {
			const paymentItemCheckbox = paymentItem.querySelector('.checkbox__body');
			if (paymentItemCheckbox) {
				const paymentItemCheckboxItem = paymentItemCheckbox.querySelector('.checkbox__item');
				paymentItemCheckbox.removeChild(paymentItemCheckboxItem)
				for (let index = 0; index < Object.keys(dataItem).length; index++) {
					const newElement = paymentItemCheckboxItem.cloneNode(true)
					if (paymentItemType == 'address') {
						const currentAddress = dataItem[Object.keys(dataItem)[index]]
						newElement.querySelector('input') ? newElement.querySelector('input').id = 'pa' + index : null
						newElement.querySelector('label') ? newElement.querySelector('label').setAttribute('for', 'pa' + index) : null
						newElement.querySelector('.checkbox__text') ? newElement.querySelector('.checkbox__text').innerHTML = [currentAddress['region'], currentAddress['city'], currentAddress['address'], currentAddress['index']].filter(item => item).join(', ') : null
					} else if (paymentItemType == 'payment') {
						newElement.querySelector('input') ? newElement.querySelector('input').id = 'pc' + index : null
						newElement.querySelector('label') ? newElement.querySelector('label').setAttribute('for', 'pc' + index) : null
						const cardInfo = newElement.querySelectorAll('[data-get-user-info]');
						cardInfo.forEach(element => {
							element.setAttribute('data-get-user-info', element.getAttribute('data-get-user-info').replace('${$}', Object.keys(dataItem)[index]))
						});
					}
					paymentItemCheckbox.append(newElement)
					//updateAccountInfo(newElement.querySelectorAll('[data-get-user-info]'))
				}
			}
			paymentItem.classList.remove('_empty')
			paymentItemNewInputs.forEach(input => {
				input.disabled = true
			});
		}
	});
}
showPaymentItem()
updateAccountInfo()