export function  dispatch(event,ele){
    ele.dispatchEvent(event)
  }
export function dispatchEvent(el,tag,arr){
  let event =  new CustomEvent(tag, {
         bubbles: true,
         cancelable: true,
         composed: true,
         detail: arr
       })
      dispatch(event,el)
}

export function deepCopy(data, hash = new WeakMap()) {
    if(typeof data !== 'object' || data === null){
          throw new TypeError('传入参数不是对象')
      }
    // 判断传入的待拷贝对象的引用是否存在于hash中
    if(hash.has(data)) {
          return hash.get(data)
      }
    let newData = {};
    const dataKeys = Object.keys(data);
    dataKeys.forEach(value => {
       const currentDataValue = data[value];
       if (typeof currentDataValue !== "object" || currentDataValue === null) {
            newData[value] = currentDataValue;
        } else if (Array.isArray(currentDataValue)) {
          newData[value] = [...currentDataValue];
        } else if (currentDataValue instanceof Set) {
           newData[value] = new Set([...currentDataValue]);
        } else if (currentDataValue instanceof Map) {
           newData[value] = new Map([...currentDataValue]);
        } else { 
           hash.set(data,data)
           newData[value] = deepCopy(currentDataValue, hash);
        } 
     }); 
    return newData;
}


