export type Import = {
    id:string
    importDate:Date
    transactions:Transaction[]
}

export type Transaction = {
    date:Date
    merchant:string
    details:[{amount:number, category:string, hidden:boolean}]
}
