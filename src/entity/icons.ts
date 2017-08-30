export class IconsBean{
    private _actionClick: string;
    private _imageSrc: string;
    private _lable: string;
    private _tips: string;
    private _url: string;


	public get actionClick(): string {
		return this._actionClick;
	}

	public set actionClick(value: string) {
		this._actionClick = value;
	}

	public get imageSrc(): string {
		return this._imageSrc;
	}

	public set imageSrc(value: string) {
		this._imageSrc = value;
	}

	public get lable(): string {
		return this._lable;
	}

	public set lable(value: string) {
		this._lable = value;
	}

	public get tips(): string {
		return this._tips;
	}

	public set tips(value: string) {
		this._tips = value;
	}

	public get url(): string {
		return this._url;
	}

	public set url(value: string) {
		this._url = value;
	}
    
}