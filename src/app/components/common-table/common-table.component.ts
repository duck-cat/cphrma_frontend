import {
  Component,
  ElementRef,
  ViewChild,
  Input,
  AfterViewInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  OnInit,
  effect,
} from '@angular/core';

import { TabulatorFull as Tabulator } from 'tabulator-tables';
import { CommonTableService } from './common-table.service';
import { Menu } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-common-table',
  standalone: true,
  imports: [MenuModule],
  templateUrl: './common-table.component.html',
  styleUrl: './common-table.component.css',
})
export class CommonTableComponent implements OnInit {
  @ViewChild('tableContainer')
  tableContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('actionMenu') actionMenu!: Menu;
  @Input() data: any[] = [];
  @Input() columns: any[] = [];
  appendTarget: HTMLElement | string | null | undefined = 'body';
  private table!: Tabulator;

  constructor(private dataTransfer: CommonTableService) {
    effect(() => {
      let coloum: any[] = this.dataTransfer.coloum();
      let action: any = {
        title: 'Action',
        field: 'action',
        hozAlign: 'center',
        headerSort: false,
        width: 100,
        formatter: () => {
          return `  <i class="pi pi-ellipsis-v action-menu-icon"
         title="Actions">
      </i>`;
        },
        cellClick: (e: any, cell: any) => {
          const target = e.target as HTMLElement;

          if (target.closest('.action-menu-icon')) {
            const rowData = cell.getRow().getData();
            this.showActionMenu(e, rowData);
          }
        },
      };
      this.columns = [...coloum.filter(res=>res.show_tbl==1), action];
    });
    effect(() => {
      let data: any[] = this.dataTransfer.gridData();
      this.data = data;
      this.initializeTable();
    });
  }
  ngOnInit(): void {
    this.data = [];
  }
  ngAfterViewInit(): void {
    this.initializeTable();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.table) {
      this.table.replaceData(this.data);
    }
  }

  initializeTable(): void {
    this.table = new Tabulator(this.tableContainer.nativeElement, {
      data: this.data,

      layout: 'fitColumns',

      height: '100%',

      pagination: true,
      paginationSize: 20,
      paginationSizeSelector: [10, 20, 50, 100],

      movableColumns: true,

      //  selectableRows: true,

      columns: this.columns,
    });
  }

  selectedRow: any;
  viewRecord(row: any) {
    console.log('View:', row);
  }

  editRecord(row: any) {
    console.log('Edit:', row);
  }

  deleteRecord(row: any) {
    console.log('Delete:', row);
  }
  actionItems: MenuItem[] = [
    {
      label: 'View',
      icon: 'pi pi-eye',
      command: () => this.viewRecord(this.selectedRow),
    },
    {
      label: 'Edit',
      icon: 'pi pi-pencil',
      command: () => this.editRecord(this.selectedRow),
    },
    {
      label: 'Delete',
      icon: 'pi pi-trash',
      command: () => this.deleteRecord(this.selectedRow),
    },
  ];

  showActionMenu(event: MouseEvent, rowData: any) {
    debugger;
    this.selectedRow = rowData;

    const icon = (event.target as HTMLElement).parentElement?.parentElement;
    this.appendTarget = icon;
    this.actionMenu.toggle(event);
  }

  exportCSV(): void {
    this.table.download('csv', 'whatsapp-messages.csv');
  }

  ngOnDestroy(): void {
    if (this.table) {
      this.table.destroy();
    }
  }
}
