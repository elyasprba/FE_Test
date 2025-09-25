import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";

export function useGetListLalin({date, page, limit}: {date: string, page?: number, limit?: number}) {
  return useQuery({
    queryKey: ["lalin", date, page, limit],
    queryFn: async () => {
      const token = Cookies.get("token"); 

      const response = await axios.get(
        `http://localhost:8080/api/lalins?tanggal=${date}&page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );

      return response?.data;
    },
  });
}
