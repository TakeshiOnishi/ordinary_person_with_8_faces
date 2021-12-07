export const zeroPadding = (val: number) =>{
  if (val.toString().length == 2){
    return val.toString()
  } else {
    return '0' + val.toString()
  }
}