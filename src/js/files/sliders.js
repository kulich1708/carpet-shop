/*
Документация по работе в шаблоне: 
Документация слайдера: https://swiperjs.com/
Сниппет(HTML): swiper
*/

// Подключаем слайдер Swiper из node_modules
// При необходимости подключаем дополнительные модули слайдера, указывая их в {} через запятую
// Пример: { Navigation, Autoplay }
import Swiper, { Navigation, Pagination, Scrollbar } from 'swiper';
/*
Основниые модули слайдера:
Navigation, Pagination, Autoplay, 
EffectFade, Lazy, Manipulation
Подробнее смотри https://swiperjs.com/
*/

// Стили Swiper
// Базовые стили
import "../../scss/base/swiper.scss";
// Полный набор стилей из scss/libs/swiper.scss
// import "../../scss/libs/swiper.scss";
// Полный набор стилей из node_modules
// import 'swiper/css';

// Инициализация слайдеров
function initSliders() {
	// Перечень слайдеров
	// Проверяем, есть ли слайдер на стронице
	const mainSliderBlock = document.querySelector('.slider-main__inner');
	if (mainSliderBlock) { // Указываем скласс нужного слайдера
		// Создаем слайдер
		let mainSlider = new Swiper(mainSliderBlock, { // Указываем скласс нужного слайдера
			// Подключаем модули слайдера
			// для конкретного случая
			modules: [Navigation, Pagination],
			observer: true,
			observeParents: true,
			slidesPerView: 2,
			spaceBetween: 20,
			//autoHeight: true,
			speed: 800,
			allowTouchMove: true,
			grabCursor: true,
			updateOnWindowResize: true,

			//touchRatio: 0,
			//simulateTouch: false,
			//loop: true,
			//preloadImages: false,
			//lazy: true,

			/*
			// Эффекты
			effect: 'fade',
			autoplay: {
				delay: 3000,
				disableOnInteraction: false,
			},
			*/

			// Пагинация

			pagination: {
				el: '.slider-main__pagination',
				clickable: true,
			},


			// Скроллбар
			/*
			scrollbar: {
				el: '.swiper-scrollbar',
				draggable: true,
			},
			*/

			// Кнопки "влево/вправо"
			/*navigation: {
				prevEl: '.swiper-button-prev',
				nextEl: '.swiper-button-next',
			},*/

			// Брейкпоинты

			breakpoints: {
				320: {
					slidesPerView: 1,
					spaceBetween: 0,
				},
				500: {
					slidesPerView: 2,
				},
				767.98: {
					slidesPerView: 3,
				},
				991.98: {
					slidesPerView: 2,
				},
			},
			// События
			on: {

			}
		});
	}
	// Проверяем, есть ли слайдер на стронице
	const newProductsSliderBlock = document.querySelector('.slider-item_novelty div');
	if (newProductsSliderBlock) { // Указываем скласс нужного слайдера
		// Создаем слайдер
		let newProductsSlider = new Swiper(newProductsSliderBlock, { // Указываем скласс нужного слайдера
			// Подключаем модули слайдера
			// для конкретного случая
			modules: [Navigation, Pagination, Scrollbar],
			observer: true,
			observeParents: true,
			slidesPerView: 4,
			speed: 500,
			updateOnWindowResize: true,

			// Скроллбар
			scrollbar: {
				el: '.slider-item_novelty .slider-item__scrollbar',
				draggable: true,
			},

			// Кнопки "влево/вправо"
			navigation: {
				prevEl: '.item-content__navigation_novelty .navigation-slider__button_prev',
				nextEl: '.item-content__navigation_novelty .navigation-slider__button_next',
			},

			// Брейкпоинты

			breakpoints: {
				320: {
					slidesPerView: 1.15,
					spaceBetween: 20,
					allowTouchMove: true,
				},
				375: {
					slidesPerView: 1.5,
					spaceBetween: 20,
					allowTouchMove: true,
				},
				480: {
					slidesPerView: 2.2,
					spaceBetween: 20,
					allowTouchMove: false,
				},
				600: {
					slidesPerView: 2.5,
					spaceBetween: 20,
					allowTouchMove: false,
				},
				768: {
					slidesPerView: 3.2,
					spaceBetween: 20,
					allowTouchMove: false,
				},
				1024: {
					slidesPerView: 3.5,
					spaceBetween: 40,
					allowTouchMove: false,
				},
				1320: {
					slidesPerView: 4,
					spaceBetween: 40,
					allowTouchMove: false,
				},
				1440: {
					slidesPerView: 4,
					spaceBetween: 40,
					allowTouchMove: false,
				},
			},
			// События
			on: {

			}
		});
	}
	// Проверяем, есть ли слайдер на стронице
	const discountSliderBlock = document.querySelector('.slider-item_discount div');
	if (discountSliderBlock) { // Указываем скласс нужного слайдера
		// Создаем слайдер
		let discountSlider = new Swiper(discountSliderBlock, { // Указываем скласс нужного слайдера
			// Подключаем модули слайдера
			// для конкретного случая
			modules: [Navigation, Pagination, Scrollbar],
			observer: true,
			observeParents: true,
			slidesPerView: 4,
			speed: 500,
			updateOnWindowResize: true,

			// Скроллбар
			scrollbar: {
				el: '.slider-item_discount .slider-item__scrollbar',
				draggable: true,
			},

			// Кнопки "влево/вправо"
			navigation: {
				prevEl: '.item-content__navigation_discount .navigation-slider__button_prev',
				nextEl: '.item-content__navigation_discount .navigation-slider__button_next',
			},

			// Брейкпоинты

			breakpoints: {
				320: {
					slidesPerView: 1.15,
					spaceBetween: 20,
					allowTouchMove: true,
				},
				375: {
					slidesPerView: 1.5,
					spaceBetween: 20,
					allowTouchMove: true,
				},
				480: {
					slidesPerView: 2.2,
					spaceBetween: 20,
					allowTouchMove: false,
				},
				600: {
					slidesPerView: 2.5,
					spaceBetween: 20,
					allowTouchMove: false,
				},
				768: {
					slidesPerView: 3.2,
					spaceBetween: 20,
					allowTouchMove: false,
				},
				1024: {
					slidesPerView: 3.5,
					spaceBetween: 40,
					allowTouchMove: false,
				},
				1320: {
					slidesPerView: 4,
					spaceBetween: 40,
					allowTouchMove: false,
				},
				1440: {
					slidesPerView: 4,
					spaceBetween: 40,
					allowTouchMove: false,
				},
			},
			// События
			on: {

			}
		});
	}
	// Проверяем, есть ли слайдер на стронице
	const imageSideSliderBlock = document.querySelector('.image-product__slider');
	if (imageSideSliderBlock) { // Указываем скласс нужного слайдера
		// Создаем слайдер
		let imageSideSlider = new Swiper(imageSideSliderBlock, { // Указываем скласс нужного слайдера
			// Подключаем модули слайдера
			// для конкретного случая
			modules: [],
			observer: true,
			observeParents: true,
			slidesPerView: 3,
			speed: 500,
			allowTouchMove: true,
			grabCursor: true,

			// Брейкпоинты

			breakpoints: {
				320: {
					//slidesPerView: 1.15,
					spaceBetween: 20,
					direction: 'horizontal',
				},
				767.98: {
					//slidesPerView: 1.15,
					spaceBetween: 30,
					direction: 'vertical',
				},
				991.98: {
					//slidesPerView: 1.15,
					spaceBetween: 40,
					direction: 'vertical',
				},
			},
			// События
			on: {

			}
		});
	}
	// Проверяем, есть ли слайдер на стронице
	const otherProductSliderBlock = document.querySelector('.other-products__slider');
	if (otherProductSliderBlock) { // Указываем скласс нужного слайдера
		// Создаем слайдер
		let otherProductSlider = new Swiper(otherProductSliderBlock, { // Указываем скласс нужного слайдера
			// Подключаем модули слайдера
			// для конкретного случая
			modules: [Navigation, Scrollbar],
			observer: true,
			observeParents: true,
			speed: 500,
			allowTouchMove: true,
			grabCursor: true,

			// Кнопки "влево/вправо"
			navigation: {
				prevEl: '.other-products__navigation .navigation-slider__button_prev',
				nextEl: '.other-products__navigation .navigation-slider__button_next',
			},

			// Скроллбар
			scrollbar: {
				el: '.other-products__scrollbar',
				draggable: true,
			},
			// Брейкпоинты

			breakpoints: {
				0: {
					slidesPerView: 1.4,
					spaceBetween: 20,
				},
				400: {
					slidesPerView: 2,
					spaceBetween: 20,
				},
				650: {
					slidesPerView: 3,
					spaceBetween: 30,
				},
				991.98: {
					slidesPerView: 4,
					spaceBetween: 40,
				},
			},
			// События
			on: {

			}
		});
	}
}
// Скролл на базе слайдера (по классу swiper_scroll для оболочки слайдера)
function initSlidersScroll() {
	let sliderScrollItems = document.querySelectorAll('.swiper_scroll');
	if (sliderScrollItems.length > 0) {
		for (let index = 0; index < sliderScrollItems.length; index++) {
			const sliderScrollItem = sliderScrollItems[index];
			const sliderScrollBar = sliderScrollItem.querySelector('.swiper-scrollbar');
			const sliderScroll = new Swiper(sliderScrollItem, {
				observer: true,
				observeParents: true,
				direction: 'vertical',
				slidesPerView: 'auto',
				freeMode: {
					enabled: true,
				},
				scrollbar: {
					el: sliderScrollBar,
					draggable: true,
					snapOnRelease: false
				},
				mousewheel: {
					releaseOnEdges: true,
				},
			});
			sliderScroll.scrollbar.updateSize();
		}
	}
}

window.addEventListener("load", function (e) {
	// Запуск инициализации слайдеров
	initSliders();
	// Запуск инициализации скролла на базе слайдера (по классу swiper_scroll)
	//initSlidersScroll();
});