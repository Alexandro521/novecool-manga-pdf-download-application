export async function novelCoolGet(){
    try {
        const img =  await fetch('https://novelcool-api.vercel.app/api/v1/reader/Capitulo-171/12818350/');

        if(img.status !== 200) throw new Error('Error');
        const data = await img.json();
        const pages = data.pages
        return pages
    } catch (error) {
        console.log(error)
    }
}