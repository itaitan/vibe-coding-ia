"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createCategory,
  updateCategory,
  type CategoryFormState,
} from "@/app/actions/categories";
import { Loader2, Plus, Pencil } from "lucide-react";
import { toast } from "sonner";

import { HexColorPicker } from "react-colorful";
import EmojiPicker, { Theme } from "emoji-picker-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

interface CategoryFormProps {
  category?: Category; // se presente → edição
}

function SubmitButton({ isEdit, pending }: { isEdit: boolean; pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full h-10 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Salvando...
        </>
      ) : isEdit ? (
        "Salvar alterações"
      ) : (
        "Criar categoria"
      )}
    </button>
  );
}

const PRESET_COLORS = [
  "#F97316", "#3B82F6", "#A855F7", "#EF4444", "#F59E0B", 
  "#22C55E", "#14B8A6", "#EC4899", "#6366F1", "#8B5CF6"
];

const PRESET_ICONS = ["🍔", "🚗", "🎮", "❤️", "🏠", "💼", "💻", "🍿", "🏀", "✈️", "🛒", "💡"];

export function CategoryForm({ category }: CategoryFormProps) {
  const isEdit = !!category;
  const action = isEdit ? updateCategory : createCategory;

  const [open, setOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(category?.color ?? PRESET_COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState(category?.icon ?? PRESET_ICONS[0]);

  const [pending, setPending] = useState(false);
  const [state, setState] = useState<CategoryFormState>(undefined);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setState(undefined);

    const formData = new FormData(e.currentTarget);
    const result = await action(undefined, formData);

    setPending(false);

    if (result?.success) {
      toast.success(isEdit ? "Categoria atualizada!" : "Categoria criada!");
      setOpen(false);
      if (!isEdit) {
        setSelectedColor(PRESET_COLORS[0]);
        setSelectedIcon(PRESET_ICONS[0]);
      }
    } else if (result?.message) {
      toast.error(result.message);
      setState(result);
    } else if (result?.errors) {
      setState(result);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          isEdit ? (
            <button className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60 transition-all">
              <Pencil className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:-translate-y-0.5 active:translate-y-0">
              <Plus className="w-4 h-4" />
              Nova categoria
            </button>
          )
        }
      />

      <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-white">
            {isEdit ? "Editar categoria" : "Nova categoria"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {isEdit && <input type="hidden" name="categoryId" value={category.id} />}

          {state?.message && (
            <div className={`bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400`}>
              {state.message}
            </div>
          )}

          {/* Nome */}
          <div className="space-y-1.5">
            <Label htmlFor="cat-name" className="text-zinc-300 text-sm">Nome</Label>
            <Input
              id="cat-name"
              name="name"
              placeholder="Ex: Assinaturas, Educação..."
              defaultValue={category?.name}
              className="bg-zinc-800/60 border-zinc-700/60 text-white placeholder:text-zinc-600 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/60"
            />
            {state?.errors?.name && (
              <p className="text-xs text-red-400">{state.errors.name[0]}</p>
            )}
          </div>

          {/* Cor */}
          <div className="space-y-2">
            <Label className="text-zinc-300 text-sm">Cor</Label>
            <input type="hidden" name="color" value={selectedColor} />
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className={`w-7 h-7 rounded-full border-2 transition-all ${
                    selectedColor === c ? "border-white scale-110" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
              
              <Popover>
                <PopoverTrigger
                  render={
                    <button
                      type="button"
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                        !PRESET_COLORS.includes(selectedColor) ? "border-white scale-110" : "border-zinc-700/50 opacity-60 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: !PRESET_COLORS.includes(selectedColor) ? selectedColor : 'transparent' }}
                      title="Cor customizada"
                    >
                      <Plus className={`w-3 h-3 ${!PRESET_COLORS.includes(selectedColor) ? 'text-white drop-shadow-md' : 'text-zinc-400'}`} />
                    </button>
                  }
                />
                <PopoverContent className="p-3 border-zinc-800 bg-zinc-900 shadow-2xl">
                  <HexColorPicker color={selectedColor} onChange={setSelectedColor} />
                  <div className="mt-3 pt-3 border-t border-zinc-800">
                    <Input 
                      value={selectedColor.toUpperCase()} 
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="h-8 text-xs font-mono uppercase bg-zinc-950 border-zinc-800"
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            {state?.errors?.color && (
              <p className="text-xs text-red-400">{state.errors.color[0]}</p>
            )}
          </div>

          {/* Ícone */}
          <div className="space-y-2">
            <Label className="text-zinc-300 text-sm">Ícone</Label>
            <input type="hidden" name="icon" value={selectedIcon} />
            <div className="flex flex-wrap gap-2">
              {PRESET_ICONS.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedIcon(i)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center bg-zinc-800/40 border-2 transition-all text-lg ${
                    selectedIcon === i ? "border-emerald-500 bg-zinc-800" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  {i}
                </button>
              ))}

              <Popover>
                <PopoverTrigger
                  render={
                    <button
                      type="button"
                      className={`w-9 h-9 rounded-xl flex items-center justify-center border-2 transition-all text-lg ${
                        !PRESET_ICONS.includes(selectedIcon) ? "border-emerald-500 bg-zinc-800" : "bg-zinc-800/40 border-transparent opacity-60 hover:opacity-100"
                      }`}
                      title="Mais ícones"
                    >
                      {!PRESET_ICONS.includes(selectedIcon) ? selectedIcon : <Plus className="w-4 h-4 text-zinc-400" />}
                    </button>
                  }
                />
                <PopoverContent className="p-0 border-none bg-transparent shadow-none" sideOffset={12}>
                  <EmojiPicker
                    theme={Theme.DARK}
                    onEmojiClick={(emoji) => setSelectedIcon(emoji.emoji)}
                    lazyLoadEmojis
                  />
                </PopoverContent>
              </Popover>
            </div>
            {state?.errors?.icon && (
              <p className="text-xs text-red-400">{state.errors.icon[0]}</p>
            )}
          </div>

          <div className="pt-2">
            <SubmitButton isEdit={isEdit} pending={pending} />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
