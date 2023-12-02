const{src, dest, watch, parallel} = require("gulp"); //importa funciones de gulp

//parallel ejecuta tareas al mismo tiempo, series una tras otra

//CSS

const sass = require('gulp-sass')(require('sass'));  //Importa la función sass
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');


//IMG

const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif')

//JS

const terser = require('gulp-terser-js');


function css(done){
    src('src/scss/**/*.scss') //Identificar el archivo
        .pipe(sourcemaps.init()) //mantiene la referencia de linea en navegador
        .pipe(plumber()) //Muestra errores sin detener ejecución
        .pipe(sass()) //Compilarlo   
        .pipe( postcss([ autoprefixer(), cssnano() ]) ) //minifica css
        .pipe(sourcemaps.write('.'))
        .pipe(dest("build/css")); //Almacenar en disco duro


    done(); //indica que ya terminó de ejecutarse
}

function imagenes(done){

    const opciones = {
        optimizationLevel: 3
    }

    src('src/img/**/*.{png,jpg}')
        .pipe(cache(imagemin(opciones)))
        .pipe(dest('build/img'))

    done();
}

function versionWebp(done){

    const opciones = {
        quality: 50
    };

    src('src/img/**/*.{png,jpg}')
        .pipe(webp(opciones))
        .pipe(dest('build/img'))

    done();
}

function versionAvif(done){

    const opciones = {
        quality: 50
    };

    src('src/img/**/*.{png,jpg}')
        .pipe(avif(opciones))
        .pipe(dest('build/img'))

    done();
}

function javascript(done){
    src('src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(terser())
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/js'));

    done();
}

function dev(done){

    watch("src/scss/**/*.scss", css)
    watch("src/js/**/*.js", javascript)

    done();
}

exports.css = css;
exports.javascript = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel(imagenes, versionWebp, versionAvif, javascript, dev);

