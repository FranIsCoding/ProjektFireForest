const windVector = [0,350]

class Vertex {
  constructor(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.conections = [];
    this.color = 'green';
    this.divElement = null;
    this.windVector = windVector; // El viento asociado al vértice
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
      div.textContent = this.id;
      div.style.left = `${this.x}px`;
      div.style.top = `${this.y}px`;
      div.style.background = this.color;
      div.addEventListener('click', () => this.spreadFire());  // Usar función flecha
      this.divElement = div;
    } else {
      this.divElement.style.background = this.color;
    }

    return this.divElement;
  }

  spreadFire() {
    if (this.color === 'green') {
      this.changeColor();  // El fuego se enciende en el vértice actual
      this.propagateFire([this]);  // Iniciamos la propagación del fuego desde este vértice
    }
  }

  changeColor() {
    this.color = 'red';
    this.visualizeVertex();  // Actualizamos el color en el DOM
  }

  // Propaga el fuego de forma lenta a los vecinos
  propagateFire(ignitedVertices) {
    const nextIgnitedVertices = [];

    ignitedVertices.forEach(vertex => {
      vertex.conections.forEach(neighbor => {
        if (neighbor.color === 'green') {  // Solo propagar si el vecino aún no está incendiado
          // Evaluamos el viento de cada vértice en base al vértice que lo ha incendiado
          if (this.windCalculus(vertex, neighbor) === 1) {
            nextIgnitedVertices.push(neighbor);
            neighbor.changeColor();  // Cambiar el color del vecino
          }
        }
      });
    });

    // Si aún hay vértices para propagar el fuego, esperamos un tiempo antes de continuar
    if (nextIgnitedVertices.length > 0) {
      setTimeout(() => this.propagateFire(nextIgnitedVertices), 500);  // 500 ms de retraso
    }
  }

  visualizeEdge(vertex) {
    const line = document.createElement('div');
    line.classList.add('line');
    const startX = this.x + 25;
    const startY = this.y + 25;
    const endX = vertex.x + 25;
    const endY = vertex.y + 25;

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
    const x_1 = vertexA.x; // Vértice de origen (el que incendió)
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

    if (windDistance < distance) {
      return 0;  // Si el viento no favorece la propagación
    }

    if (angle > 45 && angle < 315) {  // Si el ángulo está dentro del rango de 45° a 315°, el viento favorece la propagación
      return 0;  // El viento está bloqueando la propagación
    }

    return 1;  // El fuego puede propagarse
  }
}


const vertexA = new Vertex('A', 100, 100);
const vertexB = new Vertex('B', 300, 300);
const vertexC = new Vertex('C', 500, 200);
const vertexD = new Vertex('D', 700, 200);
const vertexE = new Vertex('E', 700, 500);
const vertexF = new Vertex('F', 600, 500);
const forestDiv = document.getElementById('forestDiv');

forestDiv.appendChild(vertexA.visualizeVertex());
forestDiv.appendChild(vertexB.visualizeVertex());
forestDiv.appendChild(vertexC.visualizeVertex());
forestDiv.appendChild(vertexD.visualizeVertex());
forestDiv.appendChild(vertexE.visualizeVertex());
forestDiv.appendChild(vertexF.visualizeVertex());

vertexA.addConecctions(vertexB);
vertexA.addConecctions(vertexC);
vertexB.addConecctions(vertexD);
vertexD.addConecctions(vertexE);
vertexD.addConecctions(vertexF);

