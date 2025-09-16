"use client";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Dialog,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {} from "@radix-ui/react-dialog";
import { useActionState, useEffect, useState } from "react";
import { createCategory, updateCategory } from "../actions";
import { toast } from "sonner";
import { set } from "zod";
import { Category } from "@/app/types/category";
import { Textarea } from "@/components/ui/textarea";
interface EditCategoryDialogProps {
  children: React.ReactNode;
  category: Category;
}

const initialState = {
  errors: undefined,
  message: undefined,
  success: false 
};

export function EditCategoryDialog({ children, category }: EditCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(category.color);

  const [state, formAction, isPending] = useActionState(updateCategory, initialState);

  // Handle login success or error
  useEffect(() => {
    if (state?.success === true) {
      setOpen(false);
      toast.success(state.message);
    } else if (state?.message) {
      toast.error("Error creating category", {
        description: state.message,
      });
    }
  }, [state]);

  const colorOptions = [
    "#6366f1", // Indigo
    "#f59e42", // Orange
    "#10b981", // Emerald
    "#ef4444", // Red
    "#3b82f6", // Blue
    "#f43f5e", // Pink
    "#a78bfa", // Purple
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-4xl">
        <form
          action={formAction}
          className="flex flex-col gap-6"
          autoComplete="off"
        >
         <input type="hidden" name="categoryId" value={category.id} />
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Updatecategory to organize your passwords
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div>
              <Input
                type="text"
                name="categoryName"
                defaultValue={category.name}
                placeholder="Category Name"
                required
                minLength={2}
                maxLength={50}
                className={`border px-2 ${
                  state?.errors?.categoryName ? "border-red-600" : ""
                }`}
              />
              {state?.errors?.categoryName && (
                <p className="text-sm text-red-600">
                  {state.errors.categoryName[0]}
                </p>
              )}
            </div>
            <div>
              <Textarea
                name="categoryDescription"
                defaultValue={category.description ?? ""}
                maxLength={500}
                placeholder="Category Description *optional"
                className={`border px-2 ${
                  state?.errors?.categoryDescription ? "border-red-600" : ""
                }`}
              />
              {state?.errors?.categoryDescription && (
                <p className="text-sm text-red-600">
                  {state.errors.categoryDescription[0]}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2 border px-3 py-3 rounded-2xl shadow-sm">
              <label className="text-sm font-medium">Category Color</label>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-7 h-7 rounded-full border-2 ${
                        selectedColor === color
                          ? "border-indigo-600 border-4"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={selectedColor}
                  name="categoryColor"
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-7 h-7 p-0 border-none bg-transparent"
                  title="Custom color"
                />
              </div>
              {state?.errors?.categoryColor && (
                <p className="text-sm text-red-600">
                  {state.errors.categoryColor[0]}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button className="" type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
