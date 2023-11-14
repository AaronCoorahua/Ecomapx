export default function compararHoras(a,b){
    const horaA= a.start_time;
    const horaB= b.start_time;
    if (horaA < horaB) {
      return -1;
    }
    if (horaA > horaB) {
      return 1;
    }
    return 0;
  };
  
  export const hexToRgba = (hex, alpha) => {
    hex = hex.replace(/^#/, '');
  
    // Convierte el valor hexadecimal a valores RGB
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
  
    // Retorna el valor RGBA
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  