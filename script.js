const form = document.getElementById("crcForm");
const classNameInput = document.getElementById("className");
const responsibilitiesInput = document.getElementById("responsibilities");
const collaboratorsInput = document.getElementById("collaborators");
const editingIdInput = document.getElementById("editingId");
const cardsContainer = document.getElementById("cards");
const cardCount = document.getElementById("cardCount");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");

let cards = cargarTarjetas();

function cargarTarjetas() {
  try {
    return JSON.parse(localStorage.getItem("tarjetasCRC")) || [];
  } catch {
    return [];
  }
}

function guardarTarjetas() {
  localStorage.setItem("tarjetasCRC", JSON.stringify(cards));
}

function separarLineas(texto) {
  return texto.split("\n").map(item => item.trim()).filter(item => item !== "");
}

function crearLista(elemento, datos) {
  const lista = document.createElement("ul");

  if (datos.length === 0) {
    const item = document.createElement("li");
    item.textContent = "No especificado";
    lista.appendChild(item);
  } else {
    datos.forEach(dato => {
      const item = document.createElement("li");
      item.textContent = dato;
      lista.appendChild(item);
    });
  }

  elemento.appendChild(lista);
}

function mostrarTarjetas() {
  cardsContainer.replaceChildren();

  cardCount.textContent = cards.length +
    (cards.length === 1 ? " tarjeta" : " tarjetas");

  const mensaje = document.createElement("p");
  mensaje.id = "emptyMessage";
  mensaje.textContent = "Todavía no has creado ninguna tarjeta.";
  mensaje.hidden = cards.length > 0;
  cardsContainer.appendChild(mensaje);

  cards.forEach(tarjeta => {
    const card = document.createElement("article");
    card.className = "crc-card";

    const titulo = document.createElement("h3");
    titulo.textContent = "Clase: " + tarjeta.className;

    const columnas = document.createElement("div");
    columnas.className = "crc-card-columns";

    const responsabilidades = document.createElement("section");
    const tituloResp = document.createElement("h4");
    tituloResp.textContent = "Responsabilidades";
    responsabilidades.appendChild(tituloResp);
    crearLista(responsabilidades, tarjeta.responsibilities);

    const colaboradores = document.createElement("section");
    const tituloCol = document.createElement("h4");
    tituloCol.textContent = "Colaboradores";
    colaboradores.appendChild(tituloCol);
    crearLista(colaboradores, tarjeta.collaborators);

    columnas.append(responsabilidades, colaboradores);

    const acciones = document.createElement("div");
    acciones.className = "card-actions";

    const editar = document.createElement("button");
    editar.type = "button";
    editar.textContent = "Editar";
    editar.addEventListener("click", () => editarTarjeta(tarjeta.id));

    const eliminar = document.createElement("button");
    eliminar.type = "button";
    eliminar.textContent = "Eliminar";
    eliminar.className = "eliminar";
    eliminar.addEventListener("click", () => eliminarTarjeta(tarjeta.id));

    acciones.append(editar, eliminar);
    card.append(titulo, columnas, acciones);
    cardsContainer.appendChild(card);
  });
}

form.addEventListener("submit", function(event) {
  event.preventDefault();

  const className = classNameInput.value.trim();
  const responsibilities = separarLineas(responsibilitiesInput.value);
  const collaborators = separarLineas(collaboratorsInput.value);

  if (className === "" || responsibilities.length === 0) {
    alert("Completa el nombre de la clase y sus responsabilidades.");
    return;
  }

  const id = editingIdInput.value;

  if (id) {
    cards = cards.map(tarjeta => tarjeta.id === id
      ? { id, className, responsibilities, collaborators }
      : tarjeta);
  } else {
    cards.push({
      id: String(Date.now()),
      className,
      responsibilities,
      collaborators
    });
  }

  guardarTarjetas();
  mostrarTarjetas();
  limpiarFormulario();
});

function editarTarjeta(id) {
  const tarjeta = cards.find(item => item.id === id);
  if (!tarjeta) return;

  editingIdInput.value = tarjeta.id;
  classNameInput.value = tarjeta.className;
  responsibilitiesInput.value = tarjeta.responsibilities.join("\n");
  collaboratorsInput.value = tarjeta.collaborators.join("\n");
  saveBtn.textContent = "Guardar cambios";
  cancelBtn.hidden = false;
  classNameInput.focus();
}

function eliminarTarjeta(id) {
  if (!confirm("¿Deseas eliminar esta tarjeta?")) return;

  cards = cards.filter(tarjeta => tarjeta.id !== id);
  guardarTarjetas();
  mostrarTarjetas();

  if (editingIdInput.value === id) {
    limpiarFormulario();
  }
}

function limpiarFormulario() {
  form.reset();
  editingIdInput.value = "";
  saveBtn.textContent = "Agregar tarjeta";
  cancelBtn.hidden = true;
}

cancelBtn.addEventListener("click", limpiarFormulario);

document.getElementById("printBtn").addEventListener("click", function() {
  if (cards.length === 0) {
    alert("Primero debes crear una tarjeta.");
    return;
  }
  window.print();
});

mostrarTarjetas();
