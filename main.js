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

        const botonEditar = document.createElement('button');
        botonEditar.textContent = 'Editar';

        const botonCompletar = document.createElement('button');
        botonCompletar.textContent = 'Completar';

        const botonEliminar = document.createElement('button');
        botonEliminar.textContent = 'Eliminar';

        botonEditar.addEventListener('click', function () {
            const nuevoTexto = prompt('Editar tarea:', texto);
            const nuevaDescripcion = prompt('Editar descripción:', descripcion);

            if (nuevoTexto !== null && nuevoTexto.trim() !== "") {
            nuevaTarea.childNodes[0].textContent = nuevoTexto;
            }

            if (nuevaDescripcion !== null) {
                if (descripcionSpan) {
                descripcionSpan.textContent = ` - ${nuevaDescripcion}`;
                } else if (nuevaDescripcion.trim() !== "") {
                    descripcionSpan = document.createElement('span');
                    descripcionSpan.textContent = ` - ${nuevaDescripcion}`;
                    nuevaTarea.insertBefore(descripcionSpan, botonEditar);
                }
            }

            editarTareaEnLocalStorage(texto, descripcion, nuevoTexto.trim(), nuevaDescripcion.trim() || '');

            // Actualizar variables para que otros botones funcionen correctamente
            texto = nuevoTexto.trim();
            descripcion = nuevaDescripcion.trim();
        });

        botonCompletar.addEventListener('click', function () {
            nuevaTarea.classList.toggle('completed');
            actualizarTareaEnLocalStorage(texto, descripcion, nuevaTarea.classList.contains('completed'));
        });

        botonEliminar.addEventListener('click', function () {
            listaTarea.removeChild(nuevaTarea);
            eliminarTareaDeLocalStorage(texto, descripcion);
        });

        nuevaTarea.appendChild(botonEditar);
        nuevaTarea.appendChild(botonCompletar);
        nuevaTarea.appendChild(botonEliminar);
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
