export async function LoadOBJ(file) {
    // read file
    let result
    await fetch(file)
        .then(res => res.text())
        .then((text) => {
            result = text
        })
        .catch((e) => console.error(e))

    let obj = {
        positions: [],
        indices: [],
        textureCoordinates: [],
        vertexNormals: []
    }

    //separate lines
    const lines = result.split("\n")
    for (let i = 0; i < lines.length; i++) {
        if (lines[i][0] == "v" & lines[i][1] == " ") {
            let line = lines[i].slice(2)
            // separate values in lines
            let line_values = line.split(" ")
            for (let i = 0; i < line_values.length; i++) {
                // remove value \r
                let new_line_values = line_values[i].split("\r")
                obj.positions.push(parseFloat(new_line_values[0]))
            }
        } else if (lines[i][0] == "v" & lines[i][1] == "n") {
            let line = lines[i].slice(3)
            let line_values = line.split(" ")
            for (let i = 0; i < line_values.length; i++) {
                let new_line_values = line_values[i].split("\r")
                obj.vertexNormals.push(parseFloat(new_line_values[0]))
            }
        } else if (lines[i][0] == "v" & lines[i][1] == "t") {
            let line = lines[i].slice(3)
            let line_values = line.split(" ")
            for (let i = 0; i < line_values.length; i++) {
                let new_line_values = line_values[i].split("\r")
                obj.textureCoordinates.push(parseFloat(new_line_values[0]))
            }
        } else if (lines[i][0] == "f" & lines[i][1] == " ") {
            let line = lines[i].slice(2)
            let line_values = line.split(" ")
            for (let i = 0; i < line_values.length; i++) {
                let line_values2 = line_values[i].split("/")
                for (let j = 0; j < line_values2.length; j += 3) {
                    let new_line_values = line_values2[j].split("\r")
                    obj.indices.push(parseFloat(new_line_values[0]) - 1)
                }
            }
        }
    }
    return obj
}
