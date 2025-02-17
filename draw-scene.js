import * as mat4 from "./mat4.js"

function drawScene(gl, programInfo, buffers, texture, vertex_count, now, x_value, y_value, zoom) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clearDepth(1.0)
  gl.enable(gl.DEPTH_TEST)
  gl.depthFunc(gl.LEQUAL) // Near things obscure far things

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  const fieldOfView = (45 * Math.PI) / 180 // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight
  const zNear = 0.1
  const zFar = 100.0
  const projectionMatrix = mat4.create()

  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar)

  const modelViewMatrix = mat4.create()

  mat4.translate(
    projectionMatrix, // destination matrix
    projectionMatrix, // matrix to translate
    [0.0, 0.0, zoom] // amount to translate
  )

  mat4.translate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to translate
    [0.0, -1.0, 0.0] // amount to translate
  )
  
  mat4.rotate(
    modelViewMatrix,
    modelViewMatrix,
    (x_value * 50) * (3.14/180),
    [1, 0, 0]
  )

  mat4.rotate(
    modelViewMatrix,
    modelViewMatrix,
    (y_value * 50) * (3.14/180),
    [0, 1, 0]
  )
  
  

  const normalMatrix = mat4.create()
  mat4.invert(normalMatrix, modelViewMatrix)
  mat4.transpose(normalMatrix, normalMatrix)

  setPositionAttribute(gl, buffers, programInfo)

  setTextureAttribute(gl, buffers, programInfo)

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices)

  setNormalAttribute(gl, buffers, programInfo)

  gl.useProgram(programInfo.program)

  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix
  )
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix
  )
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.normalMatrix,
    false,
    normalMatrix
  )

  gl.activeTexture(gl.TEXTURE0)

  gl.bindTexture(gl.TEXTURE_2D, texture)

  gl.uniform1i(programInfo.uniformLocations.uSampler, 0)

  {
    const vertexCount = vertex_count
    const type = gl.UNSIGNED_SHORT
    const offset = 0
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset)
  }
}

function setPositionAttribute(gl, buffers, programInfo) {
  const numComponents = 3
  const type = gl.FLOAT // the data in the buffer is 32bit floats
  const normalize = false
  const stride = 0 // how many bytes to get from one set of values to the next
  const offset = 0 // how many bytes inside the buffer to start from
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position)
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexPosition,
    numComponents,
    type,
    normalize,
    stride,
    offset
  )
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition)
}

function setColorAttribute(gl, buffers, programInfo) {
  const numComponents = 4
  const type = gl.FLOAT
  const normalize = false
  const stride = 0
  const offset = 0
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color)
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexColor,
    numComponents,
    type,
    normalize,
    stride,
    offset
  )
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor)
}

function setTextureAttribute(gl, buffers, programInfo) {
  const num = 2 // every coordinate composed of 2 values
  const type = gl.FLOAT
  const normalize = false
  const stride = 0
  const offset = 0
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord)
  gl.vertexAttribPointer(
    programInfo.attribLocations.textureCoord,
    num,
    type,
    normalize,
    stride,
    offset
  )
  gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord)
}

function setNormalAttribute(gl, buffers, programInfo) {
  const numComponents = 3
  const type = gl.FLOAT
  const normalize = false
  const stride = 0
  const offset = 0
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal)
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexNormal,
    numComponents,
    type,
    normalize,
    stride,
    offset
  )
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal)
}

export { drawScene }
