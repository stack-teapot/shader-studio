function initBuffers(gl, obj) {
  const positionBuffer = initPositionBuffer(gl, obj.positions)
  const textureCoordBuffer = initTextureBuffer(gl, obj.textureCoordinates)
  const indexBuffer = initIndexBuffer(gl, obj.indices)
  const normalBuffer = initNormalBuffer(gl, obj.vertexNormals)

  return {
    position: positionBuffer,
    normal: normalBuffer,
    textureCoord: textureCoordBuffer,
    indices: indexBuffer,
  }
}

function initPositionBuffer(gl, Positions) {
  const positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  const positions = Positions

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

  return positionBuffer
}

function initColorBuffer(gl, face_colors) {
  const faceColors = face_colors

  var colors = []

  for (var j = 0; j < faceColors.length; ++j) {
    const c = faceColors[j]
    // Repeat each color four times for the four vertices of the face
    colors = colors.concat(c, c, c, c)
  }

  const colorBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)

  return colorBuffer
}

function initIndexBuffer(gl, Indices) {
  const indexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  const indices = Indices

  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW
  )

  return indexBuffer
}

function initTextureBuffer(gl, texture_coordinates) {
  const textureCoordBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer)

  const textureCoordinates = texture_coordinates

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(textureCoordinates),
    gl.STATIC_DRAW
  )

  return textureCoordBuffer
}

function initNormalBuffer(gl, vertex_normals) {
  const normalBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)

  const vertexNormals = vertex_normals

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(vertexNormals),
    gl.STATIC_DRAW
  )

  return normalBuffer
}

export { initBuffers }
