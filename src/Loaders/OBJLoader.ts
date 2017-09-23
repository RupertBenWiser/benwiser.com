import Axios from "axios";

import Model from "../Model";

const ObjLoader = (gl: WebGLRenderingContext, objData: string, texture: string): Model => {
    const lines = objData.split("\n");

    const vertexes: number[][] = [];
    const texCoords: number[][] = [];
    const faces: string[][] = [];

    for (let i in lines) {
      const line = lines[i];
      const lineData = line.split(" ");
      switch(lineData[0]) {
        case "v":
          vertexes.push([Number(lineData[1]), Number(lineData[2]), Number(lineData[3])]);
          break;
        case "vt":
          texCoords.push([Number(lineData[1]), 1 - Number(lineData[2])]);
          break;
        case "f":
          faces.push([lineData[1], lineData[2], lineData[3]]);
          break;
      }
    }

    const orderedVertexes: number[] = [];
    const orderedTexCoords: number[] = [];

    for (let i in faces) {
      const face = faces[i];
      const pointOne = face[0].split("/").map(num => Number(num));
      const pointTwo = face[1].split("/").map(num => Number(num));
      const pointThree = face[2].split("/").map(num => Number(num));

      orderedVertexes.push( ...vertexes[pointOne[0] - 1], ...vertexes[pointTwo[0] - 1], ...vertexes[pointThree[0] - 1]  );
      orderedTexCoords.push( ...texCoords[pointOne[1] - 1], ...texCoords[pointTwo[1] - 1], ...texCoords[pointThree[1] - 1]  );
    }

    return new Model(gl, orderedVertexes, orderedTexCoords, texture);
}

const ObjLoaderFromUrl = async (gl: WebGLRenderingContext, url: string, texture: string): Promise<Model> => {
    const objData = await Axios.get(url);
    return ObjLoader(gl, objData.data, texture);
};

export {
    ObjLoader,
    ObjLoaderFromUrl,
}