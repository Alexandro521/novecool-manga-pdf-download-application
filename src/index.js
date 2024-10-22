import { novelCoolGet } from "./functions/novelCoolGet.js";
import fs from "fs"
import {pipeline, Readable} from "stream"
import sharp from "sharp";
import document from "pdfkit";

export async function main() {
    try{
    const imgList = await novelCoolGet()
    
    const tranform = await sharp().toFormat('jpeg')
    const imgList2 = imgList.map(async (img,index) => {
        const imgGet = await fetch(img)
        console.log(`page${index}.webp descargando...`)

        return new Promise((resolve, reject) => {
            
            pipeline(imgGet.body,fs.createWriteStream(process.cwd()+`/src/img/page${index}.webp`), (err) => {
                if (err) {
                console.log(`page${index}.webp ha fallado ❌`)

                    reject(err)
                }
                console.log(`page${index}.webp creada ✔`)
                resolve()
            })
        })
    })
    await Promise.all(imgList2)
    console.log("imagenes creadas")
    fs.readdir(process.cwd()+'/src/img',async(err,files)=>{
        if(err){
            console.log(err)
        }

      const sortedFiles = files.sort((a, b) => {
            const numA = parseInt(a.match(/\d+/) || [0], 10);
            const numB = parseInt(b.match(/\d+/) || [0], 10);
            return numA - numB || a.localeCompare(b);
          });

          console.log("directorio webp:")
          console.log(sortedFiles)

        const promiseFiles = sortedFiles.map((file,index) => {
    
          return new Promise((resolve,reject)=>{
              console.log(`page${index}.webp convertiendo...`)
              a(index,resolve,reject)
          })
      });
      await Promise.all(promiseFiles)
      console.log("todas las Imagenes han convertidas ✔")
   
    })
     fs.readdir(process.cwd()+'/src/jpeg',async(err,files)=>{
        if(err){
            console.log(err)
            return
        }

      const sortedFiles = files.sort((a, b) => {
            const numA = parseInt(a.match(/\d+/) || [0], 10);
            const numB = parseInt(b.match(/\d+/) || [0], 10);
            return numA - numB || a.localeCompare(b);
          });
  console.log("creando pdf")
      let doc = new document({autoFirstPage:false});
      doc.pipe(fs.createWriteStream(process.cwd()+'/src/pdf/manga.pdf'));
      sortedFiles.map((imge,Index)=>{
        let  img = doc.openImage(process.cwd()+`/src/jpeg/${imge}`);
        doc.addPage({size: [img.width, img.height]});
        doc.image(img,0,0)
    })
    doc.end()
    })
    }catch(error){
        console.log(error)
    }
}
async function a(index,resolve,reject){
    sharp(process.cwd()+`/src/img/page${index}.webp`)
     .toFormat('jpeg') // Especificamos el formato de salida JPEG
     .jpeg({ quality: 100 }) // Configuramos la calidad del JPEG
     .toFile(process.cwd()+`/src/jpeg/page${index}.jpg`)
     .then(()=>{
        console.log(`Imagen convertida en JPEG con éxito: ${process.cwd()}/src/jpeg/page${index}.jpg ✔`)
        resolve()
    }
     ).catch((err)=>{
        console.log(err)
        reject(err)
     }) // Guardamos la imagen convertida
}

main()