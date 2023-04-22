const STATE = {
  audio: null,
  songEnded: false,
  usingDefault: false,
  minMag: 0,
  canvas: {
    height: 600,
    width: 600
  }
}

let COLORS = [
  'rgb(239,83,80)', // light red - 0
  'rgb(211,47,47)', // med red - 1
  'rgb(183,28,28)', // dark red - 2
  'rgb(255,112,67)', // light orange - 3
  'rgb(255,87,34)', // med orange - 4
  'rgb(216,67,21)', // dark orange - 5
  'rgb(255,213,79)', // light yellow - 6
  'rgb(255,193,7)', // med yellow - 7
  'rgb(255,160,0)', // dark yellow - 8
  'rgb(102,187,106)', // light green - 9
  'rgb(67,160,71)', // med green - 10
  'rgb(27,94,32)', // dark green - 11
  'rgb(41,182,246)', // light blue - 12
  'rgb(25,118,210)', // med blue - 13
  'rgb(40,53,147)', // dark blue - 14
  'rgb(126,87,194)', // light indigo - 15
  'rgb(94,53,177)', // med indigo - 16
  'rgb(69,39,160)', // dark indigo - 17 
  'rgb(171,71,188)', // light violet - 18
  'rgb(142,36,170)', // med violet - 19
  'rgb(74,20,140)', // dark violet - 20
]

const PARTICLE_CONFIG = {
  particles: {
    number: {
      value: 100
    },
    size: {
      value: 3,
      random: true
    },
    opacity: {
      value: 0.8,
      random: true
    },
    move: {
      direction: 'right',
      speed: 20
    },
    line_linked: {
      enable: false
    }
  },
  interactivity: {
    events: {
      onhover: {
        enable: false
      }
    }
  }
}

const DROP_ZONE_WRAPPER = getEl('drop-zone-wrapper'),
      DROP_ZONE = getEl('drop-zone'),
      ALTERNATE_OPTION = getEl('alternate-option'),
      AUDIO_CANVAS = getEl('audio-canvas'),
      CENTER_LOGO = getEl('center-logo'),
      PARTICLES_SLOW = getEl('particles-slow'),
      PARTICLES_FAST = getEl('particles-fast'),
      RESET = getEl('reset')

const dragStart = () => {
  addClass(DROP_ZONE, 'hovering')
}

const dragEnd = () => {
  removeClass(DROP_ZONE, 'hovering')
}

const initializeCanvas = () => {
  const ctx = AUDIO_CANVAS.getContext('2d')
  ctx.canvas.width = STATE.canvas.width
  ctx.canvas.height = STATE.canvas.height
}

const isValidMp3 = data => {
  console.log(data.items[0])
  return data.items 
    && data.items.length === 1 
    && data.items[0].kind === 'file'
    && (data.items[0].type === 'audio/mp3' || data.items[0].type === 'audio/mpeg')
}

const getMp3FromData = e => {
  const data = e.dataTransfer
  if(isValidMp3(data)){
    const mp3 = data.files[0]
    return mp3
  }
  else{
    console.error('Error: Not a valid Mp3 file.')
    return null
  }
}

const createAudio = mp3 => {
  const url = URL.createObjectURL(mp3),
        audio = new Audio()
  audio.src = url
  return audio
}

const isBassABumpin = dataArray => {
  if(dataArray[0] === 255 && dataArray[1] === 255){
    if(dataArray[2] === 255){
      return 2
    }
    return 1
  }
  return 0
}

const rumbleCenterLogo = dataArray => {
  const isBumpin = isBassABumpin(dataArray)
  if(isBumpin > 0){
    const rumble = isBumpin === 2 ? 'rumble-level-2' : 'rumble-level-1'
    addClass(CENTER_LOGO, rumble)
    setTimeout(() => {
      removeClass(CENTER_LOGO, rumble)
    }, 300)
  }
}

const rumbleParticles = dataArray => {
  if(isBassABumpin(dataArray)){
    removeClass(PARTICLES_FAST, 'hidden')
    setTimeout(() => {
      addClass(PARTICLES_FAST, 'hidden')
    }, 300)
  }
}

const hasSongEnded = audio => audio.currentTime >= audio.duration

const resetPlayer = () => {
  if(STATE.audio) STATE.audio.currentTime = STATE.audio.duration
  STATE.songEnded = true
  removeClass(RESET, 'showing')
  setTimeout(() => {
    cancelAnimationFrame(drawVisual)
    addClass(CENTER_LOGO, 'transition-out')
    
    addClass(DROP_ZONE_WRAPPER, 'transition-in')
    removeClass(DROP_ZONE_WRAPPER, 'hidden')
    
    addClass(DROP_ZONE, 'transition-in')
    removeClass(DROP_ZONE, 'hidden')
    
    addClass(ALTERNATE_OPTION, 'transition-in')
    removeClass(ALTERNATE_OPTION, 'hidden')
    
    setTimeout(() => {
      removeClass(DROP_ZONE_WRAPPER, 'transition-in')
    }, 100)
    
    setTimeout(() => {
      removeClass(CENTER_LOGO, 'transition-out')
      addClass(CENTER_LOGO, 'hidden')
      
      removeClass(DROP_ZONE, 'transition-in')   
      addClass(DROP_ZONE, 'showing')
      
      removeClass(ALTERNATE_OPTION, 'transition-in')
      addClass(ALTERNATE_OPTION, 'showing')
      
      addClass(PARTICLES_FAST, 'initial') 
      addClass(PARTICLES_FAST, 'hidden')
      
      STATE.songEnded = false
      
      setTimeout(() => {
        removeClass(DROP_ZONE, 'showing')
        removeClass(ALTERNATE_OPTION, 'showing')
      }, 1000)
    }, 1000)
  }, 1000)
}

const drawLine = (ctx, color, c1, c2) => {
  ctx.beginPath()
  ctx.moveTo(c1.x, c1.y)
  ctx.lineTo(c2.x, c2.y)
  ctx.strokeStyle = color
  ctx.stroke()
}

let drawVisual = null
const processAudio = mp3 => {
  let audio = null
  if(mp3 === 'default'){
    audio = new Audio('IMFITP jingle.mp3')
    audio.crossOrigin = 'anonymous'
    audio.volume = 1
  }
  else{
    audio = createAudio(mp3)
  }
  STATE.audio = audio
  audio.addEventListener('loadedmetadata', () => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)(),
          audioSrc = audioCtx.createMediaElementSource(audio),
          analyser = audioCtx.createAnalyser(),
          canvasCtx = AUDIO_CANVAS.getContext('2d')
    
    audioSrc.connect(analyser)
    audioSrc.connect(audioCtx.destination)
    analyser.fftSize = 256
    audio.play()
    
    const bufferLength = analyser.frequencyBinCount,
          dataArray = new Uint8Array(bufferLength)
    canvasCtx.clearRect(0, 0, STATE.canvas.width, STATE.canvas.height)
    
    const draw = () => {
      drawVisual = requestAnimationFrame(draw)
      analyser.getByteFrequencyData(dataArray)
      canvasCtx.clearRect(0, 0, STATE.canvas.width, STATE.canvas.height)
      canvasCtx.fillStyle = 'rgba(0, 0, 0, 0)'
      canvasCtx.fillRect(0, 0, STATE.canvas.width, STATE.canvas.height)
      
      rumbleCenterLogo(dataArray)
      rumbleParticles(dataArray)
      
      let radius = 150,
          cX = STATE.canvas.width / 2, cY = STATE.canvas.height / 2,
          inc = Math.round(bufferLength / 10),
          colorIndex = 0
          
      for(let i = 0; i < bufferLength; i++){
        let mag = (dataArray[i] / 255)
        
        if(mag < 0.03){
           mag = getRand(STATE.minMag, 5) * 0.02
        }
        
        let r = radius + 7 + 5,
            angle = degToRad((i / bufferLength) * 360) - 90,
            c1 = getCoords(cX, cY, r, angle),
            c2 = getCoords(cX, cY, r + (mag * 30), angle),
            c3 = getCoords(cX, cY, r + (mag * 35), angle),
            c4 = getCoords(cX, cY, r + (mag * 40), angle),
            c5 = getCoords(cX, cY, r + (mag * 45), angle)
        
        canvasCtx.lineWidth = 10
        
        canvasCtx.lineCap = 'round'
        
        drawLine(canvasCtx, COLORS[13], c3, c5)
        drawLine(canvasCtx, COLORS[16], c2, c4)
        drawLine(canvasCtx, COLORS[19], c1, c3)
        drawLine(canvasCtx, 'white', c1, c2)
        
        if(hasSongEnded(audio) && !STATE.songEnded){
          resetPlayer()
        }
      }
    }
    draw()
  })
}

const degToRad = deg => (deg * Math.PI) / 180

const getCoords = (cX, cY, r, a) => {
  return {
    x: cX + r * Math.cos(a),
    y: cY + r * Math.sin(a)
  }
}

const hideDropZone = () => {
  addClass(DROP_ZONE_WRAPPER, 'transition-out')
  setTimeout(() => {
    addClass(DROP_ZONE, 'hidden')
  }, 1000)
  setTimeout(() => {
    removeClass(DROP_ZONE_WRAPPER, 'transition-out')
    addClass(DROP_ZONE_WRAPPER, 'hidden')
  }, 5000)
}

const showCenterLogo = () => {
  setTimeout(() => {
    removeClass(CENTER_LOGO, 'hidden')
    addClass(CENTER_LOGO, 'showing')
    setTimeout(() => {
      removeClass(CENTER_LOGO, 'showing')
    }, 1000)
  }, 1000)
}

const showParticles = () => {
  setTimeout(() => {
    removeClass(PARTICLES_FAST, 'initial')
  }, 5000)
}

const initializeParticles = () => {
  const config = Object.assign({}, PARTICLE_CONFIG)
  particlesJS('particles-slow', config)
  config.particles.size.value = 5
  config.particles.move.speed = 50
  config.particles.number.value = 200
  particlesJS('particles-fast', config)
}

const startPlayer = mp3 => {
  addClass(ALTERNATE_OPTION, 'transition-out')
  hideDropZone()
  showCenterLogo()
  showParticles()
  setTimeout(() => {
    removeClass(ALTERNATE_OPTION, 'transition-out')
    addClass(ALTERNATE_OPTION, 'hidden')
  }, 1000)
  setTimeout(() => {
    processAudio(mp3)
  }, 2000)
  setTimeout(() => {
    addClass(RESET, 'showing')
  }, 5000)
}

DROP_ZONE.ondragenter = () => {
  dragStart()
}

DROP_ZONE.ondragover = e => {
  e.stopPropagation()
  e.preventDefault()
  return false
}

DROP_ZONE.ondragleave = () => {
  dragEnd()
}

DROP_ZONE.ondragend = () => {
  dragEnd()
}

DROP_ZONE.ondrop = e => {
  e.stopPropagation()
  e.preventDefault()
  dragEnd()
  const mp3 = getMp3FromData(e)
  if(mp3){
    startPlayer(mp3)
  }
}

ALTERNATE_OPTION.onclick = () => {
  startPlayer('default')
}

RESET.onclick = () => {
  resetPlayer()
}

window.onresize = _.throttle(() => {
  initializeCanvas()
}, 100)

window.onload = () => {
  initializeCanvas()
  initializeParticles()
  
  setInterval(() => {
    STATE.minMag = getRand(3, 5)
  }, 1000)
}

window.ondragover = e => {
  e = e || event
  e.stopPropagation()
  e.preventDefault()
}

window.ondrop = e => {
  e = e || event
  e.stopPropagation()
  e.preventDefault()
}

// canvasCtx.beginPath()
// canvasCtx.arc(cX, cY, r, 0, 2 * Math.PI, false)
// canvasCtx.fillStyle = 'rgba(255, 255, 255, 0)'
// canvasCtx.fill()
// canvasCtx.lineWidth = r - radius
// canvasCtx.strokeStyle = `rgba(255, 255, 255, ${alpha})`
// canvasCtx.stroke()