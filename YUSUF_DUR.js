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
        setScrollEvent();
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
        /*Structure
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
                    <p class="title">${product.name}</p>
                </a>
                <div class="heartContainer"> <span class="heart" data-id="${product.id}">❤</span> </div>
                <span class="price">${product.price}</span>
                <button class="addBasketButton">SEPETE EKLE</button>
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
                font-family: 'Open Sans', sans-serif !important;
            }

            .title {
                font-size: 24px;
                color: #29323b !important;
                line-height: 33px;
                font-weight: lighter;
                margin: 10px 60px 15px;
            }

            /* Carousel Container */
            .carousel-container {
                background-color: #f4f5f7;
                padding: 5px 60px 5px;
            }

            .carousel-wrapper {
                margin: 10px 30px 15px;
                position: relative;
                // overflow:hidden;
            }

            .carousel {
                display: flex;
                overflow-x: hidden;
                gap: 10px;
                transition:0s ease-in;
            }

            .carousel-item {
                min-width: 185px;
                text-align: left;
                position: relative;
                user-select: none; /* Prevent selection */
                -webkit-user-drag: none; /* Prevent image dragging */
            }

            .carousel-item img {
                position: relative;
                width: 100%;
                height: auto;
                pointer-events: none; /* Prevent image interactions */
            }

            .carousel-item p {
                font-size: 14px;
                color: #302e2b !important;
                margin: 3px 5px 10px;
                text-decoration: none !important;
            }

            .heartContainer {
                position: absolute;
                top: 5px;
                right: 3px;
                cursor: pointer;
                color:#fff;
                font-size: 20px;
            }

            .heart {
               position: relative;
            }

            .favorited {
                color: blue;
            }

            /* Carousel buttons */
            .carousel-btn {
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
                .carousel-btn {
                    display: none;
                }

                .carousel-item {
                    min-width: 210px;
                }

                .carousel {
                    scroll-snap-type: x mandatory;
                    overflow-x: scroll;
                }

                .carousel-wrapper {
                    margin: 0 15px;
                }

                /* Ürün adlarının altına buton eklenecek */
                .carousel-item p {
                    margin-bottom: 10px;
                }

                /* Yeni buton */
                .carousel-item .extra-btn {
                    display: block;
                    margin-top: 10px;
                    padding: 8px 15px;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    text-align: center;
                }

                /* Mobilde daha küçük resimler */
                .carousel-item img {
                    width: 80%;
                    height: auto;
                    margin: 0 auto;
                }
            }
        `;

        const style = document.createElement("style");
        style.innerHTML = css;
        document.head.appendChild(style);
    };

    const setHeartEvent = () => {
        document.querySelectorAll(".heart").forEach(heart => {
            heart.addEventListener("click", (e) => {
                e.stopPropagation();
                const productId = e.target.dataset.id;
                toggleFavorite(productId, e.target);
            });
        });
    }

    const setScrollEvent = () => {
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



    const setNavigationButtonEvent = () => {
        document.querySelector(".prev-btn").addEventListener("click", () => scrollCarousel(-1));
        document.querySelector(".next-btn").addEventListener("click", () => scrollCarousel(1));

        window.addEventListener("resize", updateNavButtons);
    }


    const scrollCarousel = (direction) => {
        const carousel = document.querySelector(".carousel");
        const itemWidth = carousel.querySelector(".carousel-item").offsetWidth + 15;
        carousel.scrollBy({ left: direction * itemWidth, behavior: "smooth" });
    };


    const updateNavButtons = () => {
        const carousel = document.querySelector(".carousel");
        const prevBtn = document.querySelector(".prev-btn");
        const nextBtn = document.querySelector(".next-btn");

        if (carousel.scrollWidth > carousel.clientWidth) {
            prevBtn.style.display = "block";
            nextBtn.style.display = "block";
        } else {
            prevBtn.style.display = "none";
            nextBtn.style.display = "none";
        }
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
        return favorites.includes(id);
    };

    init();
})();