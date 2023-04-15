const getEl = el => document.getElementById(el)
const setStyle = (el, prop, val) => el.style[prop] = val
const setAttr = (el, attr, val) => el.setAttribute(attr, val)
const hasClass = (el, className) => el.classList.contains(className)
const addClass = (el, className) => {
  if(!hasClass(el, className))
    el.classList.add(className)
}
const removeClass = (el, className) => {
  if(hasClass(el, className))
    el.classList.remove(className)
}
const resetStyles = el => el.removeAttribute('style')
const removeChild = (el, child) => {
  if(child.parentNode === el) el.removeChild(child)
}
const removeAllChildren = el => {
  while (el.hasChildNodes()) el.removeChild(el.lastChild)
}

const getElPos = el => {
  const offset = el.getBoundingClientRect()
  return {
    left: offset.left,
    top: offset.top
  }
}

const setElPos = (el, x, y) => {
  setStyle(el, 'left', x + 'px')
  setStyle(el, 'top', y + 'px')
}

const getRand = (min, max) => Math.floor(Math.random() * max) + min

const getRandExcept = (min, max, exception) => {
  const rand = getRand(min, max)
  return rand === exception ? getRandExcept(min, max, exception) : rand
}

const getRandPosOffScreen = overrideQuadrant => {
  const lowX1 = 0 - (window.innerWidth * 0.2),
        highX1 = 0 - (window.innerWidth * 0.1),
        lowY1 = 0,
        highY1 = window.innerHeight,
        
        lowX2 = window.innerWidth * 1.1,
        highX2 = window.innerWidth * 1.2,
        lowY2 = 0,
        highY2 = window.innerHeight,
        
        lowX3 = 0,
        highX3 = window.innerWidth,
        lowY3 = 0 - (window.innerHeight * 0.2),
        highY3 = 0 - (window.innerHeight * 0.1),
        
        lowX4 = 0,
        highX4 = window.innerWidth,
        lowY4 = window.innerHeight * 1.1,
        highY4 = window.innerHeight * 1.2
  
  let rand = Math.floor((Math.random() * 4) + 1)
  
  if(overrideQuadrant){
    rand = overrideQuadrant
  }
  
  let x = 0,
      y = 0
  
  switch(rand){
    case 1:
      x = Math.floor(Math.random() * (highX1 - lowX1 + 1)) + lowX1
      y = Math.floor(Math.random() * (highY1 - lowY1)) + lowY1
      break
    case 2:
      x = Math.floor(Math.random() * (highX2 - lowX2 + 1)) + lowX2
      y = Math.floor(Math.random() * (highY2 - lowY2)) + lowY2
      break
    case 3:
      x = Math.floor(Math.random() * (highX3 - lowX3 + 1)) + lowX3
      y = Math.floor(Math.random() * (highY3 - lowY3)) + lowY3
      break
    case 4:
      x = Math.floor(Math.random() * (highX4 - lowX4 + 1)) + lowX4
      y = Math.floor(Math.random() * (highY4 - lowY4)) + lowY4
      break
  }
  
  return { x, y }
}

const resetAllTimeouts = () => {
  let id = window.setTimeout(() => {}, 0)
  while(id--) {
    window.clearTimeout(id)
  }
}

const resetAllIntervals = () => {
  let id = window.setInterval(() => {}, 0)
  while(id--) {
    window.clearInterval(id)
  }
}