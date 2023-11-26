document.body.onclick = function (e) {   //when the document body is clicked
    // let el = document.getElementById("dropdownclose")
    // if (el) el.click()
    if (window.event) {
        e = event.srcElement;           //assign the element clicked to e (IE 6-8)
    }
    else {
        e = e.target;                   //assign the element clicked to e
    }

    // reload()

    if (e.className) {
        if (e.classList.contains('modal') || e.classList.contains('modalCloseJS')) {
            document.getElementById("modalJS").setAttribute('value', 'hide')
            let el = document.getElementById("modalClicked")
            let el2 = document.getElementById("modalJS")
            if (el && el2) el.click(); el2.click()
        }
    }
}


var modal = ''
function reload() {
    localStorage.removeItem('language')
    document.getElementById("modalJS").onclick = function () {
        modal = $('#modalJS').attr('modal')
        value = $('#modalJS').attr('value')

        if (value == 'hide') {
        }

        let el = document.getElementById("modalClicked")
        if (el) el.click()
        $('#' + modal).modal(value)
        setTimeout(() => {
            $(`#${modal} *[data-dismiss="modal"]`).addClass('modalCloseJS')
            $(`#${modal} *[data-dismiss="modal"] > *`).addClass('modalCloseJS')
            $('#' + modal).modal(value)
        }, 200)
    }
}
reload()