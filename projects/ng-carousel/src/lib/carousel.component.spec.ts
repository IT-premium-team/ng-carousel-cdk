import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CarouselComponent } from '../public-api';
import { CarouselSlideDirective } from './carousel-slide.directive';
import { CarouselEngineComponent } from './private/views/carousel-engine.component';

describe('VirtualCarouselComponent smoke test suite', () => {
    let component: CarouselComponent;
    let fixture: ComponentFixture<CarouselComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                BrowserAnimationsModule,
            ],
            declarations: [
                CarouselComponent,
                CarouselSlideDirective,
                CarouselEngineComponent,
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CarouselComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
