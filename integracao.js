document.addEventListener("DOMContentLoaded", function() {
    const checkboxes = document.querySelectorAll(".Niveis input[type='checkbox']");
    const niveisDivs = document.querySelectorAll(".Niveis > div");

    checkboxes.forEach((checkbox, index) => {
        checkbox.addEventListener("change", () => {
            desselecionarCheckboxes();
            desselecionarNiveisDivs();

            checkbox.checked = true; // Manter o checkbox marcado

            niveisDivs[index].classList.add("selecionado");
        });
    });

    function desselecionarNiveisDivs() {
        niveisDivs.forEach(div => {
            div.classList.remove("selecionado");
        });
    }

    function desselecionarCheckboxes() {
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
    }
});
