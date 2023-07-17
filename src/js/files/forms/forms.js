// Подключение функционала "Чертогов Фрилансера"
// Подключение списка активных модулей
import { modules } from "../modules.js";
// Вспомогательные функции
import { isMobile, _slideUp, _slideDown, _slideToggle, FLS } from "../functions.js";
// Модуль прокрутки к блоку
import { gotoBlock } from "../scroll/gotoblock.js";
//================================================================================================================================================================================================================================================================================================================================

/*
Документация: https://template.fls.guru/template-docs/rabota-s-formami.html
*/
// Работа с полями формы. Добавление классов, работа с placeholder
export function formFieldsInit(options = { viewPass: false }) {
	// Если включено, добавляем функционал "скрыть плейсходлер при фокусе"
	let formFields = Array.from(document.querySelectorAll('input[placeholder],textarea[placeholder]'))
	let outPlaceholderInputs = document.querySelectorAll('input[data-out-placeholder]');
	outPlaceholderInputs.forEach(outPlaceholderInput => {
		let outPlaceholder = document.querySelector(outPlaceholderInput.getAttribute('data-out-placeholder'))
		formFields.push(outPlaceholder)
	})
	if (formFields.length) {
		formFields.forEach(formField => {
			if (!formField.hasAttribute('data-placeholder-nohide')) {
				if (formField.tagName == 'INPUT' || formField.tagName == 'TEXTAREA') {
					formField.dataset.placeholder = formField.placeholder;
				} else {
					formField.dataset.placeholder = formField.innerHTML
				}
			}
		});
	}
	document.body.addEventListener("focusin", function (e) {
		const targetElement = e.target;
		const outPlaceholder = document.querySelector(targetElement.getAttribute('data-out-placeholder'));
		if ((targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA')) {
			if (targetElement.dataset.placeholder || outPlaceholder && outPlaceholder.dataset.placeholder) {
				targetElement.placeholder = '';
				if (outPlaceholder) outPlaceholder.innerHTML = ''
			}
			if (!targetElement.hasAttribute('data-no-focus-classes')) {
				targetElement.classList.add('_form-focus');
				targetElement.parentElement.classList.add('_form-focus');
			}
			formValidate.removeError(targetElement);
		}
	});
	document.body.addEventListener("focusout", function (e) {
		const targetElement = e.target;
		const outPlaceholder = document.querySelector(targetElement.getAttribute('data-out-placeholder'));
		if ((targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA')) {
			if (targetElement.dataset.placeholder || outPlaceholder && outPlaceholder.dataset.placeholder) {
				targetElement.placeholder = targetElement.dataset.placeholder;
				if (outPlaceholder && targetElement.value == '') outPlaceholder.innerHTML = outPlaceholder.dataset.placeholder
			}
			if (!targetElement.hasAttribute('data-no-focus-classes')) {
				targetElement.classList.remove('_form-focus');
				targetElement.parentElement.classList.remove('_form-focus');
			}
			// Моментальная валидация
			if (targetElement.hasAttribute('data-validate')) {
				formValidate.validateInput(targetElement);
			}
		}
	});
	const forms = document.querySelectorAll('form[data-hide-button="edit"]');
	if (forms.length) {
		function changeFormActions(currentInput, dataInInputs, changeInputs) {
			const currentForm = currentInput.closest('form[data-hide-button="edit"]')

			if (currentForm) {
				for (let formIndex = 0; formIndex < forms.length; formIndex++) {
					const form = forms[formIndex];

					if (form == currentForm) {
						const inputs = form.querySelectorAll('input, select');

						for (let inputIndex = 0; inputIndex < inputs.length; inputIndex++) {
							const input = inputs[inputIndex];

							if (input == currentInput) {
								if (input.value == dataInInputs[formIndex][inputIndex]) {
									changeInputs[inputIndex] = 0
								} else {
									changeInputs[inputIndex] = 1
								}
								break
							}
						}
						const buttons = form.querySelectorAll('button[type="submit"]');
						if (changeInputs.reduce((acc, number) => acc + number) > 0) {
							buttons.forEach(button => {
								button.classList.remove('_no-active')
								button.disabled = false
							});
						} else {
							buttons.forEach(button => {
								button.classList.add('_no-active')
								button.disabled = true
							});

						}
						break
					}
				}
			}
			return changeInputs
		}
		window.dataInInputs = []
		window.setDataInInputs = (currentform) => {
			forms.forEach((form, formIndex) => {
				if (!currentform || currentform == form) {
					dataInInputs[formIndex] = []

					const buttons = document.querySelectorAll('button[type="submit"]');
					buttons.forEach(button => {
						button.classList.add('_no-active')
						button.disabled = true
					});

					const inputs = form.querySelectorAll('input, select');
					inputs.forEach((input, inputIndex) => {
						dataInInputs[formIndex][inputIndex] = input.value
					});
				}
			});
		}
		setDataInInputs()
		let changeInputs = []
		document.addEventListener("keyup", function (e) {
			const currentInput = e.target.closest('input')
			currentInput && e.target.closest('[data-hide-button="edit"]') ? changeInputs = changeFormActions(currentInput, dataInInputs, changeInputs) : null

		});
		document.addEventListener("click", function (e) {
			let currentSelect = e.target.closest('select')
			if (!currentSelect && e.target.closest('.select')) {
				currentSelect = e.target.closest('.select').querySelector('select')
			}
			currentSelect && e.target.closest('[data-hide-button="edit"]') ? changeInputs = changeFormActions(currentSelect, dataInInputs, changeInputs) : null

		});
	}


	// Если включено, добавляем функционал "Показать пароль"
	if (options.viewPass) {
		document.addEventListener("click", function (e) {
			let targetElement = e.target.closest('[class*="__viewpass"]');
			if (targetElement) {
				let inputType = targetElement.classList.contains('_viewpass-active') ? "password" : "text";
				targetElement.parentElement.querySelector('input').setAttribute("type", inputType);
				targetElement.classList.toggle('_viewpass-active');
			}
		});
	}
}
// Валидация форм
export let formValidate = {
	getErrors(form) {
		let error = 0;
		let formRequiredItems = form.querySelectorAll('*[data-required]');
		if (formRequiredItems.length) {
			formRequiredItems.forEach(formRequiredItem => {
				if ((formRequiredItem.offsetParent !== null || formRequiredItem.tagName === "SELECT") && !formRequiredItem.disabled) {
					error += this.validateInput(formRequiredItem);
				}
			});
		}
		return error;
	},
	validateInput(formRequiredItem) {
		let error = 0;
		if (formRequiredItem.dataset.required === "email") {
			formRequiredItem.value = formRequiredItem.value.replace(" ", "");
			const noRequired = formRequiredItem.hasAttribute('data-no-required-empty');
			if (((noRequired && formRequiredItem.value != '') || !noRequired)
				&& this.emailTest(formRequiredItem)) {
				this.addError(formRequiredItem);
				error++;
			} else {
				this.removeError(formRequiredItem);
			}
		} else if (formRequiredItem.classList.contains("checkbox") && formRequiredItem.querySelector('[type="radio"]')) {
			const radioInputs = formRequiredItem.querySelectorAll('[type="radio"]')
			let checked = 0
			for (const radioInput of radioInputs) {
				if (radioInput.checked) { checked = 1; break }
			}
			if (!checked) {
				this.addError(formRequiredItem);
				error++;
			}
		} else if (formRequiredItem.type === "radio" && !formRequiredItem.checked) {
			this.addError(formRequiredItem);
			error++;
		} else if (formRequiredItem.dataset.required === 'tel') {
			if (this.telTest(formRequiredItem)) {
				this.addError(formRequiredItem);
				error++;
			} else {
				this.removeError(formRequiredItem);
			}
		} else if (formRequiredItem.dataset.required === 'password') {
			if (this.passwordTest(formRequiredItem)) {
				this.addError(formRequiredItem);
				error++;
			} else {
				this.removeError(formRequiredItem);
			}
		} else if (formRequiredItem.dataset.required === 'code') {
			if (this.codeTest(formRequiredItem)) {
				this.addError(formRequiredItem);
				error++;
			} else {
				this.removeError(formRequiredItem);
			}
		} else if (formRequiredItem.dataset.required === 'month') {
			if (this.monthTest(formRequiredItem)) {
				this.addError(formRequiredItem);
				error++;
			} else {
				this.removeError(formRequiredItem);
			}
		} else if (formRequiredItem.dataset.required === 'card-num') {
			if (this.cardNumTest(formRequiredItem)) {
				this.addError(formRequiredItem);
				error++;
			} else {
				this.removeError(formRequiredItem);
			}
		} else {
			if (!formRequiredItem.value.trim()) {
				this.addError(formRequiredItem);
				error++;
			} else {
				this.removeError(formRequiredItem);
			}
		}
		return error;
	},
	addError(formRequiredItem, errorText = formRequiredItem.dataset.error) {
		formRequiredItem.classList.add('_form-error');
		if (formRequiredItem.closest('.form__input')) {
			formRequiredItem.closest('.form__input').classList.add('_form-error');
			let inputError = formRequiredItem.closest('.form__input').querySelector('.form__error');
			if (inputError) formRequiredItem.closest('.form__input').removeChild(inputError);
			if (errorText) {
				formRequiredItem.closest('.form__input').insertAdjacentHTML('beforeend', `<div class="form__error">${errorText}</div>`);
			}
		}
	},
	removeError(formRequiredItem) {
		formRequiredItem.classList.remove('_form-error');
		if (formRequiredItem.closest('.form__input')) {
			formRequiredItem.closest('.form__input').classList.remove('_form-error');
			if (formRequiredItem.closest('.form__input').querySelector('.form__error')) {
				formRequiredItem.closest('.form__input').removeChild(formRequiredItem.closest('.form__input').querySelector('.form__error'));
			}
		}
	},
	formClean(form) {
		form.reset();
		setTimeout(() => {
			let inputs = form.querySelectorAll('input,textarea');
			for (let index = 0; index < inputs.length; index++) {
				const el = inputs[index];
				el.parentElement.classList.remove('_form-focus');
				el.classList.remove('_form-focus');
				formValidate.removeError(el);
			}
			let checkboxes = form.querySelectorAll('.checkbox__input');
			if (checkboxes.length > 0) {
				for (let index = 0; index < checkboxes.length; index++) {
					const checkbox = checkboxes[index];
					checkbox.checked = false;
				}
			}
			if (modules.select) {
				let selects = form.querySelectorAll('.select');
				if (selects.length) {
					for (let index = 0; index < selects.length; index++) {
						const select = selects[index].querySelector('select');
						modules.select.selectBuild(select);
					}
				}
			}
		}, 0);
	},
	emailTest(formRequiredItem) {
		return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formRequiredItem.value);
	},
	telTest(formRequiredItem) {
		let tel = formRequiredItem.value.replace(/\s+/g, '').split('').filter(e => !isNaN(Number(e))).join('')
		return tel.length != 11
	},
	passwordTest(formRequiredItem) {
		return formRequiredItem.value.length < 6
	},
	codeTest(formRequiredItem) {
		return formRequiredItem.value.length != 4
	},
	monthTest(formRequiredItem) {
		return parseInt(formRequiredItem.value.match(/\d+/)) != formRequiredItem.value || formRequiredItem.value < 1 || formRequiredItem.value > 12
	},
	cardNumTest(formRequiredItem) {
		return formRequiredItem.value.replace(/[^\d]/g, '').length != 16
	}
}
/* Отправка форм */
export function formSubmit(options = { validate: true }) {
	const forms = document.forms;
	if (forms.length) {
		for (const form of forms) {
			form.addEventListener('submit', function (e) {
				const form = e.target;
				formSubmitAction(form, e);
			});
			form.addEventListener('reset', function (e) {
				const form = e.target;
				formValidate.formClean(form);
			});
		}
	}
	async function formSubmitAction(form, e) {
		const error = !form.hasAttribute('data-no-validate') ? formValidate.getErrors(form) : 0;

		let passwordComplianceError = 0
		let storageError = 0
		if (error === 0) {
			const checkPasswordInputs = document.querySelectorAll('.check-password-compliance');
			let basePassword
			if (checkPasswordInputs.length) basePassword = checkPasswordInputs[0].value
			for (let index = 0; index < checkPasswordInputs.length; index++) {
				const checkPasswordInput = checkPasswordInputs[index]
				if (checkPasswordInput.value != basePassword) {
					checkPasswordInput.closest('form').classList.add('password-compliance-error')
					passwordComplianceError = 1
					break
				}
				if (passwordComplianceError === 0) checkPasswordInput.closest('form').classList.remove('password-compliance-error');
			};

			const checkStorageInputs = document.querySelectorAll('[data-storage-error]');
			for (const checkStorageInput of checkStorageInputs) {
				let dataStorage = checkStorageInput.getAttribute('data-storage')
				let dataUser = JSON.parse(localStorage.getItem('carpet-shop'))['user']
				if (!(dataStorage in dataUser) || dataUser[dataStorage] != checkStorageInput.value) {
					storageError = 1
					formValidate.addError(checkStorageInput, checkStorageInput.getAttribute('data-storage-error'))
					break
				}
			}
		}
		if (error === 0 && passwordComplianceError === 0 && storageError === 0) {
			const ajax = form.hasAttribute('data-ajax');
			if (ajax) { // Если режим ajax
				e.preventDefault();
				const formAction = form.getAttribute('action') ? form.getAttribute('action').trim() : '#';
				const formMethod = form.getAttribute('method') ? form.getAttribute('method').trim() : 'GET';
				const formData = new FormData(form);

				form.classList.add('_sending');
				const response = await fetch(formAction, {
					method: formMethod,
					body: formData
				});
				if (response.ok) {
					let responseResult = await response.json();
					form.classList.remove('_sending');
					formSent(form, responseResult);
				} else {
					alert("Ошибка");
					form.classList.remove('_sending');
				}
			} else if (form.hasAttribute('data-dev')) {	// Если режим разработки
				e.preventDefault();
				formSent(form);
			}
		} else {
			e.preventDefault();
			const formError = form.querySelector('._form-error');
			if (formError && form.hasAttribute('data-goto-error')) {
				gotoBlock(formError, true, 1000);
			}
		}
	}
	// Действия после отправки формы
	function formSent(form, responseResult = ``) {
		// Создаем событие отправки формы
		document.dispatchEvent(new CustomEvent("formSent", {
			detail: {
				form: form
			}
		}));
		// Показываем попап, если подключен модуль попапов 
		// и для формы указана настройка
		setTimeout(() => {
			if (modules.popup) {
				const popup = form.dataset.popupMessage;
				popup ? modules.popup.open(popup) : null;
			}
		}, 0);

		if (form.hasAttribute('data-user-clear')) {
			localStorage.setItem('carpet-shop', JSON.stringify({ 'user': { 'address': {}, 'img': 'img/common/not-photo.png', 'payment': {} } }))
		}
		const inputs = form.querySelectorAll('[data-set-user-info]');
		inputs.forEach(input => {
			let inputDataType = input.getAttribute('data-set-user-info').split(',').map(e => e.trim())
			let inputDataValue = inputDataType.at(-1)
			inputDataType = inputDataType.slice(0, -1)

			let dataUser = JSON.parse(localStorage.getItem('carpet-shop'))
			let targetObject = dataUser['user']

			for (const type of inputDataType) {
				if (!targetObject[type]) {
					targetObject[type] = {}
				}
				targetObject = targetObject[type]
			}

			if (inputDataValue) {
				targetObject[inputDataValue] = input.value
				localStorage.setItem('carpet-shop', JSON.stringify(dataUser))
			}
		});

		if (form.hasAttribute('data-update-account')) {
			updateAccountInfo()
		}
		if (form.hasAttribute('data-close-form')) {
			closeChangeForm(form)
		}
		if (form.classList.contains('payment__content')) {
			const dataUser = JSON.parse(localStorage.getItem('carpet-shop'))
			dataUser['cart-quant'] = 0
			localStorage.setItem('carpet-shop', JSON.stringify(dataUser))
		}
		// Очищаем форму
		formValidate.formClean(form);
		updateAccountInfo()

		const buttons = document.querySelectorAll('form[data-hide-button="edit"] .button[type="submit"]');
		buttons.forEach(button => {
			button.classList.add('_no-active')
			button.disabled = true
		});

		// Сообщаем в консоль
		formLogging(`Форма отправлена!`);

		const dataLogged = form.getAttribute('data-logged')
		if (dataLogged) {
			let dataUser = JSON.parse(localStorage.getItem('carpet-shop'))
			dataUser['user']['isLogged'] = dataLogged

			localStorage.setItem('carpet-shop', JSON.stringify(dataUser))
		}

		// Переход на другую страницу
		if (form.hasAttribute('data-href')) {
			window.location.pathname = mainPath + form.getAttribute('data-href')
		}
	}
	function formLogging(message) {
		FLS(`[Формы]: ${message}`);
	}
}
/* Модуь формы "колличество" */
export function formQuantity() {
	let quantity = document.querySelectorAll('.quantity');
	for (let i = 0; i < quantity.length; i++) {
		let input = quantity[i].querySelector('input')
		let value = input.value
		let buttonMinus = quantity[i].querySelector('.quantity__button_minus')
		if (value == 1) {
			buttonMinus.classList.add('_disabled');
		} else {
			buttonMinus.classList.remove('_disabled');
		}
		input.addEventListener('change', () => {
			if (input.value < 1) input.value = 1
			if (input.value == 1) {
				buttonMinus.classList.add('_disabled');
			} else {
				buttonMinus.classList.remove('_disabled');
			}
			calcPriceTotalProduct(input)
		})

	}
	//createDisabled()
	document.addEventListener("click", function (e) {
		let targetElement = e.target;
		if (targetElement.closest('.quantity__button')) {
			const input = targetElement.closest('.quantity').querySelector('input')
			let value = parseInt(input.value);
			let buttonMinus = targetElement.closest('.quantity').querySelector('.quantity__button_minus');
			if (targetElement.classList.contains('quantity__button_plus')) {
				value++;
				buttonMinus.classList.remove('_disabled');
			} else {
				--value;
				if (value == 1) { buttonMinus.classList.add('_disabled'); }
				if (value < 1) value = 1;
			}
			input.value = value
			calcPriceTotalProduct(input)
		}
		//createDisabled()
	});
}
/* Модуь звездного рейтинга */
export function formRating() {
	const ratings = document.querySelectorAll('.rating');
	if (ratings.length > 0) {
		initRatings();
	}
	// Основная функция
	function initRatings() {
		let ratingActive, ratingValue, ratingBody;
		// "Бегаем" по всем рейтингам на странице
		for (let index = 0; index < ratings.length; index++) {
			const rating = ratings[index];
			initRating(rating);
		}
		// Инициализируем конкретный рейтинг
		function initRating(rating) {
			initRatingVars(rating);

			setRatingActiveWidth();

			if (rating.classList.contains('rating_set')) {
				setRating(rating);
			}
		}
		// Инициализайция переменных
		function initRatingVars(rating) {
			ratingBody = rating.querySelector('.rating__body')
			ratingActive = rating.querySelector('.rating__active');
			ratingValue = rating.querySelector('.rating__value');
		}
		// Изменяем ширину активных звезд
		function setRatingActiveWidth(index = ratingValue.innerHTML) {
			const ratingActiveWidth = index / 0.05;
			ratingActive.style.width = `calc(${ratingActiveWidth}% - ${+window.getComputedStyle(ratingBody).getPropertyValue('letter-spacing').slice(0, -2) / 2}px)`;
		}
		// Возможность указать оценку 
		function setRating(rating) {
			const ratingItems = rating.querySelectorAll('.rating__item');
			for (let index = 0; index < ratingItems.length; index++) {
				const ratingItem = ratingItems[index];
				ratingItem.addEventListener("mouseenter", function (e) {
					// Обновление переменных
					initRatingVars(rating);
					// Обновление активных звезд
					setRatingActiveWidth(ratingItem.value);
				});
				ratingItem.addEventListener("mouseleave", function (e) {
					// Обновление активных звезд
					setRatingActiveWidth();
				});
				ratingItem.addEventListener("click", function (e) {
					// Обновление переменных
					initRatingVars(rating);

					if (rating.dataset.ajax) {
						// "Отправить" на сервер
						setRatingValue(ratingItem.value, rating);
					} else {
						// Отобразить указанную оцнку
						ratingValue.innerHTML = index + 1;
						setRatingActiveWidth();
					}
				});
			}
		}
		async function setRatingValue(value, rating) {
			if (!rating.classList.contains('rating_sending')) {
				rating.classList.add('rating_sending');

				// Отправика данных (value) на сервер
				let response = await fetch('rating.json', {
					method: 'GET',

					//body: JSON.stringify({
					//	userRating: value
					//}),
					//headers: {
					//	'content-type': 'application/json'
					//}

				});
				if (response.ok) {
					const result = await response.json();

					// Получаем новый рейтинг
					const newRating = result.newRating;

					// Вывод нового среднего результата
					ratingValue.innerHTML = newRating;

					// Обновление активных звезд
					setRatingActiveWidth();

					rating.classList.remove('rating_sending');
				} else {
					alert("Ошибка");

					rating.classList.remove('rating_sending');
				}
			}
		}
	}
}