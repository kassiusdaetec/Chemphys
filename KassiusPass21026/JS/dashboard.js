const hoje = new Date().getDate();
document.querySelectorAll(".calendar .day:not(.past)").forEach(function (celula) {
    if (Number(celula.textContent) === hoje) {
        celula.classList.add("hoje");
        celula.setAttribute("aria-current", "date");
    }
});