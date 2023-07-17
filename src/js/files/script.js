// Подключение функционала "Чертогов Фрилансера"
//import { Logger } from "sass";
import { isMobile, tabs } from "./functions.js";
// Подключение списка активных модулей
import { modules } from "./modules.js";

window.mainPath = '/carpet-shop/'

const sideImages = document.querySelectorAll('.image-product__imageblock img');
const mainImage = document.querySelector('.image-product__main img');
if (sideImages && mainImage) {
	mainImage.src = sideImages[0].src
}

let outPlaceholderInputs = document.querySelectorAll('input[data-out-placeholder]');

const cityItems = document.querySelectorAll('.city-popup__item');

import { bodyLockToggle, bodyLockStatus } from './functions.js';
document.addEventListener("click", function (e) {
	outPlaceholderInputs.forEach(outPlaceholderInput => {
		if (e.target.closest(outPlaceholderInput.getAttribute('data-out-placeholder')) || e.target == outPlaceholderInput.nextElementSibling) {
			if (outPlaceholderInput.value != '') {
				document.querySelector(outPlaceholderInput.getAttribute('data-out-placeholder')).parentElement.classList.add('auto-width');
			} else { document.querySelector(outPlaceholderInput.getAttribute('data-out-placeholder')).parentElement.classList.remove('auto-width') }
			outPlaceholderInput.focus();
		}
	})
	cityItems.forEach(cityItem => {
		if (cityItem.contains(e.target)) {
			const cityItemsActive = document.querySelectorAll('.city-popup__item._active');
			cityItemsActive.forEach(cityItemActive => {
				cityItemActive.classList.remove('_active');
			})
			cityItem.classList.add('_active');
			const dataUser = JSON.parse(localStorage.getItem('carpet-shop'))
			dataUser.city = e.target.innerHTML
			localStorage.setItem('carpet-shop', JSON.stringify(dataUser));
			dataFilling();
		}
	})
	if (e.target.closest('.favorite-product')) {
		e.target.closest('.favorite-product').classList.toggle('_active')
		if (e.target.closest('.favorite-product').classList.contains('_active')) {
			const dataUser = JSON.parse(localStorage.getItem('carpet-shop'))
			dataUser['favorite-quant'] = dataUser['favorite-quant'] ? +dataUser['favorite-quant'] + 1 : 1
			localStorage.setItem('carpet-shop', JSON.stringify(dataUser));
		} else {
			const dataUser = JSON.parse(localStorage.getItem('carpet-shop'))
			dataUser['favorite-quant'] = +dataUser['favorite-quant'] - 1
			localStorage.setItem('carpet-shop', JSON.stringify(dataUser));
		}
		updateFavoriteQuant()
	}

	if (sideImages && mainImage) {
		for (const sideImage of sideImages) {
			if (sideImage == e.target) {
				mainImage.src = e.target.src
			}
		}
	}

	if (e.target.closest('.cart-product')) {
		const dataUser = JSON.parse(localStorage.getItem('carpet-shop'))
		dataUser['cart-quant'] = dataUser['cart-quant'] ? +dataUser['cart-quant'] + 1 : 1
		localStorage.setItem('carpet-shop', JSON.stringify(dataUser));
		updateCartQuant()
	}

	if (document.querySelector(".filter-action") && bodyLockStatus && (e.target.closest('.filter-action') || e.target.closest('.filter__close'))) {
		bodyLockToggle();
		document.documentElement.classList.toggle("filter-open");
	}

	if (e.target.closest('.item-account__title') && e.target.closest('.item-account__title').closest('.item-account._active')) {
		if (e.target.closest('.item-account__title').classList.contains('form-change-title')) {
			closeChangeForm(e.target.closest('.item-account').querySelector('.item-account__body_change'))
		} else {
			const tabsBlock = e.target.closest('[data-tabs]')
			const tabsNavigation = tabsBlock.querySelector('.tabs-account__navigation')
			if (tabsNavigation) {
				tabsBlock.style.height = tabsNavigation.offsetHeight + 'px'
			}
			const tabsItem = tabsBlock.querySelector('.tabs-account__item._active');
			if (tabsItem) {
				tabsItem.classList.remove('_active')
			}
			const account = document.querySelector('.account');
			if (account) {
				account.classList.remove('_mobile-tab-open')
			}
			const tabsTitles = tabsBlock.querySelector('[data-tabs-titles]')
			if (tabsTitles) {
				tabsTitles.classList.remove('_opacity')
			}

		}
	}
	const item = e.target.closest('.item-account')
	const itemType = item ? item.getAttribute('data-account-item') : null
	if (itemType) {
		const itemChangeForm = item.querySelector(`.${itemType}-change`);
		const itemButtonEdit = e.target.closest('.actions-account__item_change');
		if (itemButtonEdit && itemButtonEdit.getAttribute(`data-${itemType}-id`) && itemChangeForm) {
			openChangeForm(itemChangeForm, +itemButtonEdit.getAttribute(`data-${itemType}-id`))
		}
		const itemButtonDelete = e.target.closest('.actions-account__item_delete');
		if (itemButtonDelete && itemButtonDelete.getAttribute(`data-${itemType}-id`)) {
			deleteAccountItem(itemButtonDelete, +itemButtonDelete.getAttribute(`data-${itemType}-id`))
		}
	}

	const sortItem = e.target.closest('.sort-category__item')
	if (sortItem) {
		sortItem.parentElement.querySelector('.sort-category__item._active').classList.remove('_active')
		sortItem.classList.add('_active')
	}
	const newItemButton = e.target.closest(`.new-item-button`)
	const paymentItem = e.target.closest('[data-payment-item-type]');
	if (paymentItem) {
		const paymentItemType = paymentItem.getAttribute('data-payment-item-type');
		const paymentItemNew = paymentItem.querySelector(`.item-payment-form`);
		if (newItemButton) {
			paymentItem.classList.add('_empty')
			if (paymentItemNew) {
				const paymentItemNewInputs = paymentItemNew.querySelectorAll('input, select');
				paymentItemNewInputs.forEach(input => {
					input.disabled = false
				});
			}
		}
		const itemPaymentTitle = e.target.closest(`.item-title`)
		if (itemPaymentTitle && Object.keys(JSON.parse(localStorage.getItem('carpet-shop'))['user'][paymentItemType]).length != 0) {
			paymentItem.classList.remove('_empty')
			if (paymentItemNew) {
				const paymentItemNewInputs = paymentItemNew.querySelectorAll('input, select');
				paymentItemNewInputs.forEach(input => {
					input.disabled = true
				});
			}
		}
	}
	if (e.target.closest('.tabs-account__action_sign-out')) {
		let dataUser = JSON.parse(localStorage.getItem('carpet-shop'))
		dataUser['user']['isLogged'] = 'false'

		localStorage.setItem('carpet-shop', JSON.stringify(dataUser))
		isLogged()
	}
});
const paymentItems = document.querySelectorAll('[data-payment-item-type]');
paymentItems.forEach(paymentItem => {
	const paymentItemType = paymentItem.getAttribute('data-payment-item-type');
	if (document.querySelector(`.item-title`) && Object.keys(JSON.parse(localStorage.getItem('carpet-shop'))['user'][paymentItemType]).length == 0) {
		document.querySelector(`.item-title`).classList.add('_disabled')
	}
})
function dataFilling(e = false) {
	for (let i = 0; i < Object.keys(JSON.parse(localStorage.getItem('carpet-shop'))).length; i++) {
		let keys = Object.keys(JSON.parse(localStorage.getItem('carpet-shop')));
		let values = Object.values(JSON.parse(localStorage.getItem('carpet-shop')));
		let elementsForm = document.querySelectorAll(`[name="${keys[i]}"]`);
		if (!e && elementsForm) {
			elementsForm.forEach(e => {
				if (!e.hasAttribute('data-dont-remember')) {
					e.value = values[i];
				}
			})
		}
		let elementsBlock = document.querySelectorAll(`.user-${keys[i]}`);
		if (elementsBlock.length) {
			elementsBlock.forEach(e => {
				e.innerHTML = values[i];
			})
		}
	}
}
dataFilling();

const products = document.querySelectorAll('.product');

if (products) {
	for (const product of products) {
		const productPrices = product.querySelectorAll('.price-product__item span');

		if (productPrices) {
			let productPricesActive = Array.from(productPrices).filter(e => e.innerHTML != '')

			if (productPricesActive.length > 2) {
				productPricesActive = productPricesActive.slice(0, 2)
			}

			for (const productPrice of productPricesActive) {
				productPrice.closest('.price-product').classList.add('_active')
			}
			productPricesActive.at(-1).closest('.price-product').classList.add('_active-last')
		}
	}
}


const filterAction = document.querySelector('.filter-action');
if (!isMobile.any() && filterAction) {
	filterAction.querySelector('.filter-action__subtitle').innerHTML = document.querySelector('.category__title').innerHTML
}

function fillingFilterAction() {
	const categoryCheckboxes = document.querySelectorAll('.header-filter__checkbox .checkbox__item');
	let checkedTextArr = []
	if (categoryCheckboxes) {
		for (const categoryCheckbox of categoryCheckboxes) {
			if (categoryCheckbox.querySelector('input').checked) {
				checkedTextArr.push(categoryCheckbox.querySelector('.checkbox__text').innerHTML)
			}
		}
	}
	if (!checkedTextArr.length) {
		checkedTextArr = ['Не выбрано']
	}
	checkedTextArr = checkedTextArr.map((item, index) => {
		if (index == checkedTextArr.length - 1) {
			return `<span>${item}</span>`
		} else {
			return `<span>${item},</span>`
		}
	})
	let checkedText = checkedTextArr.join('')
	if (filterAction) {
		filterAction.querySelector('.filter-action__subtitle').innerHTML = checkedText
	}
}
fillingFilterAction()
document.addEventListener("change", function (e) {
	if (e.target.classList.contains('checkbox__input')) {
		fillingFilterAction()
	}
});

function updateCartQuant() {
	const cartQuantBlocks = document.querySelectorAll('.cart-quant');
	cartQuantBlocks.forEach(cartQuantBlock => {
		cartQuantBlock.innerHTML = JSON.parse(localStorage.getItem('carpet-shop'))['cart-quant'] ? JSON.parse(localStorage.getItem('carpet-shop'))['cart-quant'] : 0
	});
}
updateCartQuant()
function updateFavoriteQuant() {
	const favoriteQuantBlocks = document.querySelectorAll('.favorite-quant');
	favoriteQuantBlocks.forEach(favoriteQuantBlock => {
		favoriteQuantBlock.innerHTML = JSON.parse(localStorage.getItem('carpet-shop'))['favorite-quant'] ? JSON.parse(localStorage.getItem('carpet-shop'))['favorite-quant'] : 0
	});

}
updateFavoriteQuant()
var moneyFormat = wNumb({
	mark: ',',
	thousand: '.',
});
window.calcPriceTotalProduct = (inputQuantity) => {
	if (inputQuantity.closest('.cart')) {
		const priceTotalProduct = inputQuantity.closest('tr').querySelector('.product-cart__total span')
		const priceProduct = inputQuantity.closest('tr').querySelector('.product-cart__price span')
		if (priceTotalProduct && priceProduct) {
			priceTotalProduct.innerHTML = moneyFormat.to(moneyFormat.from(priceProduct.innerHTML) * +inputQuantity.value)
		}
		calcPriceTotal()
	}
}
function calcPriceTotal() {
	const priceTotalBlock = document.querySelector('.main-cart__total span');
	if (priceTotalBlock) {
		const priceTotalProducts = document.querySelectorAll('.product-cart__total span')
		let totalPrice = 0
		priceTotalProducts.forEach(priceTotalProduct => {
			totalPrice += moneyFormat.from(priceTotalProduct.innerHTML)
		});
		priceTotalBlock.innerHTML = moneyFormat.to(totalPrice)
	}
}
calcPriceTotal()

const cartBlock = document.querySelector('.cart');
if (cartBlock) {
	if (+JSON.parse(localStorage.getItem('carpet-shop'))['cart-quant']) {
		cartBlock.classList.remove('cart_empty')
		const porductItems = cartBlock.querySelector('table tbody')
		const porductItem = porductItems.querySelector('tr')
		if (porductItem) {
			for (let index = 1; index < +JSON.parse(localStorage.getItem('carpet-shop'))['cart-quant']; index++) {
				porductItems.appendChild(porductItem.cloneNode(true))
			}
		}
	} else {
		cartBlock.classList.add('cart_empty')
	}

	const inputsQuantity = document.querySelectorAll('.product-cart__quantity-input input');
	inputsQuantity.forEach(inputQuantity => {
		calcPriceTotalProduct(inputQuantity)
		inputQuantity.addEventListener("change", () => { calcPriceTotalProduct(inputQuantity) })
	});
}

const favoriteBlock = document.querySelector('.favorite');
if (favoriteBlock) {
	if (+JSON.parse(localStorage.getItem('carpet-shop'))['favorite-quant']) {
		favoriteBlock.classList.remove('favorite_empty')
		const porductItems = favoriteBlock.querySelector('.favorite__items')
		const porductItem = porductItems.querySelector('.favorite__item')
		if (porductItem) {
			porductItem.querySelector('.favorite-product').classList.add('_active')
			for (let index = 1; index < +JSON.parse(localStorage.getItem('carpet-shop'))['favorite-quant']; index++) {
				porductItems.appendChild(porductItem.cloneNode(true))
			}
		}
	} else {
		favoriteBlock.classList.add('favorite_empty')
	}
}


function isLogged() {
	if (JSON.parse(localStorage.getItem('carpet-shop'))['user']['isLogged'] != 'true' &&
		window.location.pathname == mainPath + 'account.html') {
		window.location.pathname = mainPath + 'auth.html'
	}
}
isLogged()

window.addEventListener("resize", function (e) {
	const tabsItemOpen = document.querySelector('.tabs-account__item._active');
	if (this.document.querySelector('.account')) {
		if (tabsItemOpen) {
			const tabsBlock = tabsItemOpen.closest('[data-tabs]')
			tabsBlock.style.height = tabsItemOpen.scrollHeight + 'px'
		}
		const tabsBlocks = document.querySelectorAll('[data-tabs]')
		tabsBlocks.forEach(tabsBlock => {
			if (document.documentElement.offsetWidth > 767.98) {
				const tabsTitles = tabsBlock.querySelector('[data-tabs-titles]')
				if (tabsTitles) {
					tabsTitles.classList.remove('_opacity')
				}
				tabsBlock.style.height = 'auto'
			} else {
				if (tabsBlock.querySelector('._tab-active')) {
					//tabsBlock.querySelector('._tab-active').classList.remove('_tab-active')
				}

				const tabsNavigation = tabsBlock.querySelector('.tabs-account__navigation')
				const tabsActive = tabsBlock.querySelectorAll('.item-account._active')
				if (tabsNavigation) {
					if (!tabsActive.length) {
						tabsBlock.style.height = tabsNavigation.scrollHeight + 'px'
					} else {
						tabsNavigation.classList.add('_opacity')
					}
				}
			}
		});
	}
});