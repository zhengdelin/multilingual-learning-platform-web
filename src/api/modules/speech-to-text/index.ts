import { $query } from "@/api";

export default {
  transform: (lang: string, file: UploadableFile) => {
    const formData = new FormData();
    formData.append("file", file);
    return $query.post<string>(`${lang}/speech-to-text`, formData);
  },
};
