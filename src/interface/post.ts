export interface INote {
    title:string,
    content:string,
    createdAt?:Date,
}
export interface ISort {
    header: string,
    direction: string
}
export interface INoteTag {
    noteID: number,
    tagID: number
}