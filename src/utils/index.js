export const capitalizeFirstLetter = (str) => {
  if (typeof str === 'string') {
    return str.charAt(0).toUpperCase() + str.slice(1);
  } else {
    return str.format('MMMM YYYY');
  }
};

const taskColors = {
    "1": "blue",
    "2": "green",
    "3": "teal",
    "4": "purple",
    "5": "pink",
};

const tagsColors = {
    "1": "blue",
    "2": "green",
    "3": "teal",
    "4": "purple",
    "5": "pink",
};

export const getColorForTaskType = (typeId) => {
    return taskColors[typeId] || "gray";
};

export const getColorForTags = (typeId) => {
    return tagsColors[typeId] || "gray";
};

export const downloadFile = (cuerpo, nombreArchivoConExtension) => {

  const extension = nombreArchivoConExtension.split('.').pop();

  const byteCharacters = atob(cuerpo);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  const blob = new Blob([byteArray]);

  const enlaceDescarga = document.createElement('a');
  enlaceDescarga.href = URL.createObjectURL(blob);

  const nombreArchivoSinExtension = nombreArchivoConExtension.replace(`.${extension}`, '');
  const nombreDescarga = `${nombreArchivoSinExtension}.${extension}`;

  enlaceDescarga.download = nombreDescarga || 'archivo';

  document.body.appendChild(enlaceDescarga);

  enlaceDescarga.click();

  document.body.removeChild(enlaceDescarga);
};