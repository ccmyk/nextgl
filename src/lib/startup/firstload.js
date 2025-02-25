async function loadRestApi({url='',device=0,webp=0,id='',template='',logged=0,visible=0,webgl=1}){
  
  if(import.meta.env.DEV == true){

    console.log(url+'?device='+device+'&id='+id+'&webp='+webp+'&template='+template+'&logged='+logged+'&visible='+visible)
  }

  let formData = new FormData()
  let info = {
    device:device,
    webp:webp,
    id:id,
    template:template,
    logged:logged,
    webgl:webgl,
    visible:visible
  }

  formData.set("form", JSON.stringify(info))


  if(document.body.dataset.nonce){

    

    const response = await fetch(url,{
      method: "POST",
      body: formData,
      headers: {
        'X-WP-Nonce': document.body.dataset.nonce,
        // 'Content-Type': 'application/json',
      }
    })

    const data = await response.json()


    return data
  }
  else{
    url +='?device='+device
    url +='&id='+id
    url +='&webp='+webp
    url +='&template='+template
    url +='&logged='+logged
    url +='&visible='+visible
    url +='&webgl='+webgl
    const response = await fetch(url,{
      method: "GET",
     
    })
    const data = await response.json()
    return data
  }

}


export default { loadRestApi }