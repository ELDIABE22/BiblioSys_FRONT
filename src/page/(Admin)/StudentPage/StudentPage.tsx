import { Button } from '@/components/ui/button';
import {
  ChevronsLeft,
  ChevronsRight,
  FileText,
  MoreHorizontal,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios';
import axios from 'axios';
import toast from 'react-hot-toast';
import { IStudentData } from './studentPage.type';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import AlertDialogDeleteStudent from './components/AlertDialogDeleteStudent/AlertDialogDeleteStudent';
import DialogStudent from './components/DialogStudent/DialogStudent';
import { ExportToExcel } from '@/components/ExportToExcel';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ExportToPDF, { ITableConfig } from '@/components/ExportToPDF';

const StudentPage = () => {
  const [data, setData] = useState<IStudentData[] | []>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pageIndex, setPageIndex] = useState(0);

  const pageSize = 5;

  const fetchStudents = async () => {
    try {
      const res = await axiosInstance.get(
        `${import.meta.env.VITE_API_URL}/library/student`
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

  const studentTableConfig: ITableConfig = {
    headers: [
      'Nombres',
      'Apellidos',
      'Correo',
      'Dirección',
      'Teléfono',
      'Carrera',
      'Estado',
    ],
    dataKeys: [
      'nombres',
      'apellidos',
      'correo',
      'direccion',
      'telefono',
      'carrera',
      'estado',
    ],
  };

  const columns: ColumnDef<IStudentData>[] = [
    {
      accessorKey: 'nombres',
      header: 'Nombre',
      cell: ({ row }) => {
        const names = row.original;
        return (
          <div className="capitalize">{`${names?.nombres.split(' ')[0]} ${
            names?.apellidos.split(' ')[0]
          }`}</div>
        );
      },
    },
    {
      accessorKey: 'correo',
      header: 'Correo Electrónico',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('correo')}</div>
      ),
    },
    {
      accessorKey: 'direccion',
      header: 'Dirección',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('direccion')}</div>
      ),
    },
    {
      accessorKey: 'telefono',
      header: 'Télefono',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('telefono')}</div>
      ),
    },
    {
      accessorKey: 'carrera',
      header: 'Carrera',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('carrera')}</div>
      ),
    },
    {
      accessorKey: 'estado',
      header: 'Estado',
      cell: ({ row }) => (
        <Badge
          variant={row.original.estado === 'Activo' ? 'default' : 'destructive'}
        >
          {row.getValue('estado')}
        </Badge>
      ),
    },
    {
      id: 'actions',
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
            <DialogStudent
              method="PUT"
              dataToUpdate={row.original}
              fetchStudents={fetchStudents}
            />
            <AlertDialogDeleteStudent
              studentId={row.original.id}
              fetchStudents={fetchStudents}
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
    fetchStudents();
  }, []);

  return (
    <section className="mx-5 space-y-5">
      <div className="flex space-x-1 max-w-24">
        <DialogStudent fetchStudents={fetchStudents} method="POST" />

        <PDFDownloadLink
          document={
            <ExportToPDF
              title="Listado de Estudiantes"
              data={data}
              tableConfig={studentTableConfig}
            />
          }
          fileName="Estudiantes.pdf"
        >
          <Button className="bg-[#FF0000] hover:bg-[#FF0000]/80">
            <FileText /> PDF
          </Button>
        </PDFDownloadLink>

        <ExportToExcel apiData={data} fileName={'Estudiantes'} />
      </div>

      {/* TABLE */}
      <div className="border p-5 space-y-5">
        <h2 className="text-center font-bold text-xl border-b-2 border-primary pb-3">
          Listado de Estudiantes
        </h2>
        <Input
          placeholder="Buscar por correo electronico..."
          value={(table.getColumn('correo')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('correo')?.setFilterValue(event.target.value)
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
                    data-state={row.getIsSelected() && 'Selecciona'}
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
                    Sin resultados.
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

export default StudentPage;
