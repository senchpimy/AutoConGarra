const SIZE = { width: 0, heigth: 0 }
const BRAZO = {
  posiciones: [
    { nombre: "garra", pos: 0, id: 0, color: "black" },
    { nombre: "muneca", pos: 0, id: 1, color: "green" },
    { nombre: "codo", pos: 0, id: 2, color: "purple" },
    { nombre: "hombro", pos: 0, id: 3, color: "yellow" },
    { nombre: "rotacion", pos: 0, id: 4, color: "blue" },
  ]
}
let HombroObject = document.getElementById('hombro');
let CodoObject = document.getElementById('codo');
let munecaObject = document.getElementById('muñeca');
let GarraObject = document.getElementById('Garra');

const STATE = { armsWidth: 50, armsHeight: 200, baseWidth: 150, radioGrip: 50 }
canvas = document.getElementById('Canvas'),
  ctx = canvas.getContext('2d')
function updateSize() {
  SIZE.heigth = window.innerHeight
  SIZE.width = window.innerWidth
  canvas.height = SIZE.heigth
  canvas.width = window.innerWidth
  setBrazosToHome();
}
updateSize();
window.addEventListener("resize", drawCanvasState());

function drawCanvasState() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  dibujarBase()
  dibujarBrazo()
  //console.log(BRAZO.posiciones)
  sendBrazo().then(() => { }).catch(err => {
    console.error(err);
  });
}

/**
 * Dibuja la base de el brazo de el robot
 */
function dibujarBase() {
  ctx.beginPath();
  ctx.strokeStyle = 'red';
  ctx.lineWidth = STATE.baseWidth
  var largoBase = Math.trunc(SIZE.width / 6)
  var final = SIZE.heigth - Math.trunc(STATE.baseWidth / 2)
  ctx.moveTo(largoBase, final)
  ctx.lineTo(largoBase * 5, final);
  //ctx.lineJoin = "bevel"
  ctx.stroke();
}

/**
 * Dubuja los brazos en su conjunto
 */
function dibujarBrazo() {
  var prev = [Math.trunc(SIZE.width / 6), SIZE.heigth - 30];
  let len = BRAZO.posiciones.length
  prev = drawArm(prev[0] * 3, prev[1], 360 - BRAZO.posiciones[len - 2].pos, BRAZO.posiciones[len - 2].color)
  let sum = BRAZO.posiciones[len - 2].pos
  for (let i = len - 3; i > 0; i--) {
    var e = BRAZO.posiciones[i]
    sum += e.pos
    prev = drawArm(prev[0], prev[1], 360 - (sum - (90 * (3 - i))), e.color)
  }
  drawGripp(prev[0], prev[1], BRAZO.posiciones[0].pos, sum)
}


/**
 * Rotate a point around a custom point by a given angle.
 * @param {number} x - The x-coordinate of the point to rotate.
 * @param {number} y - The y-coordinate of the point to rotate.
 * @param {number} cx - The x-coordinate of the custom point.
 * @param {number} cy - The y-coordinate of the custom point.
 * @param {number} angleDegrees - The angle of rotation in degrees.
 * @returns {number[]} The new coordinates of the rotated point as [newX, newY].
 */
function rotatePointCustom(x, y, cx, cy, angleDegrees) {
  var xTranslated = x - cx;
  var yTranslated = y - cy;

  var angleRadians = angleDegrees * (Math.PI / 180);

  var newXTranslated = xTranslated * Math.cos(angleRadians) - yTranslated * Math.sin(angleRadians);
  var newYTranslated = yTranslated * Math.cos(angleRadians) + xTranslated * Math.sin(angleRadians);

  var newX = newXTranslated + cx;
  var newY = newYTranslated + cy;

  return [newX, newY];
}

/**
 * Dubuja un Brazo
 * @param {number} x0 - The x-coordinate of the point to rotate.
 * @param {number} y0 - The y-coordinate of the point to rotate.
 * @param {number} gr - El angulo que tan abierto esta
 * @param {string} color - El color de el brazo
 * @returns {number[]} Las coordenadas de el punto final
 */
function drawArm(x0, y0, gr, color) {
  ctx.beginPath();
  ctx.moveTo(x0, y0)
  ctx.strokeStyle = color;
  ctx.lineWidth = STATE.armsWidth
  let r = rotatePointCustom(x0 + STATE.armsHeight, y0, x0, y0, gr)
  ctx.lineTo(r[0], r[1]);
  ctx.stroke();
  return r
}


/**
 * Dibuja un semicirculo que representa la garra
 * @param {number} x0 - The x-coordinate of the point to rotate.
 * @param {number} y0 - The y-coordinate of the point to rotate.
 * @param {number} gr - El angulo que tan abierto esta
 * @param {number} ang - El angulo el cual se encuentra la muneca
 */
function drawGripp(x0, y0, gr, ang) {
  var endAngle = (ang * Math.PI) / 181; //181 prevents division by 0
  var startAngle = ((ang + (180 - gr)) * Math.PI) / 180;//
  var counterClockwise = false;

  ctx.beginPath();
  ctx.arc(x0, y0, STATE.radioGrip, startAngle, endAngle, counterClockwise);
  ctx.lineWidth = 20;

  ctx.strokeStyle = 'black';
  ctx.stroke();
}

GarraObject.addEventListener('input', () => {
  let obj = BRAZO.posiciones.find(function(obj) {
    return obj.id === 0;
  })
  obj.pos = parseInt(GarraObject.value);
  drawCanvasState()
});

munecaObject.addEventListener('input', () => {
  let obj = BRAZO.posiciones.find(function(obj) {
    return obj.id === 1;
  })
  obj.pos = parseInt(munecaObject.value);
  drawCanvasState()
});

CodoObject.addEventListener('input', () => {
  let obj = BRAZO.posiciones.find(function(obj) {
    return obj.id === 2;
  })
  obj.pos = parseInt(CodoObject.value);
  drawCanvasState()
});

HombroObject.addEventListener('input', () => {
  let obj = BRAZO.posiciones.find(function(obj) {
    return obj.id === 3;
  })
  obj.pos = parseInt(HombroObject.value);
  drawCanvasState()
});

document.getElementById('home').addEventListener('click', () => {
  setBrazosToHome()
});

function setBrazosToHome() {
  BRAZO.posiciones[0].pos = 0 //garra
  BRAZO.posiciones[1].pos = 90 //muneca
  BRAZO.posiciones[2].pos = 90 //codo
  BRAZO.posiciones[3].pos = 0 //hombro
  GarraObject.value = 0
  munecaObject.value = 90
  CodoObject.value = 90
  HombroObject.value = 0
  drawCanvasState()
}


//------------Serial-------
//
const Serial = { port: null, conectado: false, writer: null, reader: null }

if ("serial" in navigator) {
  const filters = [
    { usbVendorId: 0x1A86, usbProductId: 0x7523 }
    //  { usbVendorId: 0x2341, usbProductId: 0x0001 }
  ];
  document.getElementById("serial").addEventListener('click', async () => {
    // Prompt user to select any serial port.
    Serial.port = await navigator.serial.requestPort({ filters });
    await Serial.port.open({ baudRate: 115200 });
    if (Serial.port) {
      console.log("Conectado exitosamente")
      if (!Serial.conectado) {
        const textEncoder = new TextEncoderStream();
        textEncoder.readable.pipeTo(Serial.port.writable);

        const writer = textEncoder.writable.getWriter();
        const textDecoder = new TextDecoderStream();
        const readableStreamClosed = Serial.port.readable.pipeTo(textDecoder.writable);
        const reader = textDecoder.readable.getReader();
        Serial.reader = reader
        Serial.writer = writer
        Serial.conectado = true
      }
    }
  });
} else {
  document.getElementById("esp32-console").innerHTML = "Este navegador no tiene interfaz Serial"
}

document.getElementById("mensaje").addEventListener('click', async () => {
  if (Serial.port != null) {


    await Serial.writer.write(JSON.stringify({ conectado: true }) + "\n");

    // Listen to data coming from the serial device.
    while (true) {
      const { value, done } = await Serial.reader.read();
      //if (done) {
      //  // Allow the serial port to be closed later.
      //}
      document.getElementById("esp32-console").innerHTML = value
      break;
    }

  } else {
    console.log("Serial es nulo")
  }
});

/*
 * Envia El estado de el brazo a el esp32
  */
async function sendBrazo() {
  const startTime = performance.now();
  await Serial.writer.write(JSON.stringify(BRAZO) + "\n")
  while (true) {
    const { value, done } = await Serial.reader.read();
    const endTime = performance.now();
    const elapsedTime = endTime - startTime;
    console.log(elapsedTime)
    if (value != "0") {
      document.getElementById("esp32-console").innerHTML = "Error Mandando La poscicion: " + value
      console.log(value)
    }
    break;
  }
}
