import { Button } from '@/components/ui/button';
import {
  ChevronsLeft,
  ChevronsRight,
  FileText,
  MoreHorizontal,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { IAuthorData } from './authorPage.type';
import axios from 'axios';
import toast from 'react-hot-toast';
import AlertDialogDeleteAuthorSubject from '../components/AlertDialogDeleteAuthorSubject/AlertDialogDeleteAuthorSubject';
import DialogAuthorSubject from '../components/DialogAuthorSubject/DialogAuthorSubject';
import { ExportToExcel } from '@/components/ExportToExcel';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ExportToPDF, { ITableConfig } from '@/components/ExportToPDF';

const AuthorPage = () => {
  const [data, setData] = useState<IAuthorData[] | []>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pageIndex, setPageIndex] = useState(0);

  const pageSize = 5;

  const fetchAuthor = async () => {
    try {
      const res = await axiosInstance.get(
        `${import.meta.env.VITE_API_URL}/library/author`
      );
      setData(res.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (
          error.response?.status !== undefined &&
          error.response?.status >= 400 &&
          error.response?.status <= 499
        ) {
          toast.error(
            error.response?.data.mensaje ||
              error.response?.data.message ||
              'Error interno, intenta más tarde!',
            {
              iconTheme: {
                primary: '#1b4dff',
                secondary: '#fff',
              },
            }
          );
        } else {
          toast.error('Error interno, intenta más tarde!', {
            iconTheme: {
              primary: '#1b4dff',
              secondary: '#fff',
            },
          });
        }
      } else {
        toast.error('Error interno, intenta más tarde!', {
          iconTheme: {
            primary: '#1b4dff',
            secondary: '#fff',
          },
        });
      }
    }
  };

  const authorTableConfig: ITableConfig = {
    headers: ['ID', 'Nombre'],
    dataKeys: ['id', 'nombre'],
  };

  const columns: ColumnDef<IAuthorData>[] = [
    {
      accessorKey: 'nombre',
      header: 'Nombre',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('nombre')}</div>
      ),
    },
    {
      id: 'actions',
      header: 'Acciones',
      enableHiding: false,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="space-y-1 max-w-11">
            <DialogAuthorSubject
              entity="AUTHOR"
              method="PUT"
              dataToUpdate={row.original}
              fetchEntity={fetchAuthor}
            />
            <AlertDialogDeleteAuthorSubject
              id={row.original.id}
              fetchEntity={fetchAuthor}
              entity="AUTHOR"
            />
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: { pageIndex, pageSize },
    },
  });

  useEffect(() => {
    fetchAuthor();
  }, []);

  return (
    <section className="mx-5 space-y-5">
      <div className="flex space-x-1 max-w-24">
        <DialogAuthorSubject
          entity="AUTHOR"
          method="POST"
          fetchEntity={fetchAuthor}
        />
        <PDFDownloadLink
          document={
            <ExportToPDF
              title="Listado de Autores"
              data={data}
              tableConfig={authorTableConfig}
            />
          }
          fileName="Autores.pdf"
        >
          <Button className="bg-[#FF0000] hover:bg-[#FF0000]/80">
            <FileText /> PDF
          </Button>
        </PDFDownloadLink>

        <ExportToExcel apiData={data} fileName={'Autores'} />
      </div>

      {/* TABLE */}
      <div className="border p-5 space-y-5">
        <h2 className="text-center font-bold text-xl border-b-2 border-primary pb-3">
          Listado de Autores
        </h2>
        <Input
          placeholder="Buscar por nombre..."
          value={(table.getColumn('nombre')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('nombre')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-primary">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead className="text-white" key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between space-x-2 py-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              table.previousPage();
              setPageIndex(table.getState().pagination.pageIndex - 1);
            }}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              table.nextPage();
              setPageIndex(table.getState().pagination.pageIndex + 1);
            }}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AuthorPage;
