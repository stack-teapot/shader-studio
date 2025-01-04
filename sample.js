import { initBuffers } from "./init-buffers.js"
import { drawScene } from "./draw-scene.js"
import { cube } from "./cube.js"
import { LoadOBJ } from "./load_obj.js"

let deltaTime = 0

let button = document.getElementById("button")
let fragment_shader_text = document.getElementById("fragment_shader_text").value
let vertex_shader_text = document.getElementById("vertex_shader_text").value

button.addEventListener("click", function () {
  fragment_shader_text = document.getElementById("fragment_shader_text").value
  vertex_shader_text = document.getElementById("vertex_shader_text").value
  main()
})

main()

async function main() {

  let obj_name = window.location.pathname.slice(1)
  if (obj_name != "teapot" && obj_name != "salmon" && obj_name != "pawn") {
    obj_name = "teapot"
  }
  const obj = await LoadOBJ(`${obj_name}.obj`)
  //console.log(obj)
  const canvas = document.querySelector("#glcanvas")
  const gl = canvas.getContext("webgl")

  if (gl === null) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    )
    return
  }

  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  const vsSource = vertex_shader_text

//   const vsSource = `
//   attribute vec4 aVertexPosition;
//   attribute vec3 aVertexNormal;
//   attribute vec2 aTextureCoord;

//   uniform mat4 uNormalMatrix;
//   uniform mat4 uModelViewMatrix;
//   uniform mat4 uProjectionMatrix;

//   varying highp vec2 vTextureCoord;
//   varying highp vec3 vLighting;

//   void main(void) {
//     gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
//     vTextureCoord = aTextureCoord;

//     // Apply lighting effect

//     highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
//     highp vec3 directionalLightColor = vec3(1, 1, 1);
//     highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

//     highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

//     highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
//     vLighting = ambientLight + (directionalLightColor * directional);
//   }
// `

    const fsSource = fragment_shader_text

//   const fsSource = `
//   varying highp vec2 vTextureCoord;
//   varying highp vec3 vLighting;

//   uniform sampler2D uSampler;

//   void main(void) {
//     highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
//     gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
//   }
// `

  // Initialize shader program this is where all the lighting for the vertices is set.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource)

  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
      vertexNormal: gl.getAttribLocation(shaderProgram, "aVertexNormal"),
      textureCoord: gl.getAttribLocation(shaderProgram, "aTextureCoord"),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(
        shaderProgram,
        "uProjectionMatrix"
      ),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
      normalMatrix: gl.getUniformLocation(shaderProgram, "uNormalMatrix"),
      uSampler: gl.getUniformLocation(shaderProgram, "uSampler"),
    },
  }

  const buffers = initBuffers(gl, obj)

  const texture = loadTexture(gl, "cubetexture.png")
  // Flip image pixels into the bottom-to-top order that WebGL expects.
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)

  // control object
  let x_value = 0
  let y_value = 0
  let zoom = -10

  let mouse_start = false
  let mouse_start_x = 0
  let mouse_start_y = 0

  addEventListener("mousedown", (event) => {
    mouse_start = true
    mouse_start_x = event.clientX 
    mouse_start_y = event.clientY
  })

  addEventListener("mouseup", (event) => {
    mouse_start = false
  })

  addEventListener("mousemove", (event) => {
    if (mouse_start) {
      x_value = (event.clientY - mouse_start_y) * 0.01
      y_value = (event.clientX - mouse_start_x) * 0.01
    }
  })

  addEventListener("wheel", (event) => {
    zoom += event.deltaY * 0.01
  })

  let then = 0

  // Draw the scene repeatedly
  function render(now) {
    now *= 0.001 // convert to seconds
    deltaTime = now - then
    then = now

    drawScene(gl, programInfo, buffers, texture, obj.indices.length, now, x_value, y_value, zoom)

    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}

function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource)
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource)

  const shaderProgram = gl.createProgram()
  gl.attachShader(shaderProgram, vertexShader)
  gl.attachShader(shaderProgram, fragmentShader)
  gl.linkProgram(shaderProgram)

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert(
      `Unable to initialize the shader program: ${gl.getProgramInfoLog(
        shaderProgram
      )}`
    )
    return null
  }

  return shaderProgram
}

function loadShader(gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`
    )
    gl.deleteShader(shader)
    return null
  }

  return shader
}

function loadTexture(gl, url) {
  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  const level = 0
  const internalFormat = gl.RGBA
  const width = 1
  const height = 1
  const border = 0
  const srcFormat = gl.RGBA
  const srcType = gl.UNSIGNED_BYTE
  const pixel = new Uint8Array([0, 0, 255, 255])
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    width,
    height,
    border,
    srcFormat,
    srcType,
    pixel
  )

  const image = new Image()
  image.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(
      gl.TEXTURE_2D,
      level,
      internalFormat,
      srcFormat,
      srcType,
      image
    )

    // WebGL1 has different requirements for power of 2 images
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      gl.generateMipmap(gl.TEXTURE_2D)
    } else {
      // Turn off mips and set wrapping to clamp to edge
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    }
  }
  image.src = url

  return texture
}

function isPowerOf2(value) {
  return (value & (value - 1)) === 0
}
