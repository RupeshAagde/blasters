import * as pdfMake from 'pdfmake/build/pdfmake.js';

export class PdfGeneratorService {
    constructor(fonts) {
        // pdfMake.fonts = fonts || {
        //     Montserrat: {
        //         normal: 'Montserrat-Regular.ttf',
        //         bold: 'Montserrat-Bold.ttf'
        //     }
        // };
        if (!pdfMake.vfs || !pdfMake.fonts) {
            return fetch(window.location.origin + '/montserrat')
                .then(response => {
                    return response.json().then(data => {
                        pdfMake.vfs = data;
                        pdfMake.fonts = {
                            Montserrat: {
                                normal: 'Montserrat-Regular.ttf',
                                bold: 'Montserrat-Bold.ttf'
                            }
                        };
                        return this;
                    });
                })
                .catch(err => {
                    console.log(err);
                });
        }
        return Promise.resolve(this);
    }

    getPdfBuffer(pdfTemplate) {
        try {
            return new Promise((resolve, reject) => {
                pdfMake.createPdf(pdfTemplate).getBuffer(function(buffer) {
                    resolve(buffer);
                });
            });
        } catch (err) {
            console.error(err);
            return [];
        }
    }
    getDataUrl(pdfTemplate) {
        try {
            return new Promise((resolve, reject) => {
                pdfMake.createPdf(pdfTemplate).getDataUrl(function(dataURL) {
                    resolve(dataURL);
                });
            });
        } catch (err) {
            console.error(err);
            return '';
        }
    }
    getPdfBase64(pdfTemplate) {
        try {
            return new Promise((resolve, reject) => {
                pdfMake.createPdf(pdfTemplate).getBase64(function(base64) {
                    resolve(base64);
                });
            });
        } catch (err) {
            console.error(err);
            return [];
        }
    }

    open(pdfTemplate, filename) {
        try {
            pdfMake.createPdf(pdfTemplate).open();
        } catch (err) {
            console.error(err);
            return [];
        }
    }
    download(pdfTemplate, filename) {
        try {
            return new Promise((resolve, reject) => {
                pdfMake
                    .createPdf(pdfTemplate)
                    .download(filename, function(base64) {
                        resolve({
                            success: true
                        });
                    });
            });
        } catch (err) {
            console.error(err);
            return [];
        }
    }
}
