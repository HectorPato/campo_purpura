export interface SliderOptions {
    slideSelector: string;
    sliderSelector: string;
    sliderBtnSelector?: string;
    sliderIndicatorSelector?: string;
    sliderIndicatorActiveClass?: string;
  }
  export type SliderChangeSubscriber = (index: number) => void;
  
  export class Slider {
    private isMoving: boolean = false;
    private currentIndex: number = 1;
    private slider: HTMLElement | null = null;
    private slides: HTMLElement[] = [];
    private buttons: HTMLButtonElement[] = [];
    private indicators: HTMLButtonElement[] = [];
    private observers: SliderChangeSubscriber[] = [];
  
    constructor(
      private readonly root: HTMLElement,
      private readonly options: SliderOptions,
    ) {}
  
    public init() {
      this._registerSelectors();
      this._registerEvents();
    }
  
    public subscribe(cb: SliderChangeSubscriber): void {
      this.observers.push(cb);
    }
    /**
     * Moves the slider to the specified index.
     */
    public moveSliderTo(index: number): void {
      if (this.isMoving) return;
      this.isMoving = true;
      this.currentIndex = index;
      this._moveSlider();
    }
  
    private _registerSelectors() {
      this.slider = this.root.querySelector(this.options.sliderSelector);
      const slides = this.root.querySelectorAll(this.options.slideSelector);
      if (!(slides instanceof NodeList) || !slides.length) {
        throw new Error("Slides not found");
      }
      this.slides = [...(slides as NodeListOf<HTMLElement>)];
      if (this.options.sliderBtnSelector) {
        const buttons = this.root.querySelectorAll(
          this.options.sliderBtnSelector,
        );
        if (!(buttons instanceof NodeList) || !buttons.length) {
          throw new Error("Buttons not found");
        }
        this.buttons = [...(buttons as NodeListOf<HTMLButtonElement>)];
      }
      if (this.options.sliderIndicatorSelector) {
        const indicators = this.root.querySelectorAll(
          this.options.sliderIndicatorSelector,
        );
        if (!(indicators instanceof NodeList) || !indicators.length) {
          throw new Error("Indicators not found");
        }
        this.indicators = [...(indicators as NodeListOf<HTMLButtonElement>)];
      }
    }
    private _registerEvents() {
      if (!this.slider) return;
  
      this.buttons.forEach((btn) => {
        btn.addEventListener("click", this._handleBtnClick.bind(this));
      });
  
      this.indicators.forEach((ind) => {
        ind.addEventListener("click", this._handleIndicatorClick.bind(this));
      });
  
      this.slider.addEventListener("transitionend", () => {
        if (!this.slider) return;
  
        this.isMoving = false;
  
        if (this.currentIndex === 0) {
          this.currentIndex = this.slides.length - 2;
          this.slider.style.transitionDuration = "1ms";
          return this._moveSlider();
        }
  
        if (this.currentIndex === this.slides.length - 1) {
          this.currentIndex = 1;
          this.slider.style.transitionDuration = "1ms";
          return this._moveSlider();
        }
        this.slider.style.transitionDuration = "350ms";
      });
    }
    private _showActiveIndicator() {
      if (!this.options.sliderIndicatorSelector) {
        return;
      }
      this.indicators.forEach((ind) =>
        ind.classList.remove(this.options.sliderIndicatorActiveClass ?? ""),
      );
      let activeIndicator;
      if (
        this.currentIndex === 0 ||
        this.currentIndex === this.slides.length - 2
      ) {
        activeIndicator = this.indicators.length - 1;
      } else if (
        this.currentIndex === this.slides.length - 1 ||
        this.currentIndex === 1
      ) {
        activeIndicator = 0;
      } else {
        activeIndicator = this.currentIndex - 1;
      }
      this.indicators[activeIndicator].classList.add(
        this.options.sliderIndicatorActiveClass ?? "",
      );
    }
    private _moveSlider() {
      if (!this.slider) return;
      this.slider.style.transform = `translateX(-${this.currentIndex * 100}%)`;
      this._showActiveIndicator();
    }
    private _handleBtnClick(e: MouseEvent) {
      if (
        this.isMoving ||
        !e.currentTarget ||
        !(e.currentTarget instanceof HTMLButtonElement)
      ) {
        return;
      }
      this.isMoving = true;
      e.currentTarget.dataset.direction === "next"
        ? this.currentIndex++
        : this.currentIndex--;
      this._moveSlider();
      this._fireSliderChangeEvent();
    }
    private _handleIndicatorClick(e: MouseEvent) {
      if (
        this.isMoving ||
        !e.target ||
        !(e.target instanceof HTMLButtonElement)
      ) {
        return;
      }
      this.isMoving = true;
      this.currentIndex = this.indicators.indexOf(e.target) + 1;
      this._moveSlider();
      this._fireSliderChangeEvent();
    }
    private _fireSliderChangeEvent() {
      this.observers.forEach((cb) => cb(this.currentIndex));
    }
  }