(function () {
	"use strict";

	// Fetch all the forms we want to apply custom Bootstrap validation styles to
	var forms = document.querySelectorAll(".needs-validation");

	// Loop over them and prevent submission
	Array.prototype.slice.call(forms).forEach(function (form) {
		form.addEventListener(
			"submit",
			function (event) {
				if (!form.checkValidity()) {
					event.preventDefault();
					event.stopPropagation();
				}

				form.classList.add("was-validated");
			},
			false
		);
	});
})();

function renderEditForm(id) {
    if (id) {
        document.getElementById(`EditForm${id}`).style.display = "block";
        document.getElementById(`originalComment${id}`).style.setProperty("display", "none", "important");
        document.getElementById(`commentAuthor${id}`).style.display = "none";
        document.getElementById(`editBtn${id}`).style.display = "none";
        document.getElementById(`deleteForm${id}`).style.setProperty("display", "none", "important");
    }
}

