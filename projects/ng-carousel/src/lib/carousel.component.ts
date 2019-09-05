import { ChangeDetectionStrategy, Component, ContentChild, Input, Output, ViewEncapsulation } from '@angular/core';
import { map } from 'rxjs/operators';

import { CarouselConfig } from './carousel-config';
import { CarouselSlideDirective } from './carousel-slide.directive';
import { CarouselState } from './private/models/carousel-state';
import { IdGenerator } from './private/models/id-generator';
import { CarouselService } from './private/service/carousel.service';
import { ANIMATION_ID_GENERATOR, SLIDE_ID_GENERATOR } from './private/tokens';
import { HammerService } from './private/service/hammer.service';

export function idGeneratorFactory(): IdGenerator {
    return new IdGenerator();
}

@Component({
    selector: 'ng-carousel',
    templateUrl: 'carousel.component.html',
    styleUrls: ['carousel.component.scss'],
    providers: [
        CarouselService,
        HammerService,
        {
            provide: SLIDE_ID_GENERATOR,
            useFactory: idGeneratorFactory,
        },
        {
            provide: ANIMATION_ID_GENERATOR,
            useFactory: idGeneratorFactory,
        },
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    exportAs: 'ngCarousel',
})
/**
 * Defines carousel API to work with
 */
export class CarouselComponent {

    @ContentChild(CarouselSlideDirective, {static: false}) set slideRef(newSlideRef: CarouselSlideDirective) {
        this.carousel.setSlideTemplate(newSlideRef
            ? newSlideRef.templateRef
            : null
        );
    }

    @Input() set config(newConfig: CarouselConfig) {
        newConfig = new CarouselConfig(newConfig);
        this.carousel.setConfig(newConfig);
    }

    @Output() itemIndexChange = this.carousel.carouselStateChanges()
        .pipe(
            map((state: CarouselState) => state.activeItemIndex),
        );

    constructor(
        private carousel: CarouselService,
    ) {
    }

    next(): void {
        this.carousel.next();
    }

    prev(): void {
        this.carousel.prev();
    }

    setIndex(newIndex: number): void {
        this.carousel.setItemIndex(newIndex);
    }

    /**
     * Programmaticaly recalculates carousel position in case of
     * container size changes or other size interactions
     */
    recalculate(): void {
        this.carousel.recalculate();
    }

}
