import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';

import {
  TsPopoverModule,
  TsPopoverPosition,
} from '@terminus/ui-popover';

@Component({
  template: `
    <div class="outside"></div>
    <button
      tsPopoverTrigger="popper1"
      [position]="position"
      [popover]="popper1"
      [defaultOpened]="defaultOpened"
      [hideOnBlur]="hideOnBlur"
      style="margin: 200px 250px;"
      [id]="id"
      (popoverOnShown)="popoverOnShown()"
      (popoverOnHidden)="popoverOnHidden()"
      class="popover-button"
    >Click me!
    </button>
    <ts-popover #popper1>
      <h1>My Title</h1>
      <p>Other random content.</p>
    </ts-popover>
  `,
})
export class Basic {
  public positions = ['bottom', 'top', 'left', 'right'];
  public id = '';
  public hideOnBlur = false;
  public defaultOpened = false;
  public position: TsPopoverPosition = 'right';
  foo = 'bar';
  public popoverOnShown() { }
  public popoverOnHidden() { }
}

@Component({
  template: `
      <div class="outside"></div>
      <button
              tsPopoverTrigger="popper1"
              [position]="position"
              [popover]="popper1"
              [popoverTrigger]="showTrigger"
              style="margin: 200px 250px;"
              [id]="id"
              (popoverOnShown)="popoverOnShown()"
              (popoverOnHidden)="popoverOnHidden()"
              class="popover-button"
      >Click me!
      </button>
      <ts-popover #popper1>
          <h1>My Title</h1>
          <p>Other random content.</p>
      </ts-popover>
  `,
})
export class TriggerOnHover {
  public positions = ['bottom', 'top', 'left', 'right'];
  public id = '';
  public position: TsPopoverPosition = 'right';
  public showTrigger='hover';
  foo = 'bar';
  public popoverOnShown() { }
  public popoverOnHidden() { }
}

@Component({
  template: `
      <div class="outside"></div>
      <button
              tsPopoverTrigger="popper1"
              [position]="position"
              [popover]="popper1"
              [defaultOpened]="defaultOpened"
              [popoverTrigger]="showTrigger"
              (popoverOnShown)="popoverOnShown()"
              (popoverOnHidden)="popoverOnHidden()"
              class="popover-button"
      >Click me!
      </button>
      <ts-popover #popper1>
          <h1>My Title</h1>
          <p>Other random content.</p>
      </ts-popover>
  `,
})
export class DefaultOpen {
  public positions = ['bottom', 'top', 'left', 'right'];
  public defaultOpened = true;
  public showTrigger='click';
  public id = '';
  public hideOnBlur = false;
  public position: TsPopoverPosition = 'right';
  public popoverOnShown() { }
  public popoverOnHidden() { }
}

/**
 * NOTE: Currently all exported Components must belong to a module. So this is our useless module to avoid the build error.
 */
@NgModule({
  imports: [
    CommonModule,
    TsPopoverModule,
  ],
  declarations: [
    Basic,
    DefaultOpen,
    TriggerOnHover,
  ],
})
export class TsPopoverTestComponentsModule {}
