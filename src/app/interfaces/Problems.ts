export interface ProblemsResponse {
  problems: Problem[];
}
export interface Problem {
  problemId:number,
  problemLink: string;
  problemName: string;
  numOccur: number;
  status: number;
}

export interface Status{
  statusId:number,
  type:string,
  color:string
}
