import {AppInterface} from "../app/app.interface";
import {PageProtoInterface} from "../../pages/page.interface";

export interface SPA_RouterInterface
{
    ConfigurePath: (pathName: string, page: PageProtoInterface) => void;
    StartRouting(SPA_APP: AppInterface): void;
}