import { Check, ChevronDown } from 'lucide-react';
import { SelectAuthorSubjectProps } from './selectAuthorSubject.type';
import { useState } from 'react';

const SelectAuthorSubject: React.FC<SelectAuthorSubjectProps> = ({
  form,
  entity,
  formName,
  formLoading,
}) => {
  const [showGenres, setShowGenres] = useState(false);

  const toggleShowGenres = () => {
    setShowGenres(!showGenres);
  };

  const handleGenreChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    const checked = event.target.checked;

    if (checked) {
      form.setValue(
        formName === 'autores' ? 'autores' : 'materias',
        formName === 'autores'
          ? Array.from(new Set([...form.getValues().autores, id]))
          : Array.from(new Set([...form.getValues().materias, id]))
      );
    } else {
      form.setValue(
        formName === 'autores' ? 'autores' : 'materias',
        form.getValues()[formName === 'autores' ? 'autores' : 'materias'].filter((itemId: number) => itemId !== id)
      );
      
    }
  };

  return (
    <div className="relative inline-block w-full">
      <button
        type="button"
        onClick={toggleShowGenres}
        className="inline-flex justify-between items-center rounded-md h-10 w-full px-3 py-2 text-sm text-left bg-gray-50 border border-primary shadow-sm cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
        disabled={formLoading}
      >
        <span
          className={`${
            form.watch(formName === 'autores' ? 'autores' : 'materias').length >
            0
              ? 'text-black'
              : 'text-gray-500'
          } block truncate`}
        >
          {form.watch(formName === 'autores' ? 'autores' : 'materias').length > 0
            ? form
                .watch(formName === 'autores' ? 'autores' : 'materias')
                .map((id: number) => entity.find((g) => g.id === id)?.nombre)
                .join(', ')
            : formName === 'autores'
            ? 'Seleccione los autores'
            : 'Seleccione las materias'}
        </span>

        <span className="ml-3 float-right">
          <ChevronDown size={20} color="#000" />
        </span>
      </button>

      {showGenres && (
        <div className="mt-2 w-full bg-gray-50 border rounded-md overflow-hidden border-primary divide-y divide-gray-100 shadow-lg">
          <ul className="text-sm text-black max-h-[108px] overflow-y-auto">
            {entity.map(({ id, nombre }) => (
              <li key={id}>
                <label
                  htmlFor={
                    formName === 'autores' ? `autores-${id}` : `materias-${id}`
                  }
                  className="flex justify-between items-center px-4 py-2 hover:bg-black/20 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    id={
                      formName === 'autores' ? `autores-${id}` : `materias-${id}`
                    }
                    value={id.toString()}
                    checked={form
                      .watch(formName === 'autores' ? 'autores' : 'materias')
                      .includes(id)}
                    onChange={(e) => handleGenreChange(e, id)}
                    className="hidden"
                  />
                  {nombre}
                  {form
                    .watch(formName === 'autores' ? 'autores' : 'materias')
                    .includes(id) && <Check size={20} color='#1b4dff' />}
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SelectAuthorSubject;
