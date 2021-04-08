export default (e) => {
    const image = {
        file : e.target.files[0],
        path : ''
    }

    if(!image.file.type.match("image.*")) { return; }
    const reader = new FileReader();

    reader.onload = function (e) {
        image.path = e.target.result;
    }

    reader.readAsDataURL(image.file);
    return image;
}
