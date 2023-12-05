export type itemType = {
    _id: string
    [key:string] : string
}  

export type structureType = {
    [key:string] : {
        _id: string 
        name: string
        size: string
        blocked: boolean
    }
}