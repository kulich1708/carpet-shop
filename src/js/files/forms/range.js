// Подключение из node_modules
import * as noUiSlider from 'nouislider';

// Подключение стилей из scss/base/forms/range.scss 
// в файле scss/forms/forms.scss

// Подключение cтилей из node_modules
//import 'nouislider/dist/nouislider.css';

export function rangeInit() {
	const priceSlider = document.querySelector('.price-filter__slider');
	if (priceSlider) {
		let textFrom = priceSlider.getAttribute('data-from');
		let textTo = priceSlider.getAttribute('data-to');
		noUiSlider.create(priceSlider, {
			start: [0, 200000], // [0,200000]
			connect: true,
			range: {
				'min': [0],
				'max': [200000]
			},
			step: 1
		});

		const priceStart = document.querySelector('.price-filter__input_first');
		const priceEnd = document.querySelector('.price-filter__input_last');
		priceStart.addEventListener('change', setPriceValues);
		priceEnd.addEventListener('change', setPriceValues);
		const inputs = [priceStart, priceEnd]

		function setPriceValues() {
			let priceStartValue;
			let priceEndValue;
			if (priceStart.value != '') {
				priceStartValue = priceStart.value;
			}
			if (priceEnd.value != '') {
				priceEndValue = priceEnd.value;
			}
			priceSlider.noUiSlider.set([priceStartValue, priceEndValue]);
		}
		priceSlider.noUiSlider.on('update', function (values, handle) {
			inputs[handle].value = wNumb({ decimals: 0 }).from(values[handle]);
		});
	}
}
rangeInit();
