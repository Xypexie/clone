import uniqid from 'uniqid';
export default class List{
    constructor(){
        this.items = [];
    }
    deleteItem(id){
        // id gedeg ID tai indeksiig massiv aas haij olno.
        const index = this.items.findIndex(el => el.id === id);
        // Ug indejs deerh elementiig massivaas ustgana.
        this.items.splice(index, 1);
    }
    addItem(item){
        let newItem = {
            id: uniqid(),
            item: item
        };
        this.items.push(newItem);
        return newItem;
    }
};