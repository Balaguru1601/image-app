let previmgArr = [];

function previewMultiple() {
	let images = document.getElementById("imageFile");
	let number = images.files.length;
    let imgPreviewDiv = document.getElementById("img-preview-div");
    imgPreviewDiv.innerHTML = ""
    if (previmgArr.length == 0) images.setAttribute("required","");
    for (i = 0; i < previmgArr.length; i++) {
		imgPreviewDiv.innerHTML += `<div class="img-preview-div px-1" id="img-prev-div-orig${i}">
                    <img src="${previmgArr[i].url}" class="h-100 w-100 rounded" alt="">
                    <button class="btn p-0 delete-icon"><i class="fas fa-times-circle" id="delete-icon-orig${i}" onclick="deleteImageArray(${i})"></i></button>
                    </div>
                    <input type="hidden" name="prevImages[]" value="${previmgArr[i].filename}#${previmgArr[i].url}">`;
	}
	for (i = 0; i < number; i++) {
		let url = URL.createObjectURL(images.files[i]);
		imgPreviewDiv.innerHTML += `<div class="img-preview-div px-1" id="img-prev-div${i}">
                <img src="${url}" class="h-100 w-100 rounded" alt="">
                <button class="btn p-0 delete-icon"><i class="fas fa-times-circle" id="delete-icon${i}" onclick="deleteImage(event)"></i></button>
                </div>`;
	}
}

function clearArray() {
    previmgArr = [];
}

function deleteImage(event) {
	const index = event.target.id.slice(-1);
	document.getElementById(`img-prev-div${index}`).remove();
	const input = document.getElementById("imageFile");
	removeFileFromFileList(index);
	if (input.files.length) previewMultiple();
	else previewMultiple();
}

function deleteImageArray(index) {
	previmgArr.splice(index, 1);
    let imageArrdiv = document.getElementById("img-preview-div");
    let images = document.getElementById("imageFile");
    if (previmgArr.length == 0) images.setAttribute("required", "");
    imageArrdiv.innerHTML = "";
	for (i = 0; i < previmgArr.length; i++) {
		imageArrdiv.innerHTML += `<div class="img-preview-div px-1" id="img-prev-div-orig${i}">
                    <img src="${previmgArr[i].url}" class="h-100 w-100 rounded" alt="">
                    <button class="btn p-0 delete-icon"><i class="fas fa-times-circle" id="delete-icon-orig${i}" onclick="deleteImageArray(${i})"></i></button>
                    </div>
                    <input type="hidden" name="prevImages[]" value="${previmgArr[i].filename}#${previmgArr[i].url}">`;
    }
    var number = images.files.length;
    for (i = 0; i < number; i++) {
		let url = URL.createObjectURL(images.files[i]);
		imageArrdiv.innerHTML += `<div class="img-preview-div px-1" id="img-prev-div${i}">
                <img src="${url}" class="h-100 w-100 rounded" alt="">
                <button class="btn p-0 delete-icon"><i class="fas fa-times-circle" id="delete-icon${i}" onclick="deleteImage(event)"></i></button>
                </div>`;
	}
}

function removeFileFromFileList(index) {
	const dt = new DataTransfer();
	const input = document.getElementById("imageFile");
	const { files } = input;
	for (let i = 0; i < files.length; i++) {
		const file = files[i];
		if (index != i) dt.items.add(file); // here you exclude the file. thus removing it.
	}
	input.files = dt.files; // Assign the updates list
}

function setArray(arr) {
    previmgArr = JSON.parse(arr);
    console.log(previmgArr)
}
