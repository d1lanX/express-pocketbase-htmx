const utiles = {
  publicDirectory: new URL('../../public/', import.meta.url).pathname,
  viewsDirectory: new URL('../views/', import.meta.url).pathname,
  relativeTime(date) {
    const currentTime = new Date(date).getTime();
    const seconds = Math.floor(currentTime / 1000);
    
    const now = Math.floor(Date.now() / 1000);
    const difference = now - seconds;
    let output = ``;
    
    if (difference < 60) {
      output = `hace ${difference} segundos`;
    } else if (difference < 3600) {
      output = `hace ${Math.floor(difference / 60)} minutos`;
    } else if (difference < 86400) {
      output = `hace ${Math.floor(difference / 3600)} horas`;
    } else if (difference < 2620800) {
      output = `hace ${Math.floor(difference / 86400)} días`;
    } else if (difference < 31449600) {
      output = `hace ${Math.floor(difference / 2620800)} meses`;
    } else {
      output = `hace ${Math.floor(difference / 31449600)} años`;
    }

    return output;
  }
};

export default utiles;
