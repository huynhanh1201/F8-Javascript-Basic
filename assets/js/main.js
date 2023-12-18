function toast({ title = "", message = "", type = "", duration = 3000 }) {
    const main = document.getElementById("toast");

    if (main) {
        const toast = document.createElement("div");
        toast.classList.add("toast", `toast--${type}`);
        const timeRemove = 3000 + 1000;
        const timeOutId = setTimeout(() => {
            main.removeChild(toast);
        }, timeRemove);

        toast.onclick = function (e) {
            if (e.target.closest(".toast__close")) {
                main.removeChild(toast);
                clearTimeout(timeOutId);
            }
        };

        const delay = (duration / 1000).toFixed(2);
        toast.style.animation = `slideInLeft 0.3s ease, fadeOut 1s linear ${delay}s forwards`;

        const icons = {
            success: "fa-regular fa-circle-check",
            error: "fa-solid fa-circle-exclamation",
        };

        const icon = icons[type];

        toast.innerHTML = `<div class="toast__icon">
            <i class="${icon}"></i>
        </div>

        <div class="toast__body">
            <h3 class="toast__title">${title}</h3>
            <p class="toast__msg">
                ${message}
            </p>
        </div>
        <div class="toast__close">
            <i class="fa-solid fa-xmark"></i>
        </div>`;
        main.appendChild(toast);
    }
}

const successBtn = document.querySelector(".btn--success");
const dangerBtn = document.querySelector(".btn--danger");

successBtn.onclick = function () {
    toast({
        title: "Success",
        message: "Logged in successfully.",
        type: "success",
        duration: 5000,
    });
};

dangerBtn.onclick = function () {
    toast({
        title: "Success",
        message: "Login unsuccessful.",
        type: "error",
        duration: 5000,
    });
};
