import { CategoryView } from "@/types/modules/dictionary";
import { $query } from "../..";
import { Category, CategoryList } from "./index.dto";

export default {
  getCategories: (lang: string) =>
    $query.get<CategoryList, CategoryView[]>(
      `/${lang}/categories`,
      {},
      {},
      {
        transform(input) {
          const stringToCategoryView = (item: string) => ({
            label: item,
            key: item,
          });

          const transformObjectCategory = (item: Record<string, Category>): CategoryView[] => {
            return Object.keys(item).map((key) => {
              const value = item[key];
              if (typeof value === "string") return stringToCategoryView(value);
              else if (Array.isArray(value)) {
                return {
                  label: key,
                  key,
                  children: transformCategories(value),
                };
              } else {
                value;
                return {
                  label: key,
                  key,
                  children: transformObjectCategory(value),
                };
              }
            });
          };

          const transformCategories = (items: CategoryList): CategoryView[] => {
            const transformed = [] as CategoryView[];
            for (const item of items) {
              if (typeof item === "string") {
                transformed.push(stringToCategoryView(item));
              } else {
                transformed.push(...transformObjectCategory(item));
              }
            }
            return transformed;
          };

          return transformCategories(input);
        },
      },
    ),
} as const;
