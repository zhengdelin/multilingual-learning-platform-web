import { $query } from "@/api";

export default {
  transform: (lang: string, text: string) => $query.post<string>(`${lang}/text-to-speech`, { text }),
};
