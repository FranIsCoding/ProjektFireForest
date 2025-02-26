class Vertex {
  constructor(id, x, y, windVector, angleOfIgnition) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.conections = [];
    this.color = 'green';
    this.divElement = null;
    this.windVector = windVector;
    this.angleOfIgnition = angleOfIgnition;
  }

  addConecctions(vertex) {
    this.conections.push(vertex);
    vertex.conections.push(this);
    this.visualizeEdge(vertex);
  }

  visualizeVertex() {
    if (!this.divElement) {
      const div = document.createElement('div');
      div.classList.add('vertex');
      div.style.left = `${this.x}px`;
      div.style.top = `${this.y}px`;
      div.style.background = this.color;
      div.addEventListener('click', () => this.spreadFire());
      this.divElement = div;
    } else {
      this.divElement.style.background = this.color;
    }

    return this.divElement;
  }

  spreadFire() {
    if (this.color === 'green') {
      this.color = 'blue';
      this.visualizeVertex();
      this.propagateFire([this]);
    }
  }

  changeColor() {
    this.color = 'red';
    this.visualizeVertex();
  }

  propagateFire(ignitedVertices) {
    const nextIgnitedVertices = [];

    ignitedVertices.forEach(vertex => {
      vertex.conections.forEach(neighbor => {
        if (neighbor.color === 'green') {
          if (this.windCalculus(vertex, neighbor) === 1) {
            nextIgnitedVertices.push(neighbor);
            neighbor.changeColor();
          }
        }
      });
    });
    if (nextIgnitedVertices.length > 0) {
      setTimeout(() => this.propagateFire(nextIgnitedVertices), 500);
    }
  }

  visualizeEdge(vertex) {
    const line = document.createElement('div');
    line.classList.add('line');
    const startX = this.x + 15;
    const startY = this.y + 15;
    const endX = vertex.x + 15;
    const endY = vertex.y + 15;
    const dx = endX - startX;
    const dy = endY - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    line.style.width = `${distance}px`;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    line.style.transformOrigin = '0 0';
    line.style.transform = `rotate(${angle}deg)`;
    line.style.left = `${startX}px`;
    line.style.top = `${startY}px`;
    const forestDiv = document.getElementById('forestDiv');
    forestDiv.appendChild(line);
  }

  windCalculus(vertexA, vertexB) {
    const x_1 = vertexA.x;
    const y_1 = vertexA.y;
    const x_2 = vertexB.x;
    const y_2 = vertexB.y;
    const dx = x_2 - x_1;
    const dy = y_2 - y_1;
    const windX = dx + (vertexA.windVector[0] * Math.cos(vertexA.windVector[1] * (Math.PI / 180)));
    const windY = dy + (vertexA.windVector[0] * Math.sin(vertexA.windVector[1] * (Math.PI / 180)));
    const windDistance = Math.sqrt(windX * windX + windY * windY);
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.acos((dx * windX + dy * windY) / (windDistance * distance)) * (180 / Math.PI);

    if (angle >= this.angleOfIgnition && angle <= 360 - this.angleOfIgnition) {
      return 0;
    }
    if (windDistance < distance) {
      return 0;
    }
    return 1;
  }
}

function generateRandomVertex(id, vertices, minDistance = 35, windVector = [0,0], angleOfIgnition = 10) {
  let x, y;
  let validPosition = false;

  while (!validPosition) {
    x = Math.floor(Math.random() * 1100) + 100;
    y = Math.floor(Math.random() * 500) + 100;
    validPosition = vertices.every(vertex => {
      const dx = vertex.x - x;
      const dy = vertex.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance > minDistance;
    });
  }

  const newVertex = new Vertex(id, x, y, windVector, angleOfIgnition);
  vertices.push(newVertex);
  return newVertex;
}

function generateRandomConnections(vertices) {
  for (let i = 0; i < vertices.length; i++) {
    for (let j = i + 1; j < vertices.length; j++) {
      const dx = vertices[j].x - vertices[i].x;
      const dy = vertices[j].y - vertices[i].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance <= 100) {
        vertices[i].addConecctions(vertices[j]);
      }
    }
  }
}

const forestDiv = document.getElementById('forestDiv');
const numberOfVertices = 150;
const vertices = [];

for (let i = 0; i < numberOfVertices; i++) {
  const vertex = generateRandomVertex(`V${i + 1}`, vertices);
  vertices.push(vertex);
  forestDiv.appendChild(vertex.visualizeVertex());
}

function resetFire() {
  vertices.forEach(vertex => {
    vertex.color = 'green';
    vertex.visualizeVertex();
  });
}

function updateWind(newWindVector) {
  vertices.forEach(vertex => {
    vertex.windVector = newWindVector;
  });
}

function updateAngle(newAngle) {
  vertices.forEach(vertex => {
    vertex.angleOfIgnition = newAngle;
  });
}

generateRandomConnections(vertices);
