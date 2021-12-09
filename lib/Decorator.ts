export const zeroPadding = (val: number) =>{
  if (val < 0) { val = 0}
  if (val.toString().length == 2){
    return val.toString()
  } else {
    return '0' + val.toString()
  }
}