export const MediaService = {
  processProductImages: (files, hostUrl) => {
    let thumbnail = "";
    let gallery = [];

    if (files.thumbnail && files.thumbnail[0]) {
      thumbnail = `${hostUrl}/uploads/products/${files.thumbnail[0].filename}`;
    }
    if (files.gallery && files.gallery.length > 0) {
      gallery = files.gallery.map(
        (file) => `${hostUrl}/uploads/products/${file.filename}`,
      );
    }
    return { thumbnail, gallery };
  },
};
