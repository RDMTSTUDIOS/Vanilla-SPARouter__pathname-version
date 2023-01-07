import {PageProtoInterface} from "../../pages/page.interface";
import {ApplicationPathsType} from "../../shared/types/application-paths.type";
import {AppInterface} from "../app/app.interface";
import {SPA_RouterInterface} from "./spa-router.interface";

export default class SPA_Router implements SPA_RouterInterface
{

    public ConfigurePath(pathName: string, page: PageProtoInterface): void
    {
        this.PATHS[pathName] = page;
    };

    private PATHS: ApplicationPathsType = {};
    private SPA_APP!: AppInterface;

    private CurrentPath!: string;
    private Page404: PageProtoInterface;

    public StartRouting(SPA_APP: AppInterface): void
    {
        this.CurrentPath = window.location.pathname;
        this.SPA_APP = SPA_APP;
        this.ChangeRoute();
        this.CheckForUpdate();
    };

    private ChangeRoute(): void
    {
        try
        {
            this.CurrentPath = window.location.pathname;
            const route: PageProtoInterface = this.PATHS[window.location.pathname];
            this.SPA_APP.RenderPage(route ? route : this.Page404);
        }
        catch (e) {}
    };

    private CheckForUpdate(): void
    {
        if (window.location.pathname !== this.CurrentPath) this.ChangeRoute();
        requestAnimationFrame(this.CheckForUpdate);
    };

    constructor(BasePath: string, Page: PageProtoInterface, Page404: PageProtoInterface)
    {
        this.PATHS[BasePath] = Page;
        this.Page404 = Page404;
        this.CheckForUpdate = this.CheckForUpdate.bind(this);
    };
};