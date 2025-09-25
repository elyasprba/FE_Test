import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";

export function useGetListGerbanng({search, page, limit}: {search: string, page: number, limit: number}) {
  return useQuery({
    queryKey: ["gerbang-list", search, page, limit],
    queryFn: async () => {
      const token = Cookies.get("token"); 

      const response = await axios.get(
        `http://localhost:8080/api/gerbangs?NamaGerbang=${search}&page=${page}&limit=${limit}`,
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


export function usePostGerbang() {
  const queryClient = new QueryClient();
  
  return useMutation({
    mutationFn: async (payload) => {
      const res = await axios.post(
        "http://localhost:8080/api/gerbangs", payload,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`, 
          },
        }
      );
      return res.data;
    },
    onSuccess: ()=> {
        queryClient.invalidateQueries({ queryKey: ["gerbang-list"] });
    }
  });
}

export function usePutGerbang() {
    const queryClient = new QueryClient();

    return useMutation({
      mutationFn: async (payload) => {
        const res = await axios.put(
          "http://localhost:8080/api/gerbangs", payload,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`, 
            },
          }
        );
        return res.data;
      },
      onSuccess: ()=> {
          queryClient.invalidateQueries({ queryKey: ["gerbang-list"] });
      }
    });
}

export function useDeleteGerbang() {
  const queryClient = new QueryClient();
  
  return useMutation({
    mutationFn: async (payload) => {
      const res = await axios.delete("http://localhost:8080/api/gerbangs", {
        data: payload,
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`, 
        },
      });
      return res.data;
    },
    onSuccess: ()=> {
        queryClient.invalidateQueries({ queryKey: ["gerbang-list"] });
    }
  });
}