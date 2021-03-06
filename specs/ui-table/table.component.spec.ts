/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';

import {
  createComponent,
  createMouseEvent,
  ElementRefMock,
  Renderer2Mock,
} from '@terminus/fe-testing';
import {
  noop,
  TsWindowService,
} from '@terminus/fe-utilities';
import {
  setColumnAlignment,
  TsHeaderCellDirective,
  TsTableDataSource,
  TsTableModule,
} from '@terminus/ui-table';
import {
  getCells,
  getFooterCells,
  getFooterRows,
  getHeaderCells,
  getRows,
  getTableInstance,
  TestData,
} from '@terminus/ui-table/testing';

import {
  ArrayDataSourceTableApp,
  TableColumnAlignmentTableApp,
  testComponents,
} from './test-components';

/**
 * Custom matcher to determine if the table's contents are correct
 *
 * @param tableElement - The table element to check
 * @param expectedTableContent - The content that should be found in the table
 */
export function expectTableToMatchContent(tableElement: Element, expectedTableContent: any[]): void {
  const missedExpectations: string[] = [];
  /**
   * Check cell contents
   *
   * @param cell
   * @param expectedTextContent
   */
  function checkCellContent(cell: Element, expectedTextContent: string) {
    const actualTextContent = cell.textContent.trim();
    if (actualTextContent !== expectedTextContent) {
      missedExpectations.push(
        `Expected cell contents to be ${expectedTextContent} but was ${actualTextContent}`,
      );
    }
  }

  // Check header cells
  const expectedHeaderContent = expectedTableContent.shift();
  getHeaderCells(tableElement).forEach((cell, index) => {
    const expected = expectedHeaderContent
      ? expectedHeaderContent[index]
      : null;
    checkCellContent(cell, expected);
  });

  // Check data row cells
  const rows = getRows(tableElement);
  expect(rows.length).toBe(expectedTableContent.length);
  rows.forEach((row, rowIndex) => {
    getCells(row).forEach((cell, cellIndex) => {
      const expected = expectedTableContent.length
        ? expectedTableContent[rowIndex][cellIndex]
        : null;
      checkCellContent(cell, expected);
    });
  });

  if (missedExpectations.length) {
    // eslint-disable-next-line no-undef
    fail(missedExpectations.join('\n'));
  }
}

@Injectable({ providedIn: 'root' })
export class TsWindowServiceMock {
  public styleObject: CSSStyleDeclaration = { width: '90px' } as any;

  public get nativeWindow(): Window {
    return {
      getComputedStyle: e => this.styleObject,
      open: noop,
      location: {
        href: 'foo/bar',
        protocol: 'https:',
      },
      alert: noop,
      getSelection: () => ({
        removeAllRanges: noop,
        addRange: noop,
      }),
      scrollTo: (x: number, y: number) => { },
      prompt: noop,
    } as any;
  }
}

describe(`TsTableComponent`, function() {
  test(`should allow a custom ID and fall back to the UID`, function() {
    const fixture = createComponent(testComponents.TableApp, [], [TsTableModule]);
    fixture.detectChanges();
    const instance = getTableInstance(fixture);

    expect(instance.id).toEqual('foobar');

    fixture.componentInstance.myId = undefined as any;
    fixture.detectChanges();
    expect(instance.id).toEqual(expect.stringContaining('ts-table-'));
  });

  describe(`with basic data source`, function() {
    test(`should be able to create a table with the right content and without when row`, function() {
      const fixture = createComponent(testComponents.TableApp, [], [TsTableModule]);
      fixture.detectChanges();

      const tableElement = fixture.nativeElement.querySelector('.ts-table');
      const data = fixture.componentInstance.dataSource.data;
      expectTableToMatchContent(tableElement, [
        ['Column A', 'Column B', 'Column C'],
        [data[0].a, data[0].b, data[0].c],
        [data[1].a, data[1].b, data[1].c],
        [data[2].a, data[2].b, data[2].c],
        ['fourth_row'],
      ]);
    });

    test(`should create a table with special when row`, function() {
      const fixture = createComponent(testComponents.TableWithWhenRowApp, [], [TsTableModule]);
      fixture.detectChanges();

      const tableElement = document.querySelector('.ts-table');
      expectTableToMatchContent(tableElement, [
        ['Column A', 'Column B', 'Column C'],
        ['a_1'],
        ['a_2'],
        ['a_3'],
        ['fourth_row'],
      ]);
    });
  });

  describe(`with TsTableDataSource`, function() {
    let tableElement: HTMLElement;
    let fixture: ComponentFixture<ArrayDataSourceTableApp>;
    let dataSource: TsTableDataSource<TestData>;
    let component: ArrayDataSourceTableApp;

    beforeEach(() => {
      fixture = createComponent(testComponents.ArrayDataSourceTableApp, [], [TsTableModule]);
      fixture.detectChanges();

      tableElement = fixture.nativeElement.querySelector('.ts-table');
      component = fixture.componentInstance;
      dataSource = fixture.componentInstance.dataSource as any;
    });

    test(`should create table and display data source contents`, function() {
      expectTableToMatchContent(tableElement, [
        ['Column A', 'Column B', 'Column C'],
        ['a_1', 'b_1', 'c_1'],
        ['a_2', 'b_2', 'c_2'],
        ['a_3', 'b_3', 'c_3'],
      ]);
    });

    test(`changing data should update the table contents`, function() {
      // Add data
      component.underlyingDataSource.addData();
      fixture.detectChanges();
      expectTableToMatchContent(tableElement, [
        ['Column A', 'Column B', 'Column C'],
        ['a_1', 'b_1', 'c_1'],
        ['a_2', 'b_2', 'c_2'],
        ['a_3', 'b_3', 'c_3'],
        ['a_4', 'b_4', 'c_4'],
      ]);

      // Remove data
      const modifiedData = dataSource.data.slice();
      modifiedData.shift();
      dataSource.data = modifiedData;
      fixture.detectChanges();
      expectTableToMatchContent(tableElement, [
        ['Column A', 'Column B', 'Column C'],
        ['a_2', 'b_2', 'c_2'],
        ['a_3', 'b_3', 'c_3'],
        ['a_4', 'b_4', 'c_4'],
      ]);
    });
  });

  describe(`column width`, () => {
    let fixture: ComponentFixture<TableColumnAlignmentTableApp>;

    beforeEach(() => {
      fixture = createComponent(testComponents.TableColumnAlignmentTableApp, [], [TsTableModule]);
      fixture.detectChanges();
    });

    test(`should set the width`, () => {
      fixture.detectChanges();
      const column = fixture.nativeElement.querySelector('.ts-header-cell.ts-column-column_a');

      let style;
      if (column.style && column.style._values) {
        style = column.style._values['width'];
      }

      expect(style).toEqual('100px');
    });
  });

  describe(`table column alignment`, () => {
    let fixture: ComponentFixture<TableColumnAlignmentTableApp>;

    beforeEach(() => {
      fixture = createComponent(testComponents.TableColumnAlignmentTableApp, [], [TsTableModule]);
      fixture.detectChanges();
    });

    test(`should add the text-align class`, () => {
      const columnA = fixture.nativeElement.querySelector('.ts-cell.ts-column-column_a');
      const columnB = fixture.nativeElement.querySelector('.ts-cell.ts-column-column_b');
      const columnC = fixture.nativeElement.querySelector('.ts-cell.ts-column-column_c');
      expect(columnA.classList).toContain('ts-cell--align-left');
      expect(columnB.classList).toContain('ts-cell--align-center');
      expect(columnC.classList).toContain('ts-cell--align-right');
    });

    test(`should NOT add the text-align style if alignment is not provided`, () => {
      const column = fixture.nativeElement.querySelector('.ts-cell.ts-column-column_b');

      expect(column.classList).not.toContain('ts-cell--align-right');
    });

    test(`should NOT add the text-align style if alignment is not a valid alignment`, () => {
      const column = fixture.nativeElement.querySelector('.ts-cell.ts-column-column_c');

      let style;
      if (column.style && column.style._values) {
        style = column.style._values['text-align'];
      }

      expect(style).toBeUndefined();
    });

    test(`should throw error for invalid alignment arguments`, () => {
      const fakeColumn = { alignment: 'foo' };
      const actual = () => {
        setColumnAlignment(fakeColumn as any, new Renderer2Mock(), new ElementRefMock());
      };
      expect(actual).toThrowError('TsCellDirective: ');
    });
  });

  describe(`pinned header and column`, () => {
    test(`should set a column to be sticky`, () => {
      const fixture = createComponent(testComponents.PinnedTableHeaderColumn, [], [TsTableModule]);
      fixture.detectChanges();
      const tableElement = fixture.nativeElement.querySelector('.ts-table');
      const headerCells = getHeaderCells(tableElement);
      const cells = getCells(tableElement);
      const footerRow = getFooterRows(tableElement)[0];
      const footerCells = getFooterCells(footerRow);

      expect(headerCells[0].classList).toContain('ts-table__column--sticky');
      expect(headerCells[1].classList).not.toContain('ts-table__column--sticky');

      expect(cells[0].classList).not.toContain('ts-table__column--sticky-end');
      expect(cells[2].classList).toContain('ts-table__column--sticky-end');

      expect(footerCells[0].classList).toContain('ts-table__column--sticky');
      expect(footerCells[1].classList).not.toContain('ts-table__column--sticky');
    });

    test(`should only call to update sticky columns if at least one column is marked as sticky`, () => {
      const fixture = createComponent(testComponents.PinnedTableHeaderColumn, [], [TsTableModule]);
      const instance = getTableInstance(fixture);
      instance.updateStickyColumnStyles = jest.fn();
      fixture.detectChanges();

      instance['setColumnWidthStyle']('column_a', 100);
      fixture.detectChanges();
      // 5: 1 initial by the base cdk class, then 1 for each of the 4 columns
      expect(instance.updateStickyColumnStyles).toHaveBeenCalledTimes(5);
    });

    test(`should not call to update sticky columns if none are marked as sticky`, () => {
      const fixture = createComponent(testComponents.TableApp, [], [TsTableModule]);
      const instance = getTableInstance(fixture);
      instance.updateStickyColumnStyles = jest.fn();
      fixture.detectChanges();

      instance['setColumnWidthStyle']('column_a', 100);
      fixture.detectChanges();
      expect(instance.updateStickyColumnStyles).not.toHaveBeenCalledTimes(1);
    });
  });

  describe(`resizable columns`, () => {
    test(`should reveal the 'grabber' when the header cell resize is hovered`, () => {
      const fixture = createComponent(testComponents.TableApp, undefined, [TsTableModule]);
      fixture.detectChanges();
      const tableElement = fixture.nativeElement.querySelector('.ts-table');
      const headerCells = getHeaderCells(tableElement);
      fixture.detectChanges();

      expect(headerCells[0].classList).not.toContain('ts-cell--resizing');

      const firstResizer = headerCells[0].querySelector('.ts-header-cell__resizer')!;
      const mouseenter = createMouseEvent('mouseenter');
      firstResizer.dispatchEvent(mouseenter);
      fixture.detectChanges();

      expect(headerCells[0].classList).toContain('ts-cell--resizing');
      expect(headerCells[1].classList).not.toContain('ts-cell--resizing');

      const mouseleave = createMouseEvent('mouseleave');
      firstResizer.dispatchEvent(mouseleave);
      fixture.detectChanges();

      expect(headerCells[0].classList).not.toContain('ts-cell--resizing');
    });

    test(`should allow column resizing and emit the updated columns`, () => {
      const fixture = createComponent(testComponents.TableApp, [{
        provide: TsWindowService,
        useExisting: TsWindowServiceMock,
      }], [TsTableModule]);
      fixture.detectChanges();
      const tableElement = fixture.nativeElement.querySelector('.ts-table');
      const headerCells = getHeaderCells(tableElement);
      fixture.detectChanges();
      const firstResizer = headerCells[0].querySelector('.ts-header-cell__resizer')!;

      fixture.componentInstance.columnsChanged = jest.fn();

      const mousedownEvent = createMouseEvent('mousedown');
      Object.defineProperties(mousedownEvent, { clientX: { get: () => '300' } });
      firstResizer.dispatchEvent(mousedownEvent);
      fixture.detectChanges();

      const mousemoveEvent = createMouseEvent('mousemove');
      Object.defineProperties(mousemoveEvent, { clientX: { get: () => '280' } });
      document.dispatchEvent(mousemoveEvent);
      fixture.detectChanges();

      const mouseupEvent = createMouseEvent('mouseup');
      document.dispatchEvent(mouseupEvent);
      fixture.detectChanges();
      fixture.detectChanges();

      expect(fixture.componentInstance.columnsChanged).toHaveBeenCalled();
    });

    test(`should stop click propagation so sorting isn't triggered`, () => {
      const fixture = createComponent(testComponents.TableApp, undefined, [TsTableModule]);
      fixture.detectChanges();
      const tableElement = fixture.nativeElement.querySelector('.ts-table');
      const headerCells = getHeaderCells(tableElement);
      fixture.detectChanges();
      const firstResizer = headerCells[0].querySelector('.ts-header-cell__resizer')!;
      const clickEvent = createMouseEvent('click');
      Object.defineProperties(clickEvent, { stopPropagation: { value: jest.fn() } });
      firstResizer.dispatchEvent(clickEvent);
      fixture.detectChanges();

      expect(clickEvent.stopPropagation).toHaveBeenCalled();
    });

    describe(`TsHeaderCellDirective.determineWidth`, () => {
      test(`should not allow column to go below minimum width`, () => {
        expect(TsHeaderCellDirective['determineWidth'](100, -50)).toEqual(70);
        expect(TsHeaderCellDirective['determineWidth'](140, -50)).toEqual(90);
      });
    });

    test(`should remove the resizer element if one exists during creation`, () => {
      const fixture = createComponent(testComponents.TableApp, undefined, [TsTableModule]);
      // NOTE: 2 detection cycles are needed
      fixture.detectChanges();
      fixture.detectChanges();
      const instance = getTableInstance(fixture);
      const cell = instance.headerCells.toArray()[0];
      cell['renderer'].removeChild = jest.fn();
      cell.injectResizeElement();
      fixture.detectChanges();

      expect(cell['renderer'].removeChild).toHaveBeenCalled();
    });

    test.todo(`should update column math on viewport changes`);

    test.todo(`should update column math on column changes`);
  });

  describe(`addRemainingSpaceToLastColumn`, () => {
    test(`should add any remaining table space to the width of the last column`, () => {
      const fixture = createComponent(testComponents.TableApp, undefined, [TsTableModule]);
      fixture.detectChanges();
      const instance = getTableInstance(fixture);
      const columns = [
        {
          name: 'one',
          width: 100,
        },
        {
          name: 'two',
          width: 100,
        },
      ];
      instance['addRemainingSpaceToLastColumn'](columns, 60);
      expect(columns[1].width).toEqual(160);
    });
  });

  describe(`updateInternalColumns`, () => {
    test(`should update internal columns and add space to last column`, () => {
      const columnsToRender = ['column_a', 'column_b', 'column_c'];
      const columns = columnsToRender.map(name => ({
        name,
        width: 100,
      }));
      const fixture = createComponent(testComponents.TableApp, undefined, [TsTableModule]);
      const instance = getTableInstance(fixture);
      fixture.detectChanges();
      // FIXME: Not sure why this flag was needed after the upgrade to Angular v9
      // @ts-ignore
      const mock = jest.spyOn(instance, 'addRemainingSpaceToLastColumn');
      instance['updateInternalColumns'](instance['getFreshColumnsCopy'](columns));
      fixture.detectChanges();

      expect(instance['columnsInternal'].length).toEqual(3);
      expect(mock).toHaveBeenCalled();
    });
  });

  describe(`density`, () => {
    test(`should be able to change the density of the table spacing`, () => {
      const fixture = createComponent(testComponents.TableApp, undefined, [TsTableModule]);
      fixture.detectChanges();
      const tableElement = fixture.nativeElement.querySelector('.ts-table');
      expect(tableElement.classList).toContain('ts-table--comfy');
      expect(tableElement.classList).not.toContain('ts-table--compact');

      fixture.componentInstance.density = 'compact';
      fixture.detectChanges();

      expect(tableElement.classList).not.toContain('ts-table--comfy');
      expect(tableElement.classList).toContain('ts-table--compact');
    });
  });
});

