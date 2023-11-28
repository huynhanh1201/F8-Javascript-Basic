handleClickActive = (selectorDom, callBack) => {
    selectorDom.addEventListener("click", callBack);
};

// ===========================================
const $ = document.querySelector.bind(document);

const $$ = document.querySelectorAll.bind(document);

let tabItems = $$(".tab-item");
let tabPanes = $$(".tab-pane");

tabItems.forEach((tabItem, index) => {
    handleClickActive(tabItem, (e) => {
        const pane = tabPanes[index];
        const tabsLine = $(".tabs .line");

        tabsLine.style.left = tabItem.offsetLeft + "px";
        tabsLine.style.width = tabItem.offsetWidth + "px";

        $(".tab-item.active").classList.remove("active");

        $(".tab-pane.active").classList.remove("active");

        tabItem.classList.add("active");
        pane.classList.add("active");
    });
});
