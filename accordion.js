const acc = document.getElementsByClassName("accord")

for (let i = 0; i < acc.length; i++){
    acc[i].addEventListener("click", function () {
       
        const list = this.nextElementSibling;
        if (list.style.display === "block") {
            list.style.display = "none"
        } else {
            list.style.display = "block"
        }
   })
}