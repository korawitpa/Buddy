export interface INote {
    title:string,
    content:string,
    createdAt?:Date,
}
export interface INoteTag {
    noteID: number,
    tagID: number
}