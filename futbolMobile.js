//-------------GETJSON CON LOS DATOS DE LOS PARTIDOS Y EQUIPOS-----------

$.getJSON("https://api.myjson.com/bins/17bivx", function (data) {
    console.log(data);
    crearFutbolMobile(data);
});

//-------------CHAT--------------

//-------MOSTRAR Y OCULTAR ANTES DEL LOGIN-------

document.getElementById("introduccionLoginID").style.display = 'block';
//$("#introduccionLoginID").show();
$("#loginID").show();
$("#logoGmail").show();
$("#nombreCuandoLogueasID").hide();
$("#postsID").hide();
$("#entradaTextoChatID").hide();
$("#createPostID").hide();

//----------CLICK PARA LOGIN Y ESCRIBIR NUEVO POST-----

//document.getElementById("loginID").addEventListener("click", loginF);
 document.getElementById("loginID").onclick = function () {
     loginF();
 };

document.getElementById("createPostID").addEventListener("click", writeNewPostF);

function loginF() {

    var provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider)
        .then(function () {
            getPostsF();
            document.getElementById("introduccionLoginID").style.display = 'none';
            //            $("#introduccionLoginID").hide();
            $("#loginID").hide();
            $("#logoGmail").hide();
            $("#nombreCuandoLogueasID").show();
            $("#postsID").show();
            $("#entradaTextoChatID").show();
            $("#createPostID").show();

            var nombreAlLoguear = firebase.auth().currentUser.displayName;

            console.log(firebase.auth());
            //            console.log(posts);
            document.getElementById("nombreCuandoLogueasID").innerHTML = "Hola " + nombreAlLoguear +
                '<img class="fotoUsuario" src="' + firebase.auth().currentUser.photoURL + '">';
        });
}

function writeNewPostF() {
    var horaSinSubstring = String(new Date);
    var horaConSubstring = horaSinSubstring.substring(0, 21);
    /*post entry*/
    var postData = {
        name: firebase.auth().currentUser.displayName,
        body: document.getElementById("entradaTextoChatID").value,
        horaEntradaTexto: "(" + horaConSubstring + "h)"
    };
    /*get a key for a new post, chatGeneralFutbol es el nombre del chat*/

    var newPostKey = firebase.database().ref().child('chatGeneralFutbol').push().key;

    var updates = {};

    updates[newPostKey] = postData;

    console.log(newPostKey);
    console.log("updates", updates);
    firebase.database().ref().child('chatGeneralFutbol').update(updates);

    //    console.log("Write!!!");
    //$("#entradaTextoChatID").val("");
    document.getElementById("entradaTextoChatID").value = "";
}

function getPostsF() {
    //    console.log("Getting Posts");
    firebase.database().ref('chatGeneralFutbol').on('value', function (data) {

        var logs = document.getElementById('postsID');
        logs.innerHTML = "";

        var posts = data.val();

        var contenidoPost = "";
        //        console.log(element);
        for (var key in posts) {
            var element = posts[key];
            contenidoPost += '<div class="cajaCadaMensaje">' +
                '<div class="linea1Chat">' + element.name + ' ' + element.horaEntradaTexto + ' ha escrito:</div>' +
                '<div class="linea2Chat">' + element.body + '</div>' +
                '</div>';
            console.log(key);
            console.log(posts[key]);
        }

        document.getElementById("postsID").innerHTML = contenidoPost;

        bajarScroll();
    });
}

function bajarScroll() {
    var position = document.getElementById('postsID').scrollHeight;
    document.getElementById('postsID').scrollTop = position;
}

//------TRANSICIONES DE PAGINAS AL HACER CLICK--------------

$("#botonPartidos").click(function () {
    $(".paginaPartidos").show();
    $(".paginaIndex").hide();
    $(".paginaEstadios").hide();
    $(".paginaChat").hide();
});

$("#botonEstadios").click(function () {
    $(".paginaPartidos").hide();
    $(".paginaIndex").hide();
    $(".paginaEstadios").show();
    $(".paginaChat").hide();
});

$(".botonHome").click(function () {
    $(".paginaPartidos").hide();
    $(".paginaIndex").show();
    $(".paginaEstadios").hide();
    $(".paginaChat").hide();
});

$(".botonVerChat").click(function () {
    $(".paginaPartidos").hide();
    $(".paginaIndex").hide();
    $(".paginaEstadios").hide();
    $(".paginaChat").show();
});

function crearFutbolMobile(data) {
    var contenidoFutbolMobile = "";
    var contenidoEstadios = "";
    var NumEquipoLocal;
    var NumEquipoVisitante;

    for (var i = 0; i < data.partido.length; i++) {

        NumEquipoLocal = data.partido[i].local;
        NumEquipoVisitante = data.partido[i].visitante;

        contenidoFutbolMobile +=
            '<p class="col-8 col-sm-5 fechaPartido">' + data.partido[i].fecha + ' a las ' + data.partido[i].hora + 'h</p>' +
            '<div class="row">' +
            '<div class="col-3 col-sm-2 escudoYnombres">' +
            '<div class="centrarEscudo">' +
            '<img src="imagenes/' + data.equipo[NumEquipoLocal].escudo + '" class="escudosEquipos">' +
            '</div>' +
            '<p class="nombreEquipo">' + data.equipo[NumEquipoLocal].nombre + '</p>' +
            '</div>' +
            '<div class="col-2 col-sm-1">' +
            '<p class="guion">_</p>' +
            '</div>' +
            '<div class="col-3 col-sm-2 escudoYnombres">' +
            '<div class="centrarEscudo">' +
            '<img src="imagenes/' + data.equipo[NumEquipoVisitante].escudo + '" class="escudosEquipos">' +
            '</div>' +
            '<p class="nombreEquipo">' + data.equipo[NumEquipoVisitante].nombre + '</p>' +
            '</div>' +
            '<div class="col-4 col-sm-7">' +
            '<a class="btn btn-primary btn-block botonUbicacion" data-fancybox href="' + data.equipo[NumEquipoLocal].mapaEstadio + '">MAPA</a>' +
            data.equipo[NumEquipoLocal].mapaEstadioIframe +
            '</div>' +
            '</div>';
    }




    var dataOrdenadoEstadios = ordenarEstadios(data);

    for (var i = 0; i < dataOrdenadoEstadios.length; i++) {

        contenidoEstadios +=
            '<div class="estadio2">' +
            '<a class="btn btn-primary textoEnEstadios" data-fancybox href="' + dataOrdenadoEstadios[i].mapaEstadio + '">' + dataOrdenadoEstadios[i].estadio + ',<br>VER MAPA</a>' +
            '<span class="centrarEscudoEstadios">' +
            '<img class="escudosEnEstadios" src="imagenes/' + dataOrdenadoEstadios[i].escudo + '">' +
            '</span>' +
            '</div>';
    }

    document.getElementById("futbolMobileID").innerHTML = contenidoFutbolMobile;
    document.getElementById("estadiosID").innerHTML = contenidoEstadios;
}

// function crearContEstad(data){
//
// }

//------FUNCION PARA ORDENAR LOS ESTADIOS------
function ordenarEstadios(data) {
    // var varEstadios = "estadio";
    return data.equipo.sort(function (a, b) {
        if (a.estadio > b.estadio) {
            return 1;
        }
        if (a.estadio < b.estadio) {
            return -1;
        }
        // a must be equal to b
        return 0;
    });
}