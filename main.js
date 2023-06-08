const background = document.getElementById("routeColor");
const getRandomNumber = (maxNum) => {
  return Math.floor(Math.random() * maxNum);
};
const getRandomColor = () => {
  const h = getRandomNumber(100);
  const s = getRandomNumber(200);
  const l = getRandomNumber(50);
  return `hsl(${h}deg, ${s}%, ${l}%)`;
};

background.style.backgroundColor = getRandomColor();


// Obtener el formulario y los elementos del formulario
var form = document.querySelector("form");
var inputIdentificacion = document.getElementById("identificacion");
var inputNombres = document.getElementById("nombres");
var inputApellidos = document.getElementById("apellidos");
var inputTelefono = document.getElementById("telefono");
var inputEmail = document.getElementById("email");
var inputFechaNacimiento = document.getElementById("fechaNacimiento");
var inputNacionalidad = document.getElementById("nacionalidad");

function validarIdentificacionRepetida(identificacion) {
  var clientesGuardados = localStorage.getItem("clientes");

  if (clientesGuardados) {
    var listaClientes = JSON.parse(clientesGuardados);

    for (var i = 0; i < listaClientes.length; i++) {
      if (listaClientes[i].identificacion === identificacion) {
        return false; // El número de identificación ya existe
      }
    }
  }

  return true; // El número de identificación no existe
}

// Agregar un evento de envío al formulario
form.addEventListener("submit", function (event) {
  var identification = inputIdentificacion.value;

  if (!validarIdentificacionRepetida(identification)) {
    event.preventDefault();

    Swal.fire({
      icon: "error",
      title: "Error",
      text: "El número de identificación ya existe",
    });

    return;
  }

  // Crear un objeto para almacenar los datos del cliente
  var cliente = {
    identificacion: inputIdentificacion.value,
    nombres: inputNombres.value,
    apellidos: inputApellidos.value,
    telefono: inputTelefono.value,
    email: inputEmail.value,
    fechaNacimiento: inputFechaNacimiento.value,
    nacionalidad: inputNacionalidad.value,
  };

  // Obtener los datos almacenados en el Local Storage
  var clientesGuardados = localStorage.getItem("clientes");
  var listaClientes = clientesGuardados ? JSON.parse(clientesGuardados) : [];

  // Agregar el nuevo cliente a la lista
  listaClientes.push(cliente);

  // Guardar la lista actualizada en el Local Storage
  localStorage.setItem("clientes", JSON.stringify(listaClientes));

  // Limpiar el formulario
  form.reset();

  // Mostrar los clientes actualizados
  mostrarClientes(listaClientes);
});

// Obtener referencias a los botones
var btnAgregar = document.getElementById("btnAgregar");
var btnListar = document.getElementById("btnListar");

// Agregar eventos de clic a los botones
btnAgregar.addEventListener("click", function () {
  openDiv("divAgregar");
});

btnListar.addEventListener("click", function () {
  openDiv("divListar");
  mostrarClientes(listaClientes);
});

function openDiv(divId) {
  // Obtener todos los divs ocultos
  var divs = document.getElementsByClassName("hidden");

  // Ocultar todos los divs
  for (var i = 0; i < divs.length; i++) {
    divs[i].style.display = "none";
  }

  // Mostrar el div seleccionado
  var selectedDiv = document.getElementById(divId);
  selectedDiv.style.display = "block";
}

// Función para eliminar un cliente de la lista y del Local Storage
function eliminarCliente(cliente) {
  var clientesGuardados = localStorage.getItem("clientes");
  var listaClientes = clientesGuardados ? JSON.parse(clientesGuardados) : [];

  // Encontrar el índice del cliente en la lista
  var indice = listaClientes.findIndex(function (c) {
    return c.identificacion === cliente.identificacion;
  });

  if (indice !== -1) {
    // Eliminar el cliente de la lista
    listaClientes.splice(indice, 1);

    // Guardar la lista actualizada en el Local Storage
    localStorage.setItem("clientes", JSON.stringify(listaClientes));

    // Mostrar la lista actualizada
    mostrarClientes(listaClientes);
  }
}

function editarCliente(cliente) {
  var modalEditar = new bootstrap.Modal(document.getElementById("modalClientsEdit"));
  modalEditar.show();
  // Obtener referencias a los elementos del formulario de editar
  var inputNombres = document.getElementById("nombresEdit");
  var inputApellidos = document.getElementById("apellidosEdit");
  var inputTelefono = document.getElementById("telefonoEdit");
  var inputEmail = document.getElementById("emailEdit");

  // Rellenar los campos del formulario con los datos del cliente
  inputNombres.value = cliente.nombres;
  inputApellidos.value = cliente.apellidos;
  inputTelefono.value = cliente.telefono;
  inputEmail.value = cliente.email;

  // Agregar un evento al botón de guardar cambios
  var btnGuardarCambios = document.getElementById("btnGuardarCambios");
  btnGuardarCambios.addEventListener("click", function (event) {
  event.preventDefault();
    // Obtener los nuevos valores editados del formulario
    var nuevosNombres = inputNombres.value;
    var nuevosApellidos = inputApellidos.value;
    var nuevoTelefono = inputTelefono.value;
    var nuevoEmail = inputEmail.value;

    // Actualizar los datos del cliente en la lista
    cliente.nombres = nuevosNombres;
    cliente.apellidos = nuevosApellidos;
    cliente.telefono = nuevoTelefono;
    cliente.email = nuevoEmail;

    // Obtener los datos almacenados en el Local Storage
    var clientesGuardados = localStorage.getItem("clientes");
    var listaClientes = clientesGuardados ? JSON.parse(clientesGuardados) : [];

    // Actualizar los datos del cliente en la lista del Local Storage
    var clienteIndex = listaClientes.findIndex(function (c) {
      return c.identificacion === cliente.identificacion;
    });
    if (clienteIndex !== -1) {
      listaClientes[clienteIndex] = cliente;
    }

    // Guardar la lista actualizada en el Local Storage
    localStorage.setItem("clientes", JSON.stringify(listaClientes));

    // Cerrar el modal de editar
    var modalEditar = new bootstrap.Modal(document.getElementById("modalClientsEdit"));
    modalEditar.hide();

    // Mostrar la lista actualizada
    mostrarClientes(listaClientes);
  });

}

function mostrarClientes(clientes) {
  var divListar = document.getElementById("listaClientes");
  divListar.innerHTML = "";

  if (clientes && clientes.length > 0) {
    clientes.forEach(function (cliente) {
      var item = document.createElement("li");
      var name = document.createTextNode(
        cliente.nombres + " " + cliente.apellidos
      );
      var doc = document.createElement("p");
      doc.textContent = cliente.identificacion;

      var botonEditar = document.createElement("button");
      botonEditar.textContent = "Editar";
      botonEditar.addEventListener("click", function () {
        editarCliente(cliente);
      });

      var botonEliminar = document.createElement("button");
      botonEliminar.textContent = "Eliminar";
      botonEliminar.addEventListener("click", function () {
        eliminarCliente(cliente);
      });

      item.appendChild(name);
      item.appendChild(doc);
      item.appendChild(botonEditar);
      item.appendChild(botonEliminar);

      divListar.appendChild(item);
    });
  } else {
    var mensaje = document.createElement("p");
    mensaje.textContent = "No hay clientes";
    divListar.appendChild(mensaje);
  }
}

function buscarClientes() {
  var inputBusqueda = document.getElementById("inputBusqueda");
  var filtro = inputBusqueda.value.toLowerCase();

  var clientesGuardados = localStorage.getItem("clientes");

  if (clientesGuardados) {
    var listaClientes = JSON.parse(clientesGuardados);
    var clientesFiltrados = listaClientes.filter(function (cliente) {
      var nombre = cliente.nombres.toLowerCase();
      var apellidos = cliente.apellidos.toLowerCase();
      var identificacion = cliente.identificacion.toLowerCase();
      var filtroMinusculas = filtro.toLowerCase();

      return (
        nombre.includes(filtroMinusculas) ||
        apellidos.includes(filtroMinusculas) ||
        identificacion.includes(filtroMinusculas)
      );
    });

    mostrarClientes(clientesFiltrados);
  }
}

var btnBuscar = document.getElementById("btnBuscar");
btnBuscar.addEventListener("click", buscarClientes);

// Obtener la lista de clientes del Local Storage
var clientesGuardados = localStorage.getItem("clientes");
var listaClientes = clientesGuardados ? JSON.parse(clientesGuardados) : [];
// Mostrar los clientes al cargar la página
mostrarClientes(listaClientes);
