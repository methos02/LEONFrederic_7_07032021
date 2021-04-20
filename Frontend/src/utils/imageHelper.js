function imagePreview (e)  {
    const image = {
        file : e.target.files[0],
        path : ''
    }
    if(!image.file.type.match("image.*")) { return; }
    const reader = new FileReader();

    reader.onload = function (e) {
        image.path = e.target.result;
        document.dispatchEvent(new Event('image-load'));
    }

    reader.readAsDataURL(image.file);
    return image;
}

async function addImgToFormData (cropper, file, formData, input_name) {
    if(file == null) { return formData }
    const promise = new Promise(function (resolve) {
        cropper.getCroppedCanvas().toBlob((blob) => {
            formData.append(input_name, blob, file.name);
            resolve(formData);
        });
    });

    return promise.then(formData => formData);
}

export { imagePreview, addImgToFormData }
