(() => {
    const API_URL = "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json";
    const LOCAL_STORAGE_KEY = "favorite_products";
    const CAROUSEL_STORAGE_KEY = "carousel_products";

    const init = async () => {
        if (!document.querySelector(".product-detail")) return;

        let products = getProductsFromStorage() || await fetchProducts();

        buildHTML(products);
        buildCSS();

        // events
        setDragEvent();
        setHeartEvent();
        setNavigationButtonEvent();
    };

    const fetchProducts = async () => {
        try {
            const response = await fetch(API_URL);
            const products = await response.json();
            localStorage.setItem(CAROUSEL_STORAGE_KEY, JSON.stringify(products));
            return products;
        } catch (error) {
            console.error("Failed to fetch products:", error);
            return [];
        }
    };

    const getProductsFromStorage = () => {
        const storedData = localStorage.getItem(CAROUSEL_STORAGE_KEY);
        return storedData ? JSON.parse(storedData) : null;
    };

    const buildHTML = (products) => {
        /*  Structure
        
        <div> class='carousel-container'
            <h2> 
            <div> class='carousel-wrapper'
                <div> class='carousel'
                    <div> class='carousel-item'
                    .
                    .
                <div>
            <div>
        <div>
        */

        const container = document.createElement("div");
        container.classList.add("carousel-container");

        const title = document.createElement("h2");
        title.classList.add("title");
        title.innerText = "You Might Also Like";

        const carouselWrapper = document.createElement("div");
        carouselWrapper.classList.add("carousel-wrapper");

        const carousel = document.createElement("div");
        carousel.classList.add("carousel");

        products.forEach(product => {
            const productElement = document.createElement("div");
            productElement.classList.add("carousel-item");
            productElement.innerHTML = `
                <a href="${product.url}" target="_blank">
                    <img src="${product.img}" alt="${product.name}" />
                    <p class="product-name">${product.name}</p>
                </a>
                
                <div class="heartContainer"> 
                    <svg  fill="currentColor"  xmlns="http://www.w3.org/2000/svg" width="20.576" height="19.483" viewBox="0 0 20.576 19.483">
                        <path class="heart" fill="white" stroke="#555" data-id="${product.id}" stroke-width="1.5px" d="M19.032 7.111c-.278-3.063-2.446-5.285-5.159-5.285a5.128 5.128 0 0 0-4.394 2.532 4.942 4.942 0 0 0-4.288-2.532C2.478 1.826.31 4.048.032 7.111a5.449 5.449 0 0 0 .162 2.008 8.614 8.614 0 0 0 2.639 4.4l6.642 6.031 6.755-6.027a8.615 8.615 0 0 0 2.639-4.4 5.461 5.461 0 0 0 .163-2.012z" transform="translate(.756 -1.076)"></path>
                    </svg>                
                </div>
                <span class="price">${product.price} TL </span>
                <button class="addBasket-btn"> SEPETE EKLE </button>
            `;

            if (isFavorite(product.id)) {
                productElement.querySelector(".heart").classList.add("favorited");
            }

            carousel.appendChild(productElement);
        });

        // navigation buttons 
        const prevButton = document.createElement("button");
        prevButton.classList.add("carousel-btn", "prev-btn");
        prevButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14.242" height="24.242" viewBox="0 0 14.242 24.242"><path fill="none" stroke="#333" stroke-linecap="round" stroke-width="3px" d="M2106.842 2395.467l-10 10 10 10" transform="translate(-2094.721 -2393.346)"></path></svg>'

        const nextButton = document.createElement("button");
        nextButton.classList.add("carousel-btn", "next-btn");
        nextButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14.242" height="24.242" viewBox="0 0 14.242 24.242"><path fill="none" stroke="#333" stroke-linecap="round" stroke-width="3px" d="M2106.842 2395.467l-10 10 10 10" transform="translate(-2094.721 -2393.346)"></path></svg>';

        carouselWrapper.appendChild(prevButton);
        carouselWrapper.appendChild(carousel);
        carouselWrapper.appendChild(nextButton);

        container.appendChild(title);
        container.appendChild(carouselWrapper);

        document.querySelector(".product-detail").after(container);
    };

    const buildCSS = () => {
        const css = `
            * {
                margin:0px;
                font-family: 'Open Sans', sans-serif !important;
            }

            .title {
                font-size: 32px;
                line-height: 43px;
                color: #29323b !important;
                font-weight: lighter !important;
                padding: 15px 60px 15px;
            }

            /* Carousel Container */
            .carousel-container {
                background-color: #f4f5f7;
                padding: 5px 60px 5px;
            }

            .carousel-wrapper {
                margin: 10px 60px 15px;
                position: relative;
            }

            .carousel {
                display: flex;
                overflow-x: hidden;
                gap: 15.9px;
                transition:0s ease-in;
            }

            .carousel-item {
                min-width: 210px;
                height: auto;
                text-align: left;
                position: relative;
                cursor: pointer !important;
                user-select: none; /* Prevent selection */
                -webkit-user-drag: none; /* Prevent image dragging */
            }

            .carousel-item img {
                position: relative;
                width: 210px;
                height: 280px;
                cursor: pointer !important;
                pointer-events: none; /* Prevent image interactions */
            }

            .carousel-item a {
                text-decoration: none !important;
            }

            .carousel-item .addBasket-btn {
                height: 35px;
                display: none;
                background-color: #193db0;
                color: #fff;
                width: 94%;
                border-radius: 5px;
                border: none;
                line-height: 19px;
                font-size: 14px;
                font-weight: 400;
                margin: 20px 7px;
                font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
                text-transform: uppercase;
            }

            .product-name {
                font-size: 14px;
                color: #302e2b !important;
                margin: 3px 7px 10px;
                min-height: 50px;
            }

            .price {
                color: #193db0;
                font-size: 18px;
                display: inline-block;
                line-height: 22px;
                font-weight: 550;
                cursor: default;
                margin: 0px 7px 0px;
            }

            .heartContainer {
                cursor: pointer;
                position: absolute;
                top: 9px;
                right: 12px;
                width: 34px;
                height: 34px;
                background-color: #fff;
                border-radius: 5px;
                box-shadow: 0 3px 6px 0 rgba(0, 0, 0, .16);
                border: solid .5px #b6b7b9;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .heart {
                stroke: #555;
                transition: fill 0.3s ease, stroke 0.3s ease;
            }

            .heart.favorited {
                fill: blue !important;
                stroke: blue !important;
            }


            /* Carousel buttons */
            .carousel-btn {
                display: block;
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                font-size: 24px;
                color: white;
                border: none;
                background-color: #f4f5f7;
                cursor: pointer;
                padding: 10px;
            }

            .prev-btn {
                left: -40px;
            }

            .next-btn {
                right: -40px;
                transform: rotate(180deg) translateY(50%);
            }

            
            /* Mobile Codes - 991px and lower resolutions */
            @media (max-width: 991px) {
                *{
                    cursor: pointer !important;
                }
                .title {
                    font-size: 24px;
                    color: #29323b;
                    line-height: 33px;
                    font-weight: lighter;
                    padding: 10px 10px;
                    min-height: 63px;
                    margin: 0;
                }

                .carousel-container {
                    background-color: #f4f5f7;
                    padding: 15px 10px 15px;
                    overflow-x: hidden; /* Scrollbar'ı kaldır */
                }

                .carousel {
                    scroll-snap-type: x mandatory;
                    overflow-x: auto; /* Kaydırmayı koru ama scrollbar'ı gösterme */
                    -ms-overflow-style: none;  /* IE ve Edge için scrollbar gizleme */
                    scrollbar-width: none;  /* Firefox için scrollbar gizleme */
                }

                .carousel::-webkit-scrollbar {
                    display: none; /* Chrome, Safari ve Opera için scrollbar gizleme */
                }

                .carousel-wrapper {
                    margin: 10px 60px 10px;
                    position: relative;
                }

                .carousel-btn {
                    opacity: 0;
                    visibility: hidden;
                    pointer-events: none; /* Tıklanmasını da engelle */
                }

                .carousel-item {
                    min-width: 280px;
                }

                .carousel {
                    scroll-snap-type: x mandatory;
                    overflow-x: scroll;
                }

                .carousel-wrapper {
                    margin: 0 15px;
                }

                .carousel-item p {
                    margin-bottom: 10px;
                }

                /* Add To Basket Button */
                .carousel-item .addBasket-btn {
                    display: block;
                }

                /* Mobile Images */
                .carousel-item img {
                    width: 100%;
                    height: auto;
                }
            }
        `;

        const style = document.createElement("style");
        style.innerHTML = css;
        document.head.appendChild(style);
    };

    // favorite logic 
    const setHeartEvent = () => {
        document.querySelectorAll(".heart").forEach(heart => {
            heart.addEventListener("click", (e) => {
                e.stopPropagation();
                const productId = e.target.dataset.id;
                toggleFavorite(productId, e.target);
            });
        });
    }

    // drag with mouse event logic
    const setDragEvent = () => {
        const carousel = document.querySelector(".carousel");
        let isDragging = false, startX, scrollLeft;

        carousel.addEventListener("mousedown", (e) => {
            isDragging = true;
            startX = e.pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
        });

        carousel.addEventListener("mouseleave", () => {
            isDragging = false;
        });

        carousel.addEventListener("mouseup", () => {
            isDragging = false;
        });

        carousel.addEventListener("mousemove", (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - carousel.offsetLeft;
            const walk = x - startX;
            carousel.scrollLeft = scrollLeft - walk;
        });
    };

    // scroll button logic 
    const setNavigationButtonEvent = () => {
        document.querySelector(".prev-btn").addEventListener("click", () => scrollCarousel(-1));
        document.querySelector(".next-btn").addEventListener("click", () => scrollCarousel(1));
    }

    const scrollCarousel = (direction) => {
        const carousel = document.querySelector(".carousel");
        const itemWidth = carousel.querySelector(".carousel-item").offsetWidth + 15;
        carousel.scrollBy({ left: direction * itemWidth, behavior: "smooth" });
    };

    const toggleFavorite = (id, element) => {
        let favorites = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
        if (favorites.includes(id)) {
            favorites = favorites.filter(favId => favId !== id);
            element.classList.remove("favorited");
        } else {
            favorites.push(id);
            element.classList.add("favorited");
        }
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(favorites));
    };

    const isFavorite = (id) => {
        const favorites = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
        return favorites.includes(id.toString());
    };

    init();
})();