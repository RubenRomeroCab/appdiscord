export  interface PeliculaModel{

    //cuando queremos recuperar el id tenemos que ponerlo en el modelo
    //si no firestone no sabe donde asignarlo
    id?:string,
    nombre:string;
    descripcion:string;
    img:string;
    trailer:string;
    genre:string;
    proposer_id:number;
    status:any;
    created_at:Date;
    total_votes:number;
    average_rating:number;
    is_next_watch:boolean;
    idUser:string;
    imgUser?:string;


}