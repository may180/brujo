const express = require("express")
const router = express.Router()
const connection = require('../config/db');
const { Client } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal');
const qri = require('qr-image');
const fs = require('fs');

const client = new Client({
    webVersion: '2.2412.50',
    puppeteer: {
        headless: true,
        args: ['--no-sandbox']
    },
    webVersionCache: {
        type: 'remote',
        remotePath: `https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.50.html`,
    }
});



// client.on('auth_failure', msg => {
//     console.error('Error de autenticación:', msg);
// });

// client.on('disconnected', () => {
//     console.warn('Desconectado de WhatsApp Web');
// });

// client.on('authenticated', () => {
//     console.log('¡Conexión exitosa a WhatsApp Web!');
// });
// client.on('ready', () => {
//     console.log('Cliente de WhatsApp listo!');
// });



router.get('/', (req, res) => {
    res.render('indexola');
});

router.post("/si",(req,res) =>{
    res.render("index_uni");
});

router.post("/no",(req,res)=>{
    res.send("Error_")
})

router.get('/login', (req, res) => {
    res.render('login');
});
 
router.get('/registro', (req, res) => {
    res.render('registro');
});
router.get('/salida', (req, res) => {
    res.render('index_uni');
});



router.get('/servicios', (req, res) => {
    // Consulta los datos de la tabla de servicios
    console.log(req.session.cc)
    if(req.session.cc){
        connection.query('SELECT id_servicio, nombre_servicio, descripcion, img FROM servicio', (error, results, fields) => {
            if (error) {
              throw error;
            }
            // Renderiza la plantilla EJS y pasa los datos como contexto
            res.render('usuario/servicios.ejs', { servicios: results });
          });
    }else{
        res.render('index_uni')
    }
  });

  router.get('/index_adm', (req, res) => {
    if(req.session.cc){
        connection.query('SELECT id_consulta, id_user, id_servicio,fecha_consulta FROM servicio', (error, results, fields) => {
            if (error) {
              throw error;
            }
            console.log(results)
            // Renderiza la plantilla EJS y pasa los datos como contexto
            res.render('adm/index_adm.ejs', { consultas_ver: results });
          });
    }else{
        res.render('index_uni')
    }
    // Consulta los datos de la tabla de servicios
  });



router.post('/consulta_servicio', (req, res) => {

    const idServicio = req.body.id_servicio;
   
    const idUsuario = req.session.cc

    console.log(idUsuario)
    const sql = "INSERT INTO consulta_servicios (id_user, id_servicio) VALUES (?, ?)";
    connection.query(sql, [idUsuario, idServicio], (err, result) => {
        if (err) {
            console.error('Error al registrar la consulta de servicio:', err);
            res.render('error.ejs'); 
        } else {
            console.log('Consulta de servicio registrada correctamente');
            
            const exitoso = result && result.affectedRows > 0;

            if (exitoso) {
                res.render('usuario/exito.ejs'); 
            } else {
                res.render('usuario/error.ejs'); 
            }
        }
    });
}); 



router.post('/register', (req, res) => {
    // Recupera los datos del formulario
    const nombre_usuario = req.body.nombre_usuario;
    const cc = req.body.cc;
    const contraseña = req.body.contraseña;
    const telefono = req.body.telefono
    const indicativo = req.body.indicativo

    if (!nombre_usuario || !cc || !contraseña || !telefono) {
        return res.render('login', { mensaje: "Todos los campos son obligatorios" });
    }
    if (contraseña.length < 8 || !/[!@#$%^&*]/.test(contraseña) || !/\d/.test(contraseña) || !/[A-Z]/.test(contraseña) || /\s/.test(contraseña)) {
        return res.render('login', { mensaje: "La contraseña no cumple con los requisitos" });
    }
    
    const sql = "INSERT INTO user (nombre, cc, contraseña,telefono,rol,indicativo) VALUES (?, ?, ?,?,1,?)";
    connection.query(sql, [nombre_usuario, cc, contraseña,telefono,indicativo], (err, result) => {
        if (err) {
            console.error('Error al insertar los datos:', err);
            res.render('registro.ejs')
        } else {    
            console.log('Datos insertados correctamente');
            res.render('index_uni.ejs')
        }
    });
});

router.post('/login_', (req, res) => {

    const nombre_usuario = req.body.nombre_usuario;
    const cc = req.body.cc;
    const contraseña = req.body.contraseña;

     
    if (!nombre_usuario || !cc || !contraseña) {
        return res.render('login', { mensaje: "Todos los campos son obligatorios" });
    }

  
    if (contraseña.length < 8 || !/[!@#$%^&*]/.test(contraseña) || !/\d/.test(contraseña) || !/[A-Z]/.test(contraseña) || /\s/.test(contraseña)) {
        return res.render('login', { mensaje: "La contraseña no cumple con los requisitos" });
    }

    // Ejecuta la consulta SQL para insertar los datos en la base de datos
    const sql = "SELECT nombre, cc, contraseña,id_user, rol FROM user WHERE nombre = ? AND cc = ? AND contraseña = ?";
    connection.query(sql, [nombre_usuario, cc, contraseña], (err, result) => {
        if (err) {
            console.error('Error al insertar los datos:', err);
       
        } else {    

            console.log('Datos validados correctamente');
            if(result.length > 0){
                console.log(result)
                if(result[0].rol == 2){
                    req.session.cc = result[0].id_user

                    client.initialize();

                    client.on('qr', qr => {
                        console.log(qr);

                        const qrImagePath = 'public/img/qr.png';
        
                        if (fs.existsSync(qrImagePath)) {
                            fs.unlinkSync(qrImagePath);
                        }

                        const qrImage = qri.imageSync(qr, { type: 'png' });
                        fs.writeFileSync(qrImagePath, qrImage);

                        const url = `file://${__dirname}/${qrImagePath}`;
                        console.log('URL del código QR:', url);

                        connection.query(`
                    SELECT c.id_consulta, u.nombre AS nombre_usuario,u.cc AS cc,u.indicativo,u.telefono, s.nombre_servicio AS nombre_servicio, c.fecha_consulta, 
                    CASE WHEN c.estado = 1 THEN 'Consultado' ELSE 'No consultado' END AS estado_consulta
                    FROM consulta_servicios c
                    JOIN user u ON c.id_user = u.id_user
                    JOIN servicio s ON c.id_servicio = s.id_servicio;
                `, (error, results, fields) => {
                    if (error) {
                        throw error;
                    }
                    // Renderiza la plantilla EJS y pasa los datos como contexto
                    const consultas = results;

                    res.render('adm/index_adm.ejs', {consultas});

                    });

                });
                }
                else if(result[0].rol == 1){
                    req.session.cc = result[0].id_user
                    console.log(req.session.cc)
                    res.render("usuario/index_user")
                }
            }else{
                res.send("no esta en la base de datos")
            }
            

           
        }
    });
});

router.post('/consulted',(req,res)=>{
    const estado = req.body.consulted
    const idCons = req.body.id

    let estadoId;

    if(estado == 'consultado'){
        estadoId = 1
    }
    else{
        estadoId = 0
    }

    connection.query(`UPDATE consulta_servicios SET estado = ? WHERE id_consulta = ? `, [estadoId,idCons], (err, result) => {
        if (err) {
            console.error('Error al insertar los datos:', err);
       
        } else {    
            connection.query(`
            SELECT c.id_consulta, u.nombre AS nombre_usuario,u.cc AS cc,u.indicativo,u.telefono, s.nombre_servicio AS nombre_servicio, c.fecha_consulta, 
            CASE WHEN c.estado = 1 THEN 'Consultado' ELSE 'No consultado' END AS estado_consulta
            FROM consulta_servicios c
            JOIN user u ON c.id_user = u.id_user
            JOIN servicio s ON c.id_servicio = s.id_servicio;
        `, (error, results, fields) => {
            if (error) {
                throw error;
            }
            // Renderiza la plantilla EJS y pasa los datos como contexto
            const consultas = results;
            console.log(consultas)
            res.render('adm/index_adm.ejs', { consultas });
        });
           
        }

    })
})


router.post('/reporte',(req,res)=>{

    const nombre = req.body.nombre
    const servicio = req.body.servicio
    const telefono = req.body.telefono
    const indicativo = req.body.indicativo
    const datos = {nombre,servicio,telefono,indicativo}

    res.render('adm/formulario_con.ejs',{datos})

})


router.post('/enviar', (req, res) => {
    const nombre = req.body.nombre;
    const servicio = req.body.servicio;
    const indicativo = req.body.indicativo;
    const telefonoNum = req.body.telefono
    const mensaje = req.body.descripcion;
    const telefono = indicativo + telefonoNum
    console.log(telefono)
    

    // Función para enviar mensaje
    function enviarMensaje(telefono, mensaje) {
        client.sendMessage(`${telefono}@c.us`, mensaje)
            .then(() => {
                console.log('Mensaje enviado correctamente!');

                res.render('adm/exito.ejs')
                
            })
            .catch(error => {
                console.error('Error al enviar el mensaje:', error);
                res.status(500).send('Error al enviar el mensaje');
            });
    }

    enviarMensaje(telefono, mensaje);
});


module.exports = router