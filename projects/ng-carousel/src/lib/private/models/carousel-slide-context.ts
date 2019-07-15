/**
 * Template context for carousel slide
 */
export class CarouselSlideContext {

    constructor(
        public $implicit: any,
        public isActive: boolean,
        public inViewport: boolean,
    ) {
    }

}
