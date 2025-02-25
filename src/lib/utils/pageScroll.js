

//* Funciones de control
export  function stopScroll(){
  // this.isVisible = 0
}
export  function startScroll(){
  // this.isVisible = 1
}

//* Función para Smooth
// REVISAR HACER LOS FOR DE LAS ANIMACIONES ASÍNCRONAS POR EL REFLOW ( Mejora rendimiento )



export function animIosScroll(){
  if(this.isVisible == 0){
    return false
  }
  if(this.iosupdaters.length){
    for(let c of this.iosupdaters){
      
      this.ios[c].class.update(window.scrollY)
      
    }
  }
}
