import GrindorService from '../grindor.service';
import ApiService from '../api.service';

function getBase64DataURL(url) {
    return new Promise(function(resolve, reject) {
        try {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                var canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                var ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                var dataURL = canvas.toDataURL('image/png');
                resolve(dataURL);
            };
            ApiService.get(`${GrindorService.getProxyURL()}?url=${url}`, {}, { responseType: 'arraybuffer' })
                .then(res => {
                    let image = btoa(
                        new Uint8Array(res.data)
                        .reduce((data, byte) => data + String.fromCharCode(byte), '')
                    );
                    img.src = `data:image/png;base64,${image}`;
                });
        } catch (e) {
            resolve(false);
        }
    });
}

function getFullAddress(address) {
    const full_address = [
        address.address1,
        address.address2,
        address.area,
        address.city,
        address.state,
        address.country,
        address.pincode
    ];
    return full_address.filter(sa => sa).join(', ');
}

export { getBase64DataURL, getFullAddress };
