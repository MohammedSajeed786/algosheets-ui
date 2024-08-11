export interface FilesResponse{
  files:Array<FileInfo>
}

export interface FileInfo{
    id:string,
    name:string,
    mimeType:string,
    kind:string
}
