
export default class Likes{
    constructor(){
        this.readDataFromLocalStorage();
        if(!this.likes) this.likes = [];
    }
    addLike(id, title, publisher, img){
        const like = {
            id : id ,
            title: title,
            publisher: publisher,
            img: img
        };
        this.likes.push(like);
        //Browser stroge ruu hadgalna.
        this.saveDataToLocalStorage();
        return like;
    }

    deleteLike(id){
         // id gedeg ID tai like-iig indeksiig massiv aas haij olno.
         const index = this.likes.findIndex(el => el.id === id);
         // Ug indejs deerh elementiig massivaas ustgana.
         this.likes.splice(index, 1);
         this.saveDataToLocalStorage();
    }

    isLiked(id){
       // if(this.likes.findIndex(el => el.id === id) === -1) return false;
       // else return true;
       return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumberOfLikes(){
        return this.likes.length;
    }

    saveDataToLocalStorage(){
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readDataFromLocalStorage(){
       this.likes =  JSON.parse(localStorage.getItem('likes'));
    }
}