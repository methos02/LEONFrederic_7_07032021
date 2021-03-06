function imagePreview (e)  {
    const image = {
        file : e.target.files[0],
        path : ''
    }

    return new Promise((resolve, reject) => {
        if(image.file === undefined) { resolve(null) }
        if(!image.file.type.match("image.*")) { reject('Fichier invalide.') }

        const reader = new FileReader();
        reader.onload = function (e) {
            image.path = e.target.result;
            resolve(image);
        }
        reader.readAsDataURL(image.file);
    });
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
