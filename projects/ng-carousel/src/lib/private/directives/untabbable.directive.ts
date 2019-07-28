import { CdkTrapFocus, InteractivityChecker } from '@angular/cdk/a11y';
import { AfterViewInit, Directive, ElementRef, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';

@Directive({
    selector: '[untabbable]',
})
/**
 * Applies tabindex=-1 for interactive elements inside container
 */
export class FocusBlockDirective implements OnChanges, AfterViewInit, OnDestroy {

    @Input() untabbable = false;
    @Input() focusTrapRef: CdkTrapFocus;
    /** Whether focus inside carousel */
    @Input() focused = false;

    private readonly lastTabindexValueMap = new Map<HTMLElement, string | null>();
    private viewInitiated: boolean;
    private mutationObserver: MutationObserver;

    constructor(
        private elementRef: ElementRef,
        private interactivityChecker: InteractivityChecker,
    ) {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.untabbable && this.viewInitiated) {
            const change = changes.untabbable;
            if (change.currentValue === change.previousValue) {

                return;
            }
            change.currentValue
                ? this.blockTabindex()
                : this.unblockTabindex();
            if (this.focused && this.focusTrapRef) {
                this.focusTrapRef.focusTrap.focusFirstTabbableElement();
            }
        }
    }

    ngAfterViewInit() {
        this.viewInitiated = true;
        this.untabbable
            ? this.blockTabindex()
            : this.unblockTabindex();
    }

    ngOnDestroy() {
        if (this.mutationObserver) {
            this.mutationObserver.disconnect();
            this.mutationObserver = null;
        }
    }

    private blockTabindex(): void {
        const elements: HTMLElement[] = Array.from(this.elementRef.nativeElement.querySelectorAll('*'));
        for (const element of elements) {
            this.blockElement(element);
        }
        if (typeof window !== 'undefined' && 'MutationObserver' in window) {
            this.mutationObserver = new MutationObserver(
                (mutationList: MutationRecord[]) => {
                    const changesArray = Array.from(mutationList);
                    for (const change of changesArray) {
                        if (change.type === 'attributes') {
                            this.blockElement(change.target as HTMLElement);
                        } else if (change.type === 'childList') {
                            change.addedNodes.forEach((element: Node) => {
                                this.blockElement(element as HTMLElement);
                            });
                        }
                    }
                }
            );
            this.mutationObserver.observe(this.elementRef.nativeElement, {
                attributeFilter: ['tabindex'],
                attributes: true,
                childList: true,
                subtree: true,
            });
        }
    }

    private unblockTabindex(): void {
        if (this.mutationObserver) {
            this.mutationObserver.disconnect();
            this.mutationObserver = null;
        }
        const elements: HTMLElement[] = Array.from(this.elementRef.nativeElement.querySelectorAll('*'));
        for (const element of elements) {
            this.unblockElement(element);
        }
    }

    private blockElement(element: HTMLElement): void {
        if (this.interactivityChecker.isFocusable(element) && this.interactivityChecker.isTabbable(element)) {
            const currentTabindexValue = element.getAttribute('tabindex');
            this.lastTabindexValueMap.set(element, currentTabindexValue);
            if (currentTabindexValue !== '-1') {
                element.setAttribute('tabindex', '-1');
            }
        }
    }

    private unblockElement(element: HTMLElement): void {
        if (this.lastTabindexValueMap.has(element) && typeof this.lastTabindexValueMap.get(element) === 'number') {
            element.setAttribute('tabindex', this.lastTabindexValueMap.get(element));
        } else {
            element.removeAttribute('tabindex');
        }
    }
}