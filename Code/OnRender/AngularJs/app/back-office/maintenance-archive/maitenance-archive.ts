import { MaintenanceArchiveResult } from "./maitenance-archive-result";

export class MaintenanceArchive{
    constructor(
        public success: string,
        public result: MaintenanceArchiveResult[]
    ){}
}