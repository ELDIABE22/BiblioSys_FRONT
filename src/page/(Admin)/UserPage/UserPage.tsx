import axiosInstance from '@/lib/axios';
import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { IUserData } from './userPage.type';
import { Button } from '@/components/ui/button';
import {
  ChevronsLeft,
  ChevronsRight,
  FileText,
  MoreHorizontal,
} from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import DialogUser from './components/DialogUser/DialogUser';
import AlertDialogDeleteUser from './components/AlertDialogDeleteUser/AlertDialogDeleteUser';
import { ExportToExcel } from '@/components/ExportToExcel';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ExportToPDF, { ITableConfig } from '@/components/ExportToPDF';

const UserPage = () => {
  const [data, setData] = useState<IUserData[] | []>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pageIndex, setPageIndex] = useState(0);

  const pageSize = 5;

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get(
        `${import.meta.env.VITE_API_URL}/library/user`
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

  const userTableConfig: ITableConfig = {
    headers: [
      'ID',
      'Nombres',
      'Apellidos',
      'Usuario',
      'Correo',
      'Rol',
      'Estado',
    ],
    dataKeys: [
      'id',
      'nombres',
      'apellidos',
      'usuario',
      'correo',
      'rol',
      'estado',
    ],
  };

  const columns: ColumnDef<IUserData>[] = [
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
      accessorKey: 'usuario',
      header: 'Usuario',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('usuario')}</div>
      ),
    },
    {
      accessorKey: 'correo',
      header: 'Correo Electrónico',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('correo')}</div>
      ),
    },
    {
      accessorKey: 'rol',
      header: 'Rol',
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.rol === 'Administrador' ? 'default' : 'secondary'
          }
        >
          {row.getValue('rol')}
        </Badge>
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
            <DialogUser
              method="PUT"
              dataToUpdate={row.original}
              fetchUsers={fetchUsers}
            />
            <AlertDialogDeleteUser
              userId={row.original.id}
              fetchUsers={fetchUsers}
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
    fetchUsers();
  }, []);

  return (
    <section className="mx-5 space-y-5">
      <div className="flex space-x-1 max-w-24">
        <DialogUser fetchUsers={fetchUsers} method="POST" />

        <PDFDownloadLink
          document={
            <ExportToPDF
              title="Listado de Usuarios"
              data={data}
              tableConfig={userTableConfig}
            />
          }
          fileName="Usuarios.pdf"
        >
          <Button className="bg-[#FF0000] hover:bg-[#FF0000]/80">
            <FileText /> PDF
          </Button>
        </PDFDownloadLink>

        <ExportToExcel apiData={data} fileName={'Usuarios'} />
      </div>

      {/* TABLE */}
      <div className="border p-5 space-y-5">
        <h2 className="text-center font-bold text-xl border-b-2 border-primary pb-3">
          Listado de Usuarios
        </h2>
        <Input
          placeholder="Buscar por usuario..."
          value={(table.getColumn('usuario')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('usuario')?.setFilterValue(event.target.value)
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
                    data-state={row.getIsSelected() && 'Seleccionado'}
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

export default UserPage;
