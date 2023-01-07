// ==== Types ==== >
import { SpriteState, SpriteStates, Resolution } from "./sprite.interfaces";
// < =====

export default class Sprite {

    /** @get Get Sprite's id as a string. */
    public get id(): string { return this._id };
    private _id: string;

    /** @get Sprite's canvas node link.*/
    public get nodeStyle() { return this._sprite.style };

    /** @get Link to Sprite's DOM-node. */
    public get html(): HTMLElement { return this._sprite };

    // ==== Sprite's body ==== >
    private _sprite!:    HTMLCanvasElement;
    private _2dContext!: CanvasRenderingContext2D;
    private _image!:     HTMLImageElement;
    // < ====

    // ==== Sprite render props ==== >
    private res!:    Resolution;
    private f_res!:  Resolution;
    private frame:   number = 0;
    private cState!: SpriteState;
    private stagger: number;
    private af:      number = 0;
    // < ====

    private _states: SpriteStates = {};

    /**
     * @method Render Sprite's state.
     * @description ### Calls Sprite's configured state.
     * <p>If state's loop equals **false** renderer's loop wound lasts after 1 iteration (number of
     frames in state)
     *
     * If state's loop equals **true** renderer's loop wound iterate utill new state is
     called.
     *
     * FPS equals req.an.frame-rate (same as device monitor's frame rate)</p>
     * */
    public callState(stateID: string, callback?: ()=>any)
    {
        if (this._frameBreak_) cancelAnimationFrame(this._frameBreak_);
        if (this._states[stateID])
        {
            this.cState = this._states[stateID];
            if (this.cState.loop) {this.render()}
            else {
                if(callback) {this._eventCallback_ = ()=>{
                    callback();
                    this._eventCallback_ = undefined
                }};
                this.event()
            };
        } else {
            console.log(`No such state ${stateID}`);
        }
    };

    /**
     * @method Stop renderer.
     * @description ### Stops Sprite's current state loop rendering, if it exists.
     */
    public break(): void
    {
        if(this._frameBreak_) { cancelAnimationFrame(this._frameBreak_)};
        this.af = 0;
        this.frame = 0;
    };

    /**
     * @method Display Sprite.
     * @description ### Mount's Spite to the DOM.
     * <p>If !root, Sprite wound be mounted to the
     * document.body.</p>
     * @param root: HTMLElement
     */
    public display(root?: HTMLElement): void
    {
        (root ? root : document.body).appendChild(this._sprite);
    };

    /**
     * @method Remove Sprite.
     * @description ### Remove Sprite from the DOM and stop rendering state.
     */
    public remove(): void
    {
        this._sprite.remove();
        this.break()
    };

    // ==== __System__ ==== >
    private _eventCallback_?: ()=>any;
    private _frameBreak_?: number;
    // < ====

    // ==== Renderer API ==== >
    // ::: renderloop ::::
    private render(): void
    {
        if (this.af === this.stagger)
        {
            this._2dContext.clearRect(0, 0, this.f_res.x, this.f_res.y);
            this._2dContext.drawImage (
                this._image, this.frame * this.res.x, this.cState.order * this.res.y, this.res.x, this.res.y, 0, 0, this.f_res.x, this.f_res.y
            );
            if(this.frame < this.cState.frames) {this.frame++}
            else {this.frame = 0};
            this.af = 0;
        } else { this.af++ };

        this._frameBreak_ = requestAnimationFrame(this.render);
    }; // < ------

    // ::: renderevent :::
    private event(): void
    {
        if (this.af === this.stagger)
        {
            this._2dContext.clearRect(0, 0, this.f_res.x, this.f_res.y);
            this._2dContext.drawImage (
                this._image, this.frame * this.res.x, this.cState.order * this.res.y, this.res.x, this.res.y, 0, 0, this.f_res.x, this.f_res.y
            );
            if(this.frame < this.cState.frames) {this.frame++}
            else
            {
                this.break();
                if (this._eventCallback_)
                {
                    this._eventCallback_();
                };
                return;
            };
            this.af = 0;
        } else { this.af++ };

        this._frameBreak_ = requestAnimationFrame(this.event);
    }; // < ------

    // < ===================

    constructor(props: {
        id: string,

        spriteSheet: string | URL,

        spriteResolution_width: number,
        spriteResolution_height: number,
        scaleResolution?: number,

        animationStagger: number,
        launchState: SpriteState})
    {
        this._id = props.id;
        Sprite.ProvideCanvasFor(this, props.spriteResolution_width, props.spriteResolution_height, props.scaleResolution);
        Sprite.ProvideSpriteFor(this, props.spriteSheet);
        Sprite.ConfigureResolutionFor(this, props.spriteResolution_width, props.spriteResolution_height, props.scaleResolution);
        Sprite.SetLaunchStateFor(this, props.launchState);

        this.stagger = props.animationStagger;

        this.render = this.render.bind(this);
        this.event = this.event.bind(this);
    };


    public static ConfigureNewStateFor(sprite: Sprite, newState: SpriteState)
    {
        if (sprite._states[newState.id]) {
            console.log(`Tried to reassign an existing state with ID ${newState.id}`)
        } else {
            Object.defineProperty(sprite._states, newState.id, { value: newState });
        }
    };

    public static RemoveStateFrom(sprite: Sprite, stateID: string)
    {
        if (sprite._states[stateID]) {
            delete sprite._states[stateID];
        } else {
            console.log(`No such state with ID ${stateID}`)
        }
    };

    public static CreateNewState(stateID: string, spriteSheetYOrder: number, amountOfFrames: number, loop: boolean): SpriteState
    {
        return {
            id: stateID,
            order: spriteSheetYOrder-1,
            frames: amountOfFrames-1,
            loop: loop
        };
    };

    //MARK: Constructor Methods: --->
    private static ProvideCanvasFor(sprite: Sprite, width: number, height: number, scale: number = 1)
    {
        sprite._sprite = document.createElement('canvas');
        sprite._2dContext = sprite._sprite.getContext('2d')!;
        sprite._sprite.width = width*scale;
        sprite._sprite.height = height*scale;
    };
    private static ProvideSpriteFor(sprite: Sprite, src: string | URL)
    {
        const cache: HTMLImageElement = new Image();
        cache.src = `${src}`;
        sprite._image = cache;
    };
    private static ConfigureResolutionFor(sprite: Sprite, width: number, height: number, scale: number = 1)
    {
        sprite.res = {
            x: width,
            y: height,
        };

        sprite.f_res = {
            x: width*scale,
            y: height*scale,
        };
    };
    private static SetLaunchStateFor(sprite: Sprite, state: SpriteState)
    {
        Object.defineProperty(sprite._states, state.id, { value: state });
        sprite.cState = sprite._states[state.id];
    };
    // <---
};