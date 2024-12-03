export class PeliculaModel{

    //cuando queremos recuperar el id tenemos que ponerlo en el modelo
    //si no firestone no sabe donde asignarlo
    id?:string;
    nombre!:string;
    descripcion!:string;
    img!:string;
    trailer!:string;
    idUser!:string;
    imgUser?:string

}