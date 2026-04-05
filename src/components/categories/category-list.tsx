"use client";

import { CategoryForm } from "./category-form";
import { DeleteCategoryDialog } from "./delete-category-dialog";

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  isDefault: boolean;
}

interface CategoryListProps {
  categories: Category[];
}

export function CategoryList({ categories }: CategoryListProps) {
  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 rounded-3xl border border-dashed border-zinc-800">
        <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-2xl mb-4 grayscale opacity-50">
          📁
        </div>
        <p className="text-zinc-500 font-medium italic">Nenhuma categoria encontrada.</p>
        <p className="text-zinc-600 text-xs mt-1">Crie sua primeira categoria personalizada acima.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((category) => (
        <div
          key={category.id}
          className="group relative bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-4 transition-all hover:bg-zinc-900/60 hover:border-zinc-700/60 flex items-center justify-between"
          style={{ 
            boxShadow: `inset 0 0 20px ${category.color}05` 
          }}
        >
          <div className="flex items-center gap-4">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-lg transition-transform group-hover:scale-110"
              style={{ 
                backgroundColor: `${category.color}20`,
                color: category.color,
                boxShadow: `0 8px 16px -4px ${category.color}20`
              }}
            >
              {category.icon}
            </div>
            <div>
              <h3 className="font-semibold text-zinc-100 flex items-center gap-1.5">
                {category.name}
                {category.isDefault && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-500 font-bold uppercase tracking-wider">
                    Padrão
                  </span>
                )}
              </h3>
              <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest mt-0.5">
                Categoria
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <CategoryForm category={category} />
            <DeleteCategoryDialog 
              categoryId={category.id} 
              categoryName={category.name} 
              isDefault={category.isDefault}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
