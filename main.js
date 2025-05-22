document.addEventListener('DOMContentLoaded', function(){
    const formulario = document.getElementById('tareaForm');
    const inputTarea = document.getElementById('nuevaTarea');
    const inputDescripcion = document.getElementById('cortaDescripcion');
    const listaTarea = document.getElementById('listaTarea');

    // Cargar tareas almacenadas al cargar la página
    cargarTareas();

    formulario.addEventListener('submit', function(event){
        event.preventDefault();
        const tareaTexto = inputTarea.value.trim();
        const descripcionTexto = inputDescripcion.value.trim();

        if(tareaTexto === '') {
            alert('Por favor ingresa una tarea');
            return;
        }

        agregarTarea(tareaTexto, descripcionTexto);
        guardarTareaEnLocalStorage(tareaTexto, descripcionTexto); // Guardar la tarea en localStorage
        inputTarea.value = '';
        inputDescripcion.value = '';
    });

    function agregarTarea(texto, descripcion) {
    const nuevaTarea = document.createElement('li');
    nuevaTarea.textContent = texto;

    let descripcionSpan = null;
    if (descripcion !== '') {
        descripcionSpan = document.createElement('span');
        descripcionSpan.textContent = ` - ${descripcion}`;
        nuevaTarea.appendChild(descripcionSpan);
    }

    // Crear el formulario de edición ANTES de los botones
    const formEdicion = document.createElement('form');
    formEdicion.style.display = 'none';

    const inputEditarTarea = document.createElement('input');
    inputEditarTarea.type = 'text';
    inputEditarTarea.value = texto;
    inputEditarTarea.style.marginRight = '10px';

    const inputEditarDescripcion = document.createElement('input');
    inputEditarDescripcion.type = 'text';
    inputEditarDescripcion.value = descripcion;
    inputEditarDescripcion.style.marginRight = '10px';

    const botonGuardarCambios = document.createElement('button');
    botonGuardarCambios.textContent = 'Guardar';
    botonGuardarCambios.type = 'submit';

    formEdicion.appendChild(inputEditarTarea);
    formEdicion.appendChild(inputEditarDescripcion);
    formEdicion.appendChild(botonGuardarCambios);

    // Evento de submit del formulario
    formEdicion.addEventListener('submit', function (e) {
        e.preventDefault();

        const nuevoTexto = inputEditarTarea.value.trim();
        const nuevaDescripcion = inputEditarDescripcion.value.trim();

        if (nuevoTexto !== '') {
            nuevaTarea.childNodes[0].textContent = nuevoTexto;
            if (descripcionSpan) {
                descripcionSpan.textContent = ` - ${nuevaDescripcion}`;
            } else if (nuevaDescripcion !== '') {
                descripcionSpan = document.createElement('span');
                descripcionSpan.textContent = ` - ${nuevaDescripcion}`;
                nuevaTarea.insertBefore(descripcionSpan, botonEditar);
            }

            editarTareaEnLocalStorage(texto, descripcion, nuevoTexto, nuevaDescripcion);

            // Actualizar valores para futuras ediciones
            texto = nuevoTexto;
            descripcion = nuevaDescripcion;
        }

        formEdicion.style.display = 'none';
    });

    // Botones
    const botonEditar = document.createElement('button');
    botonEditar.textContent = 'Editar';
    botonEditar.addEventListener('click', function () {
        formEdicion.style.display = formEdicion.style.display === 'none' ? 'block' : 'none';
    });

    const botonCompletar = document.createElement('button');
    botonCompletar.textContent = 'Completar';
    botonCompletar.addEventListener('click', function () {
        nuevaTarea.classList.toggle('completed');
        actualizarTareaEnLocalStorage(texto, descripcion, nuevaTarea.classList.contains('completed'));
    });

    const botonEliminar = document.createElement('button');
    botonEliminar.textContent = 'Eliminar';
    botonEliminar.addEventListener('click', function () {
        listaTarea.removeChild(nuevaTarea);
        eliminarTareaDeLocalStorage(texto, descripcion);
    });

    // Agregar todo al <li>
    nuevaTarea.appendChild(botonEditar);
    nuevaTarea.appendChild(botonCompletar);
    nuevaTarea.appendChild(botonEliminar);
    nuevaTarea.appendChild(formEdicion);

    // Agregar a la lista
    listaTarea.appendChild(nuevaTarea);
}



    function cargarTareas() {
        // Obtener las tareas almacenadas en localStorage
        const tareas = JSON.parse(localStorage.getItem('tareas')) || [];

        // Recorrer las tareas y agregarlas a la lista
        tareas.forEach(function(tarea) {
            agregarTarea(tarea.texto, tarea.descripcion);
            if (tarea.completada) {
                // Marcar como completada si está guardada como completada
                const li = listaTarea.lastElementChild;
                li.classList.add('completed');
            }
        });
    }

    function guardarTareaEnLocalStorage(texto, descripcion) {
        const tareas = JSON.parse(localStorage.getItem('tareas')) || [];

        // Agregar la nueva tarea al arreglo de tareas
        tareas.push({ texto: texto, descripcion: descripcion, completada: false });

        // Guardar el arreglo actualizado en localStorage
        localStorage.setItem('tareas', JSON.stringify(tareas));
    }

    function actualizarTareaEnLocalStorage(texto, descripcion, completada) {
        const tareas = JSON.parse(localStorage.getItem('tareas')) || [];

        // Encontrar la tarea correspondiente y actualizar su estado completado
        const tareaActualizada = tareas.find(tarea => tarea.texto === texto && tarea.descripcion === descripcion);
        if (tareaActualizada) {
            tareaActualizada.completada = completada;
            localStorage.setItem('tareas', JSON.stringify(tareas));
        }
    }

    function eliminarTareaDeLocalStorage(texto, descripcion) {
        const tareas = JSON.parse(localStorage.getItem('tareas')) || [];

        // Filtrar las tareas para eliminar la tarea correspondiente
        const tareasFiltradas = tareas.filter(tarea => !(tarea.texto === texto && tarea.descripcion === descripcion));
        localStorage.setItem('tareas', JSON.stringify(tareasFiltradas));
    }

    function editarTareaEnLocalStorage(textoAntiguo, descripcionAntigua, textoNuevo, descripcionNueva) {
        const tareas = JSON.parse(localStorage.getItem('tareas')) || [];
    
        const tarea = tareas.find(t => t.texto === textoAntiguo && t.descripcion === descripcionAntigua);
        if (tarea) {
            tarea.texto = textoNuevo;
            tarea.descripcion = descripcionNueva;
            localStorage.setItem('tareas', JSON.stringify(tareas));
        }
    }
});
