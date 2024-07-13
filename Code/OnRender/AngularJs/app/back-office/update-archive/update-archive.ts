import { UpdateArchiveResult } from "./update-archive-result";

export class UpdateArchive{
    
    constructor(
        public success: string,
        public result: UpdateArchiveResult[]
    ){}
}